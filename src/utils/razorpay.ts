import confetti from 'canvas-confetti';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface PaymentOptions {
  amountInINR: number;
  itemName: string;
  itemDescription: string;
  itemId: string;
  type: 'template' | 'mock_test_pass';
  userEmail?: string;
  userName?: string;
  redirectUrl?: string;
  mode?: 'redirect' | 'modal';
  onSuccess?: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
    itemId?: string;
  }) => void;
  onFailure?: (error: any) => void;
}

export interface BackendInitiateResponse {
  success: boolean;
  orderId: string;
  keyId: string;
  amount: number;
  amountInINR: number;
  currency: string;
  itemId: string;
  itemName: string;
  itemDescription?: string;
  type: string;
  paymentGatewayUrl: string;
  redirectUrl?: string;
}

export class RazorpayUtil {
  private static scriptLoaded = false;

  private static getApiBaseUrl(): string {
    if (typeof window !== 'undefined') {
      // If running on same domain or localhost
      if (window.location.port === '3000') {
        return '';
      }
      return 'http://localhost:3000';
    }
    return '';
  }

  static loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') return resolve(false);
      if (window.Razorpay) return resolve(true);

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        this.scriptLoaded = true;
        resolve(true);
      };
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  /**
   * 1. Call Backend API to initiate payment and obtain Payment Gateway URL
   */
  static async createPaymentSession(options: PaymentOptions): Promise<BackendInitiateResponse> {
    const baseUrl = this.getApiBaseUrl();
    const redirectDestination =
      options.redirectUrl ||
      (typeof window !== 'undefined'
        ? `${window.location.origin}${window.location.pathname}?unlockedTemplate=${encodeURIComponent(options.itemId)}&payment=success`
        : `/resume-builder?unlockedTemplate=${encodeURIComponent(options.itemId)}&payment=success`);

    const response = await fetch(`${baseUrl}/api/razorpay/initiate-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: options.amountInINR,
        currency: 'INR',
        itemId: options.itemId,
        itemName: options.itemName,
        itemDescription: options.itemDescription,
        type: options.type,
        userEmail: options.userEmail || 'candidate@example.com',
        userName: options.userName || 'Alex Candidate',
        redirectUrl: redirectDestination,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || err.message || 'Failed to initiate payment on backend');
    }

    return response.json();
  }

  /**
   * 2. Main Entry Point: Initiate Payment via Backend
   */
  static async initiatePayment(options: PaymentOptions) {
    try {
      // Step A: Request payment gateway session from backend
      const session = await this.createPaymentSession(options);

      if (!session || !session.success) {
        throw new Error('Backend payment session creation failed');
      }

      // Step B: If redirect mode (default), open the Payment Gateway URL
      if (options.mode !== 'modal') {
        const fullGatewayUrl = session.paymentGatewayUrl.startsWith('http')
          ? session.paymentGatewayUrl
          : `${this.getApiBaseUrl()}${session.paymentGatewayUrl}`;

        if (typeof window !== 'undefined') {
          window.location.href = fullGatewayUrl;
        }
        return session;
      }

      // Step C: If modal mode is explicitly requested
      const loaded = await this.loadRazorpayScript();
      if (!loaded) {
        const fullGatewayUrl = session.paymentGatewayUrl.startsWith('http')
          ? session.paymentGatewayUrl
          : `${this.getApiBaseUrl()}${session.paymentGatewayUrl}`;
        if (typeof window !== 'undefined') {
          window.location.href = fullGatewayUrl;
        }
        return session;
      }

      const rzpOptions = {
        key: session.keyId || 'rzp_test_cvmaker12345',
        amount: session.amount,
        currency: session.currency || 'INR',
        name: 'Resume Architect AI',
        description: `${options.itemName} - ${options.itemDescription}`,
        image: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
        order_id: session.orderId,
        handler: async (response: any) => {
          try {
            // Verify HMAC signature via backend
            const baseUrl = this.getApiBaseUrl();
            const verifyRes = await fetch(`${baseUrl}/api/razorpay/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                itemId: options.itemId,
                type: options.type,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              try {
                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
              } catch (e) {}
              if (options.onSuccess) {
                options.onSuccess({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  itemId: options.itemId,
                });
              }
            } else {
              alert(verifyData.message || 'Payment signature verification failed.');
              if (options.onFailure) options.onFailure(verifyData);
            }
          } catch (e: any) {
            alert(e.message || 'Signature verification error');
            if (options.onFailure) options.onFailure(e);
          }
        },
        modal: {
          ondismiss: () => {
            console.log('Razorpay modal dismissed');
          },
        },
        prefill: {
          name: options.userName || 'Alex Candidate',
          email: options.userEmail || 'candidate@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#3b82f6',
        },
      };

      const rzp = new window.Razorpay(rzpOptions);
      rzp.open();
      return session;
    } catch (err: any) {
      console.error('[RazorpayUtil Error]:', err);
      alert(err.message || 'Payment gateway connection error. Please try again.');
      if (options.onFailure) options.onFailure(err);
      return null;
    }
  }
}
