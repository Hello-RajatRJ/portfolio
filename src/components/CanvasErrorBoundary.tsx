import React, { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class CanvasErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('3D Graphics / Canvas Error Caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: '#070a12',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#f8fafc',
          fontFamily: 'Orbitron, sans-serif',
          padding: '20px',
          textAlign: 'center',
          zIndex: 50
        }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#38bdf8', marginBottom: '12px' }}>
            GRAPHICS ENGINE RECOVERY
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', maxWidth: '420px', marginBottom: '20px', lineHeight: 1.5 }}>
            A temporary WebGL resource interruption occurred. Click below to re-initialize the 3D scene.
          </div>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: '10px 24px',
              background: '#38bdf8',
              color: '#082f49',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 900,
              cursor: 'pointer',
              fontSize: '0.75rem',
              letterSpacing: '0.1em'
            }}
          >
            RE-INITIALIZE SPEEDWAY
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

