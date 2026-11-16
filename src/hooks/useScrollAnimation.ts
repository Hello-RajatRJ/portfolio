import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useScrollAnimation = <T extends HTMLElement = HTMLElement>(
  setup: (ctx: gsap.Context, element: T) => void,
  dependencies: unknown[] = []
) => {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    if (!elementRef.current || typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (elementRef.current) {
        setup(ctx, elementRef.current);
      }
    }, elementRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return elementRef;
};

/**
 * Standard restrained animation configuration:
 * Slow, confident motion with power3.out or expo.out.
 * Durations 0.8–1.2s, no bounce.
 */
export const restrainedMotion = {
  duration: 1.0,
  ease: [0.16, 1, 0.3, 1] as const, // Cubic-bezier equivalent to power3.out / expo.out
  stagger: 0.08,
};

/**
 * Framer Motion variant for masked line reveals (parent overflow: hidden, child translateY 110% -> 0)
 */
export const maskedLineVariants = {
  hidden: { y: '115%', opacity: 0 },
  visible: (i = 0) => ({
    y: '0%',
    opacity: 1,
    transition: {
      duration: 1.0,
      delay: i * 0.08,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};
