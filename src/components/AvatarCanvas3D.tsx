import React, { useRef, useState, useEffect, useCallback } from 'react';

// ─── 18 HIGH-RESOLUTION TRANSPARENT CUTOUT FRAMES ───
const FRAMES = {
  front: '/avatar_transparent/front.webp',
  front_left: '/avatar_transparent/front_left.webp',     // Face turned to viewer's left (45°)
  front_right: '/avatar_transparent/front_right.webp',   // Face turned to viewer's right (45°)
  profile_left: '/avatar_transparent/profile_left.webp', // Face facing viewer's left (90°)
  profile_right: '/avatar_transparent/profile_right.webp', // Face facing viewer's right (90°)
  up: '/avatar_transparent/up.webp',                     // Looking straight up
  down: '/avatar_transparent/down.webp',                 // Looking straight down
  up_left: '/avatar_transparent/up_left.webp',           // Looking up and viewer's left
  up_right: '/avatar_transparent/up_right.webp',         // Looking up and viewer's right
  down_left: '/avatar_transparent/down_left.webp',       // Looking down and viewer's left
  down_right: '/avatar_transparent/down_right.webp',     // Looking down and viewer's right
  smile: '/avatar_transparent/smile.webp',               // Warm friendly smile
  wink: '/avatar_transparent/wink.webp',                 // Playful wink
  serious: '/avatar_transparent/serious.webp',           // Focused developer look
  surprised: '/avatar_transparent/surprised.webp',       // Surprised reaction
  angry: '/avatar_transparent/angry.webp',               // Intense focus
  look_away: '/avatar_transparent/look_away.webp',       // Subtle look away
  back: '/avatar_transparent/back.webp',                 // Back of head
} as const;

type FrameKey = keyof typeof FRAMES;

interface AvatarCanvas3DProps {
  className?: string;
}

