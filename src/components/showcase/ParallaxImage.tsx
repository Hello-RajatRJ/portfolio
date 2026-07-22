import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * ParallaxImage — Full-bleed image with parallax scroll and optional scale-on-enter.
 * The image moves slower than the scroll, creating a depth illusion.
 */
interface ParallaxImageProps {
  src: string;
  alt: string;
  /** Height of the container (default: '100vh') */
  height?: string;
  /** Parallax intensity — how many px the image shifts (default: 120) */
  parallaxAmount?: number;
  /** Initial scale that zooms out to 1 on scroll (default: 1.15) */
  initialScale?: number;
  /** Overlay gradient from bottom (default: true) */
  overlay?: boolean;
  /** Overlay color stops (default: black) */
  overlayColor?: string;
  /** Extra classes on the container */
  className?: string;
  /** Children to overlay on the image (e.g. text) */
  children?: React.ReactNode;
}

const ParallaxImage: React.FC<ParallaxImageProps> = ({
  src,
  alt,
  height = '100vh',
  parallaxAmount = 120,
  initialScale = 1.15,
  overlay = true,
  overlayColor = 'rgba(0,0,0,0.6)',
  className = '',
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const img = imgRef.current;
    if (!container || !img) return;

    // Set initial transform
    gsap.set(img, { scale: initialScale, y: -parallaxAmount / 2 });

    // Parallax: translate y from negative to positive as scroll progresses
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    tl.to(img, {
      y: parallaxAmount / 2,
      scale: 1,
      ease: 'none',
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll()
        .filter((st) => st.trigger === container)
        .forEach((st) => st.kill());
    };
  }, [parallaxAmount, initialScale]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ height }}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover will-change-transform"
        style={{ transformOrigin: 'center center' }}
      />
      {overlay && (
        <>
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, transparent 0%, ${overlayColor} 100%)`,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, transparent 60%, ${overlayColor} 100%)`,
            }}
          />
        </>
      )}
      {children && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          {children}
        </div>
      )}
    </div>
  );
};

export default ParallaxImage;
