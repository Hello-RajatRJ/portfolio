import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * HorizontalScrollPin — hobro.digital-style horizontal scroll gallery.
 * Pins the section in place while vertical scroll drives horizontal translation.
 */
interface HorizontalScrollPinProps {
  children: React.ReactNode;
  /** Extra class on the outer pinned container */
  className?: string;
  /** Height multiplier for scroll distance (default: children count * 100vh) */
  scrollMultiplier?: number;
}

const HorizontalScrollPin: React.FC<HorizontalScrollPinProps> = ({
  children,
  className = '',
  scrollMultiplier,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    // Calculate total horizontal scroll distance
    const totalWidth = track.scrollWidth - window.innerWidth;

    const st = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: () => `+=${scrollMultiplier ? window.innerHeight * scrollMultiplier : totalWidth}`,
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      onUpdate: (self) => {
        gsap.set(track, { x: -totalWidth * self.progress });
      },
    });

    return () => {
      st.kill();
    };
  }, [scrollMultiplier]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`} style={{ height: '100vh' }}>
      <div
        ref={trackRef}
        className="flex items-center gap-8 h-full px-8"
        style={{ width: 'max-content' }}
      >
        {children}
      </div>
    </div>
  );
};

export default HorizontalScrollPin;
