import React, { useState } from 'react';
import { X, Send, CheckCircle, AlertCircle } from 'lucide-react';
import './ContactFormModal.css';

interface ContactFormModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export const ContactFormModal: React.FC<ContactFormModalProps> = ({ onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [formState, setFormState] = useState<FormState>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required.';
    if (!email.trim()) newErrors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Enter a valid email.';
    if (!message.trim()) newErrors.message = 'Message cannot be empty.';
    else if (message.trim().length < 10) newErrors.message = 'Message must be at least 10 characters.';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setFormState('submitting');

    // Simulate API call
    await new Promise((r) => setTimeout(r, 1800));
    setFormState('success');
    onSuccess();
  };

  return (
    <div className="modal-backdrop" id="contact-modal-backdrop" onClick={onClose}>
      <div className="contact-modal" id="contact-modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="contact-modal-header">
          <div className="contact-header-left">
            <div className="contact-portal-icon">⬡</div>
            <div>
              <h1 className="contact-modal-title">Make Contact</h1>
              <p className="contact-modal-subtitle">Send a transmission through the cyber-network</p>
            </div>
          </div>
          <button
            className="contact-close-btn"
            id="contact-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Success State */}
        {formState === 'success' ? (
          <div className="contact-success" id="contact-success-panel">
            <div className="success-icon-wrap">
              <CheckCircle size={48} color="#39ff14" className="success-icon" />
            </div>
            <h2 className="success-title">Transmission Sent!</h2>
            <p className="success-text">
              Your message is traveling through the neon grid. I'll get back to you soon!
            </p>
            <button className="contact-submit-btn" id="contact-done-btn" onClick={onClose}>
              CLOSE PORTAL
            </button>
          </div>
        ) : (
          <form className="contact-form" id="contact-form" onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <div className="contact-field">
              <label htmlFor="contact-name" className="contact-label">Your Name</label>
              <input
                id="contact-name"
                type="text"
                className={`contact-input ${errors.name ? 'input-error' : ''}`}
                placeholder="Alex Mercer"
                value={name}
                onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })); }}
                disabled={formState === 'submitting'}
                autoComplete="name"
              />
              {errors.name && (
                <span className="contact-error" role="alert">
                  <AlertCircle size={11} /> {errors.name}
                </span>
              )}
            </div>

            {/* Email */}
            <div className="contact-field">
              <label htmlFor="contact-email" className="contact-label">Email Address</label>
              <input
                id="contact-email"
                type="email"
                className={`contact-input ${errors.email ? 'input-error' : ''}`}
                placeholder="alex@cyberspace.io"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })); }}
                disabled={formState === 'submitting'}
                autoComplete="email"
              />
              {errors.email && (
                <span className="contact-error" role="alert">
                  <AlertCircle size={11} /> {errors.email}
                </span>
              )}
            </div>

            {/* Message */}
            <div className="contact-field">
              <label htmlFor="contact-message" className="contact-label">Message</label>
              <textarea
                id="contact-message"
                className={`contact-textarea ${errors.message ? 'input-error' : ''}`}
                placeholder="Hey, I'd love to collaborate on a project..."
                value={message}
                onChange={(e) => { setMessage(e.target.value); setErrors((p) => ({ ...p, message: '' })); }}
                disabled={formState === 'submitting'}
                rows={5}
              />
              <div className="char-count">{message.length} / 500</div>
              {errors.message && (
                <span className="contact-error" role="alert">
                  <AlertCircle size={11} /> {errors.message}
                </span>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="contact-submit-btn"
              className={`contact-submit-btn ${formState === 'submitting' ? 'submitting' : ''}`}
              disabled={formState === 'submitting'}
            >
              {formState === 'submitting' ? (
                <>
                  <span className="spinner" /> TRANSMITTING...
                </>
              ) : (
                <>
                  <Send size={14} /> SEND TRANSMISSION
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
