import React, { useEffect, useRef, useState } from 'react';

const VIDEO_SRC = '/video/Man_rolling_neck_movements_98e1ec5b_1080p.mp4';
const PHOTO_SRC = '/rajat-avatar.jpg';

interface AvatarCanvas3DProps {
  className?: string;
}

export const AvatarCanvas3D: React.FC<AvatarCanvas3DProps> = ({ className = '' }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<'playing' | 'fading' | 'photo'>('playing');

  // Start single playback pass on mount; if browser blocks autoplay, show photo immediately
  useEffect(() => {
    const video = videoRef.current;
    if (!video || phase !== 'playing') return;

    video.muted = true;
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        setPhase('photo');
      });
    }
  }, [phase]);

  // Unmount video element cleanly once crossfade to photo completes
  useEffect(() => {
    if (phase !== 'fading') return;
    const timer = window.setTimeout(() => {
      setPhase('photo');
    }, 700);
    return () => window.clearTimeout(timer);
  }, [phase]);

  return (
    <div className={`relative w-full flex items-center justify-center select-none px-2 sm:px-4 ${className}`}>
      {/* Soft ambient crimson aura behind the portrait (borderless, static) */}
      <div
        className="absolute w-[320px] sm:w-[400px] md:w-[460px] lg:w-[500px] aspect-square rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(220,38,38,0.3) 0%, rgba(220,38,38,0.08) 48%, transparent 72%)',
          filter: 'blur(64px)',
        }}
      />

      {/* Borderless feathered portrait container — plays video once, then shows static photo only */}
      <div
        className="relative w-full max-w-[340px] sm:max-w-[400px] md:max-w-[460px] lg:max-w-[520px] xl:max-w-[560px] mx-auto overflow-hidden"
        style={{
          aspectRatio: '280 / 330',
          maskImage:
            'radial-gradient(ellipse 47% 49% at 50% 48%, black 52%, rgba(0,0,0,0.65) 72%, transparent 98%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 47% 49% at 50% 48%, black 52%, rgba(0,0,0,0.65) 72%, transparent 98%)',
        }}
      >
        <img
          src={PHOTO_SRC}
          alt="Rajat Ambedkar"
          loading="eager"
          decoding="async"
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ease-out ${
            phase === 'playing' ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {phase !== 'photo' && (
          <video
            ref={videoRef}
            src={VIDEO_SRC}
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={() => setPhase('fading')}
            onError={() => setPhase('photo')}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ease-out ${
              phase === 'fading' ? 'opacity-0' : 'opacity-100'
            }`}
          />
        )}
      </div>
    </div>
  );
};

export default AvatarCanvas3D;
