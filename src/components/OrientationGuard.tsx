import React, { useState, useEffect } from 'react';

/**
 * OrientationGuard — shows a "rotate device" overlay when
 * the game is active on a mobile device held in portrait orientation.
 */
export const OrientationGuard: React.FC = () => {
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouchDevice) return; // Desktop: never show

    const check = () => {
      const isPortrait = window.innerHeight > window.innerWidth;
      setShowOverlay(isPortrait);
    };

    check();
    window.addEventListener('resize', check);
    window.addEventListener('orientationchange', check);

    return () => {
      window.removeEventListener('resize', check);
      window.removeEventListener('orientationchange', check);
    };
  }, []);

  if (!showOverlay) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(4, 4, 20, 0.97)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Animated phone icon */}
      <div
        style={{
          fontSize: '80px',
          animation: 'rotatePhone 1.8s ease-in-out infinite',
        }}
      >
        📱
      </div>

      <div
        style={{
          fontFamily: "'Orbitron', monospace",
          fontSize: '1rem',
          letterSpacing: '0.2em',
          color: '#00f0ff',
          textTransform: 'uppercase',
          textAlign: 'center',
          textShadow: '0 0 12px #00f0ff',
        }}
      >
        Rotate Your Device
      </div>

      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.8rem',
          color: 'rgba(255, 255, 255, 0.5)',
          textAlign: 'center',
          maxWidth: '240px',
          lineHeight: 1.6,
        }}
      >
        This game is best played in{' '}
        <span style={{ color: '#a855f7' }}>landscape mode</span>.
        Please rotate your phone horizontally.
      </div>

      {/* Neon border glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          border: '2px solid rgba(0, 240, 255, 0.1)',
          pointerEvents: 'none',
        }}
      />

      <style>{`
        @keyframes rotatePhone {
          0%   { transform: rotate(0deg); }
          30%  { transform: rotate(0deg); }
          60%  { transform: rotate(90deg); }
          90%  { transform: rotate(90deg); }
          100% { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
};
