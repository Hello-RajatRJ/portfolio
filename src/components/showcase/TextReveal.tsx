import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Text line mask reveal — inspired by orgnzm.studio.
 * Splits text into lines and animates each line up from below a clip mask.
 *
 * Props:
 *  - text: The text string to reveal
 *  - as: HTML element type (default 'h1')
 *  - className: Tailwind classes
 *  - delay: Animation start delay (seconds)
 *  - triggerOnScroll: If true, triggers on scroll into view. If false, plays immediately.
 *  - stagger: Delay between each line (seconds)
 */
interface TextRevealProps {
  text: string;
  as?: any;
  className?: string;
  delay?: number;
  triggerOnScroll?: boolean;
  stagger?: number;
  children?: React.ReactNode;
}

const TextReveal: React.FC<TextRevealProps> = ({
  text,
  as: Tag = 'h1',
  className = '',
  delay = 0,
  triggerOnScroll = false,
  stagger = 0.12,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const lines = container.querySelectorAll('.text-reveal-line');

    const animProps = {
      y: '110%',
      rotateX: -10,
      opacity: 0,
    };

    if (triggerOnScroll) {
      gsap.from(lines, {
        ...animProps,
        stagger,
        duration: 1,
        delay,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    } else {
      gsap.from(lines, {
        ...animProps,
        stagger,
        duration: 1,
        delay,
        ease: 'power4.out',
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === container) t.kill();
      });
    };
  }, [delay, stagger, triggerOnScroll]);

  // Split text into lines by newline or <br>
  const lines = text.split('\n').filter(Boolean);

  return (
    <div ref={containerRef} style={{ perspective: '600px' }}>
      {/* @ts-ignore – dynamic tag */}
      <Tag className={className}>
        {lines.map((line, i) => (
          <span
            key={i}
            className="text-line-mask block overflow-hidden"
            style={{ paddingBottom: '0.15em', marginBottom: '-0.15em' }}
          >
            <span
              className="text-reveal-line block"
              style={{ transformOrigin: 'bottom left', willChange: 'transform, opacity' }}
            >
              {line}
            </span>
          </span>
        ))}
        {children}
      </Tag>
    </div>
  );
};

export default TextReveal;
