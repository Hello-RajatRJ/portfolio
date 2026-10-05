import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * CursorAvatar – A 3D anime avatar that follows the mouse cursor
 * with smooth spring physics, subtle 3D tilt, and a glowing trail.
 * Only visible on the landing page (non-game views).
 */
const CursorAvatar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  // Raw mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring-based following
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  // 3D tilt based on velocity
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const smoothRotateX = useSpring(rotateX, { damping: 20, stiffness: 150 });
  const smoothRotateY = useSpring(rotateY, { damping: 20, stiffness: 150 });

  // Scale for interactive hover
  const scale = useSpring(1, { damping: 20, stiffness: 300 });

  useEffect(() => {
    let prevX = 0;
    let prevY = 0;
    let lastTime = Date.now();

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      const dt = Math.max(now - lastTime, 1);
      lastTime = now;

      // Velocity-based tilt
      const vx = (e.clientX - prevX) / dt;
      const vy = (e.clientY - prevY) / dt;
      prevX = e.clientX;
      prevY = e.clientY;

      // Offset avatar to top-right of cursor
      mouseX.set(e.clientX + 15);
      mouseY.set(e.clientY - 60);

      // Tilt based on movement direction (subtle)
      rotateY.set(Math.max(-15, Math.min(15, vx * 8)));
      rotateX.set(Math.max(-10, Math.min(10, -vy * 6)));

      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Detect hovering over interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.closest('button') ||
        target.closest('a') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('select') ||
        target.closest('[role="button"]') ||
        target.closest('.cursor-pointer');
      setIsHoveringInteractive(!!isInteractive);
      scale.set(isInteractive ? 0.7 : 1);
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY, rotateX, rotateY, isVisible, scale]);

  // Only show on desktop (pointer devices)
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine) and (min-width: 768px)');
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  if (!isDesktop) return null;

  return (
    <motion.div
      ref={avatarRef}
      className="fixed top-0 left-0 z-[9999] pointer-events-none"
      style={{
        x,
        y,
        scale,
        rotateX: smoothRotateX,
        rotateY: smoothRotateY,
      }}
      animate={{
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ opacity: { duration: 0.3 } }}
    >
      {/* Outer glow ring */}
      <div className="relative">
        {/* Pulsing red glow */}
        <motion.div
          animate={{
            boxShadow: [
              '0 0 20px rgba(220,38,38,0.3), 0 0 40px rgba(220,38,38,0.1)',
              '0 0 30px rgba(220,38,38,0.5), 0 0 60px rgba(220,38,38,0.2)',
              '0 0 20px rgba(220,38,38,0.3), 0 0 40px rgba(220,38,38,0.1)',
            ],
          }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="absolute -inset-1 rounded-full"
        />

        {/* Avatar container */}
        <div
          className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-red-600/60"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(220,38,38,0.15), rgba(0,0,0,0.9))',
            boxShadow: '0 0 25px rgba(220,38,38,0.4), inset 0 0 15px rgba(0,0,0,0.5)',
          }}
        >
          <img
            src="/avatar_transparent/front.webp"
            alt="Avatar"
            className="w-full h-full object-cover"
            style={{
              filter: isHoveringInteractive ? 'brightness(1.2)' : 'brightness(1)',
              transition: 'filter 0.3s ease',
            }}
            draggable={false}
          />

          {/* Shine overlay */}
          <motion.div
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-full"
          />
        </div>

        {/* Status dot */}
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-black"
          style={{ boxShadow: '0 0 8px rgba(220,38,38,0.8)' }}
        />
      </div>
    </motion.div>
  );
};

export default CursorAvatar;