export const AvatarCanvas3D: React.FC<AvatarCanvas3DProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Preloaded image elements
  const imageMap = useRef<Record<string, HTMLImageElement>>({});

  // Frame blending state (pure ref-based for 120 FPS zero-jitter animation)
  const currentBaseKey = useRef<FrameKey>('front');
  const targetKey = useRef<FrameKey>('front');
  const blendFactor = useRef<number>(1.0);
  const lastTimeRef = useRef<number>(performance.now());

  // Interactive reactions
  const [isWinking, setIsWinking] = useState(false);
  const [isSmiling, setIsSmiling] = useState(false);

  // Mouse physics tracking (ref-based for zero-re-render 60-120fps performance)
  const mousePos = useRef({ x: 0, y: 0 });
  const animFrameId = useRef<number | null>(null);
  const lastActiveTime = useRef<number>(Date.now());

  // Preload all 18 frames into memory immediately
  useEffect(() => {
    (Object.keys(FRAMES) as FrameKey[]).forEach((key) => {
      const img = new Image();
      img.src = FRAMES[key];
      imageMap.current[key] = img;
    });
  }, []);

  // Compute the optimal head frame with natural deadzones and hysteresis
  // atan2(normY, normX):
  // 0° = Right, +45° = Down-Right, +90° = Down, +135° = Down-Left,
  // 180°/-180° = Left, -135° = Up-Left, -90° = Up, -45° = Up-Right
  const getTargetFrameKey = useCallback(
    (normX: number, normY: number, currentKey: FrameKey): FrameKey => {
      if (isWinking) return 'wink';
      if (isSmiling) return 'smile';

      const dist = Math.hypot(normX, normY);

      // ── Center Deadzone with Hysteresis ──
      const isCurrentFront = currentKey === 'front' || currentKey === 'smile';
      const frontThreshold = isCurrentFront ? 0.22 : 0.16;

      if (dist < frontThreshold) {
        return 'front';
      }

      // Angle in degrees [-180, 180]
      const angleDeg = (Math.atan2(normY, normX) * 180) / Math.PI;

      // ── Extreme Profile Threshold (90° turn) ──
      const isCurrentProfile = currentKey === 'profile_right' || currentKey === 'profile_left';
      const profileThreshold = isCurrentProfile ? 0.65 : 0.76;

      // 1. RIGHT: [-22.5°, 22.5°)
      if (angleDeg >= -22.5 && angleDeg < 22.5) {
        return dist > profileThreshold ? 'profile_right' : 'front_right';
      }

      // 2. DOWN-RIGHT: [22.5°, 67.5°)
      if (angleDeg >= 22.5 && angleDeg < 67.5) {
        return 'down_right';
      }

      // 3. DOWN: [67.5°, 112.5°)
      if (angleDeg >= 67.5 && angleDeg < 112.5) {
        return 'down';
      }

      // 4. DOWN-LEFT: [112.5°, 157.5°)
      if (angleDeg >= 112.5 && angleDeg < 157.5) {
        return 'down_left';
      }

      // 5. LEFT: [157.5°, 180°] or [-180°, -157.5°)
      if (angleDeg >= 157.5 || angleDeg < -157.5) {
        return dist > profileThreshold ? 'profile_left' : 'front_left';
      }

      // 6. UP-LEFT: [-157.5°, -112.5°)
      if (angleDeg >= -157.5 && angleDeg < -112.5) {
        return 'up_left';
      }

      // 7. UP: [-112.5°, -67.5°)
      if (angleDeg >= -112.5 && angleDeg < -67.5) {
        return 'up';
      }

      // 8. UP-RIGHT: [-67.5°, -22.5°)
      if (angleDeg >= -67.5 && angleDeg < -22.5) {
        return 'up_right';
      }

      return 'front';
    },
    [isWinking, isSmiling]
  );

  // Global mouse tracking across viewport
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      lastActiveTime.current = Date.now();

      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height * 0.42;

      // Range calibration for natural reach
      const rangeX = Math.max(window.innerWidth * 0.48, 380);
      const rangeY = Math.max(window.innerHeight * 0.48, 380);

      const normX = Math.min(Math.max((e.clientX - centerX) / rangeX, -1), 1);
      const normY = Math.min(Math.max((e.clientY - centerY) / rangeY, -1), 1);

      mousePos.current = { x: normX, y: normY };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Track button hover reactions
    const handleButtonEnter = () => setIsSmiling(true);
    const handleButtonLeave = () => setIsSmiling(false);

    const playBtn = document.getElementById('hero-play-game-btn');
    const workBtn = document.getElementById('hero-view-work-btn');

    if (playBtn) {
      playBtn.addEventListener('mouseenter', handleButtonEnter);
      playBtn.addEventListener('mouseleave', handleButtonLeave);
    }
    if (workBtn) {
      workBtn.addEventListener('mouseenter', handleButtonEnter);
      workBtn.addEventListener('mouseleave', handleButtonLeave);
    }

    // Fluid, organic 3D head mass & neck inertia (fluid 120fps direct DOM)
    let currentX = 0;
    let currentY = 0;
    let startTime = performance.now();
    lastTimeRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = now;

      // Gentle breathing micro-motion
      const idleTime = (Date.now() - lastActiveTime.current) / 1000;
      const isIdle = idleTime > 1.2;

      const breathY = Math.sin(elapsed * 1.5) * 1.8;
      const breathRotX = Math.cos(elapsed * 1.5) * 0.4;
      const breathRotZ = Math.sin(elapsed * 0.75) * 0.25;

      // Smooth human neck damping (slow, weighty, realistic human movement)
      const lerpSpeed = isIdle ? 0.022 : 0.038;
      currentX += (mousePos.current.x - currentX) * lerpSpeed;
      currentY += (mousePos.current.y - currentY) * lerpSpeed;

      // Determine target frame with hysteresis
      const nextFrame = getTargetFrameKey(currentX, currentY, targetKey.current);
      if (nextFrame !== targetKey.current) {
        // If previous transition was far along, promote it to base frame
        if (blendFactor.current > 0.5) {
          currentBaseKey.current = targetKey.current;
        }
        targetKey.current = nextFrame;
        blendFactor.current = 0;
      }

      // Smoothly advance blend factor (0 to 1 over 0.18s)
      if (blendFactor.current < 1.0) {
        blendFactor.current = Math.min(1.0, blendFactor.current + dt / 0.18);
        if (blendFactor.current >= 1.0) {
          currentBaseKey.current = targetKey.current;
        }
      }

      // ─── HIGH-PRECISION 2D CANVAS DRAW (ZERO OPACITY DIP, ZERO GHOSTING) ───
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, 560, 640);

          // 1. Draw base frame at 100% opacity underneath (guarantees solid opacity)
          const baseImg = imageMap.current[currentBaseKey.current];
          if (baseImg && baseImg.complete && baseImg.naturalWidth > 0) {
            ctx.globalAlpha = 1.0;
            ctx.drawImage(baseImg, 0, 0, 560, 640);
          }

          // 2. Draw incoming target frame fading smoothly on top
          if (blendFactor.current < 1.0 && targetKey.current !== currentBaseKey.current) {
            const topImg = imageMap.current[targetKey.current];
            if (topImg && topImg.complete && topImg.naturalWidth > 0) {
              // Sine ease-in-out curve
              const alpha = Math.sin((blendFactor.current * Math.PI) / 2);
              ctx.globalAlpha = alpha;
              ctx.drawImage(topImg, 0, 0, 560, 640);
            }
          }
        }
      }

      // Continuous 3D Neck & Head Articulation (rotates visibly and smoothly in 3D space)
      const rotY = currentX * 16; // Continuous 3D sideways rotation (up to ±16°)
      const rotX = -currentY * 12 + breathRotX; // Continuous 3D up/down tilt (up to ±12°)
      const rotZ = currentX * -currentY * 3.0 + breathRotZ; // Organic human neck cant
      const posX = currentX * 12;
      const posY = currentY * 8 + breathY;

      // Direct DOM update (no state re-renders = pure 120 FPS buttery smooth)
      if (headRef.current) {
        headRef.current.style.transform = `translate3d(${posX.toFixed(2)}px, ${posY.toFixed(2)}px, 0px) rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg) rotateZ(${rotZ.toFixed(2)}deg)`;
      }

      if (auraRef.current) {
        auraRef.current.style.transform = `translate3d(${(posX * 1.2).toFixed(2)}px, ${(posY * 1.2).toFixed(2)}px, 0px)`;
      }

      animFrameId.current = requestAnimationFrame(tick);
    };

    animFrameId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (playBtn) {
        playBtn.removeEventListener('mouseenter', handleButtonEnter);
        playBtn.removeEventListener('mouseleave', handleButtonLeave);
      }
      if (workBtn) {
        workBtn.removeEventListener('mouseenter', handleButtonEnter);
        workBtn.removeEventListener('mouseleave', handleButtonLeave);
      }
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [getTargetFrameKey]);

  // Click avatar to trigger playful interactive wink
  const handleAvatarClick = () => {
    setIsWinking(true);
    setTimeout(() => {
      setIsWinking(false);
    }, 850);
  };

  return (
    <div
      ref={containerRef}
      onClick={handleAvatarClick}
      className={`relative w-full flex items-center justify-center select-none cursor-pointer group px-2 sm:px-4 ${className}`}
      style={{ perspective: 1200 }}
      title="Click to interact with Rajat!"
    >
      {/* ─── AMBIENT ATMOSPHERIC RED CYBER AURA (NO RECTANGULAR BOX) ─── */}
      <div
        ref={auraRef}
        className="absolute w-[320px] sm:w-[400px] md:max-w-[460px] lg:w-[500px] aspect-square rounded-full pointer-events-none will-change-transform"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(220,38,38,0.26) 0%, rgba(220,38,38,0.06) 48%, transparent 72%)',
          filter: 'blur(55px)',
        }}
      />

      {/* ─── 3D HEAD & BUST CONTAINER (100% NON-BACKGROUND TRANSPARENT) ─── */}
      <div
        ref={headRef}
        className="relative w-full max-w-[320px] sm:max-w-[380px] md:max-w-[440px] lg:max-w-[500px] xl:max-w-[540px] pointer-events-none will-change-transform mx-auto"
        style={{
          aspectRatio: '280 / 320',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Soft bottom edge feathering: dissolves the bottom hoodie cutoff invisibly into dark background */}
        <div
          className="relative w-full h-full"
          style={{
            maskImage: 'linear-gradient(to bottom, black 86%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 86%, transparent 100%)',
          }}
        >
          {/* High-DPI Canvas 2D: Butter-smooth frame interpolation, ZERO opacity dip, locked 120 FPS */}
          <canvas
            ref={canvasRef}
            width={560}
            height={640}
            className="w-full h-full object-contain pointer-events-none select-none"
          />
        </div>
      </div>
    </div>
  );
};
