import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Staggered text reveal animation.
 * Splits text into individual characters wrapped in spans for per-char animation.
 */
export const animateTextReveal = (
  selector: string,
  options: { delay?: number; duration?: number; stagger?: number } = {}
) => {
  const { delay = 0, duration = 0.8, stagger = 0.03 } = options;
  gsap.from(selector, {
    y: 80,
    opacity: 0,
    rotateX: -40,
    stagger,
    duration,
    delay,
    ease: 'power3.out',
  });
};

/**
 * Scroll-triggered fade-in animation.
 */
export const scrollFadeIn = (
  elements: string | HTMLElement | HTMLElement[],
  options: { y?: number; duration?: number; stagger?: number; start?: string } = {}
) => {
  const { y = 60, duration = 1, stagger = 0.15, start = 'top 85%' } = options;
  gsap.from(elements, {
    scrollTrigger: {
      trigger: typeof elements === 'string' ? elements : elements instanceof HTMLElement ? elements : elements[0],
      start,
      toggleActions: 'play none none reverse',
    },
    y,
    opacity: 0,
    duration,
    stagger,
    ease: 'power3.out',
  });
};

/**
 * Parallax scroll effect on an element.
 */
export const parallax = (
  element: string | HTMLElement,
  options: { speed?: number; start?: string; end?: string } = {}
) => {
  const { speed = 0.3, start = 'top bottom', end = 'bottom top' } = options;
  gsap.to(element, {
    scrollTrigger: {
      trigger: element,
      start,
      end,
      scrub: true,
    },
    y: `${speed * 100}%`,
    ease: 'none',
  });
};

/**
 * Magnetic button effect — element follows cursor within a threshold.
 */
export const magneticEffect = (element: HTMLElement, strength: number = 0.3) => {
  const handleMouseMove = (e: MouseEvent) => {
    const { left, top, width, height } = element.getBoundingClientRect();
    const cx = left + width / 2;
    const cy = top + height / 2;
    const dx = (e.clientX - cx) * strength;
    const dy = (e.clientY - cy) * strength;
    gsap.to(element, { x: dx, y: dy, duration: 0.3, ease: 'power2.out' });
  };

  const handleMouseLeave = () => {
    gsap.to(element, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
  };

  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    element.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('mouseleave', handleMouseLeave);
  };
};

/**
 * Clip-path reveal animation for sections.
 */
export const clipPathReveal = (
  element: string | HTMLElement,
  options: { direction?: 'up' | 'down' | 'left' | 'right'; duration?: number } = {}
) => {
  const { direction = 'up', duration = 1.2 } = options;
  const clips: Record<string, { from: string; to: string }> = {
    up:    { from: 'inset(100% 0% 0% 0%)', to: 'inset(0% 0% 0% 0%)' },
    down:  { from: 'inset(0% 0% 100% 0%)', to: 'inset(0% 0% 0% 0%)' },
    left:  { from: 'inset(0% 100% 0% 0%)', to: 'inset(0% 0% 0% 0%)' },
    right: { from: 'inset(0% 0% 0% 100%)', to: 'inset(0% 0% 0% 0%)' },
  };
  const { from, to } = clips[direction];
  gsap.fromTo(
    element,
    { clipPath: from },
    {
      clipPath: to,
      duration,
      ease: 'power4.inOut',
      scrollTrigger: { trigger: element, start: 'top 80%' },
    }
  );
};

/**
 * Floating particle config for canvas backgrounds.
 */
export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

export const createParticles = (
  count: number,
  width: number,
  height: number,
  color: string = 'rgba(139, 92, 246, 0.5)'
): Particle[] => {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    size: Math.random() * 2.5 + 0.5,
    opacity: Math.random() * 0.5 + 0.1,
    color,
  }));
};
