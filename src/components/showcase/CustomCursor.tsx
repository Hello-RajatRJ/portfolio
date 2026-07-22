import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

/**
 * Custom cursor with dot + circle + label.
 * Inspired by hobro.digital and creativeglu.ai.
 * - Dot follows mouse precisely
 * - Circle follows with smooth delay
 * - Scales up on hovering interactive elements
 * - Shows label text on [data-cursor-label] elements
 */
const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Don't render cursor on touch devices
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    if (isMobile) return;

    const dot = dotRef.current;
    const circle = circleRef.current;
    const label = labelRef.current;
    if (!dot || !circle || !label) return;

    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);

      // Dot follows immediately
      gsap.to(dot, { x: mouseX, y: mouseY, duration: 0.1, ease: 'power2.out' });
      // Circle follows with lag
      gsap.to(circle, { x: mouseX, y: mouseY, duration: 0.35, ease: 'power3.out' });
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    // Hover detection for interactive elements
    const onElementEnter = (e: Event) => {
      const target = e.target as HTMLElement;
      const cursorLabel = target.closest('[data-cursor-label]')?.getAttribute('data-cursor-label');

      gsap.to(circle, { scale: 2.5, opacity: 0.15, duration: 0.3 });
      gsap.to(dot, { scale: 0.5, duration: 0.3 });

      if (cursorLabel && label) {
        label.textContent = cursorLabel;
        gsap.to(label, { opacity: 1, scale: 1, duration: 0.2 });
      }
    };

    const onElementLeave = () => {
      gsap.to(circle, { scale: 1, opacity: 0.35, duration: 0.3 });
      gsap.to(dot, { scale: 1, duration: 0.3 });
      if (label) {
        gsap.to(label, { opacity: 0, scale: 0.8, duration: 0.2 });
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Observe interactive elements
    const interactiveSelectors = 'a, button, [data-cursor-label], .cursor-hover';
    const addListeners = () => {
      document.querySelectorAll(interactiveSelectors).forEach((el) => {
        el.addEventListener('mouseenter', onElementEnter);
        el.addEventListener('mouseleave', onElementLeave);
      });
    };

    addListeners();

    // MutationObserver for dynamic elements
    const observer = new MutationObserver(() => addListeners());
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.querySelectorAll(interactiveSelectors).forEach((el) => {
        el.removeEventListener('mouseenter', onElementEnter);
        el.removeEventListener('mouseleave', onElementLeave);
      });
      observer.disconnect();
      window.removeEventListener('resize', checkMobile);
    };
  }, [isMobile, isVisible]);

  if (isMobile) return null;

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#fff',
          transform: 'translate(-50%, -50%)',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.3s',
        }}
      />
      {/* Circle */}
      <div
        ref={circleRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none mix-blend-difference flex items-center justify-center"
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '1.5px solid rgba(255,255,255,0.5)',
          transform: 'translate(-50%, -50%)',
          opacity: isVisible ? 0.35 : 0,
          transition: 'opacity 0.3s',
        }}
      >
        {/* Label */}
        <span
          ref={labelRef}
          className="absolute text-[10px] font-orbitron font-bold text-white tracking-wider whitespace-nowrap opacity-0"
          style={{ transform: 'scale(0.8)' }}
        />
      </div>
    </>
  );
};

export default CustomCursor;
