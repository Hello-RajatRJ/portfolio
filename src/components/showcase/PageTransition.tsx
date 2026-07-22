import { useRef, useImperativeHandle, forwardRef } from 'react';
import { gsap } from 'gsap';

/**
 * Full-screen page transition overlay.
 * Clip-path circle wipe effect inspired by orgnzm.studio.
 *
 * Usage:
 *   const transitionRef = useRef<PageTransitionHandle>(null);
 *   transitionRef.current?.play(() => { navigate(); });
 */
export interface PageTransitionHandle {
  play: (onMidpoint: () => void) => void;
}

const PageTransition = forwardRef<PageTransitionHandle>((_, ref) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    play: (onMidpoint: () => void) => {
      const overlay = overlayRef.current;
      if (!overlay) return;

      const tl = gsap.timeline();

      // Phase 1: Expand circle from center
      tl.set(overlay, { display: 'block', opacity: 1 });
      tl.fromTo(
        overlay,
        { clipPath: 'circle(0% at 50% 50%)' },
        {
          clipPath: 'circle(150% at 50% 50%)',
          duration: 0.7,
          ease: 'power3.inOut',
        }
      );

      // Midpoint callback — this is where page swap happens
      tl.call(onMidpoint);
      tl.set({}, {}, '+=0.15'); // brief pause

      // Phase 2: Shrink circle to reveal new page
      tl.to(overlay, {
        clipPath: 'circle(0% at 50% 50%)',
        duration: 0.6,
        ease: 'power3.inOut',
      });
      tl.set(overlay, { display: 'none' });
    },
  }));

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9000] pointer-events-none"
      style={{
        display: 'none',
        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a0a2e 50%, #0a0a0f 100%)',
        clipPath: 'circle(0% at 50% 50%)',
      }}
    />
  );
});

PageTransition.displayName = 'PageTransition';
export default PageTransition;
