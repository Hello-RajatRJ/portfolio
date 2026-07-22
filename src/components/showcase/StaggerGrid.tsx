import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * StaggerGrid — Staggered entrance animation grid.
 * Children fade in and slide up with a stagger delay when scrolled into view.
 */
interface StaggerGridProps {
  children: React.ReactNode;
  /** Grid columns classes (default: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3') */
  columns?: string;
  /** Gap between items (default: 'gap-8') */
  gap?: string;
  /** Stagger delay between items in seconds (default: 0.08) */
  stagger?: number;
  /** Y offset for the slide-up (default: 60) */
  yOffset?: number;
  /** Extra classes */
  className?: string;
}

const StaggerGrid: React.FC<StaggerGridProps> = ({
  children,
  columns = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  gap = 'gap-8',
  stagger = 0.08,
  yOffset = 60,
  className = '',
}) => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const items = grid.children;
    if (items.length === 0) return;

    gsap.set(items, { y: yOffset, opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: grid,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.to(items, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger,
      ease: 'power3.out',
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll()
        .filter((st) => st.trigger === grid)
        .forEach((st) => st.kill());
    };
  }, [stagger, yOffset]);

  return (
    <div ref={gridRef} className={`grid ${columns} ${gap} ${className}`}>
      {children}
    </div>
  );
};

export default StaggerGrid;
