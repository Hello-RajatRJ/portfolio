import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * CharReveal — hobro.digital-style character-by-character scroll reveal.
 * Splits text into individual `<span>` elements and animates each character's
 * opacity from 0.1 → 1 as the user scrolls through the container.
 */
interface CharRevealProps {
  text: string;
  className?: string;
  dimOpacity?: number;
  /** ScrollTrigger start position (default: 'top 85%') */
  start?: string;
  /** ScrollTrigger end position (default: 'bottom 20%') */
  end?: string;
}

const CharReveal: React.FC<CharRevealProps> = ({
  text,
  className = '',
  dimOpacity = 0.1,
  start = 'top 85%',
  end = 'bottom 20%',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chars = container.querySelectorAll('.char-reveal-char');
    if (chars.length === 0) return;

    // Set initial state
    gsap.set(chars, { opacity: dimOpacity });

    // Animate each character's opacity as the user scrolls
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start,
        end,
        scrub: 0.5,
      },
    });

    tl.to(chars, {
      opacity: 1,
      duration: 0.3,
      stagger: 0.02,
      ease: 'none',
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll()
        .filter((st) => st.trigger === container)
        .forEach((st) => st.kill());
    };
  }, [text, dimOpacity, start, end]);

  // Split text into words and characters, preserving spaces & line breaks
  const renderText = () => {
    const lines = text.split('\n');
    return lines.map((line, lineIdx) => (
      <React.Fragment key={lineIdx}>
        {lineIdx > 0 && <br />}
        {line.split(' ').map((word, wordIdx) => (
          <span key={`${lineIdx}-${wordIdx}`} className="inline-block whitespace-nowrap">
            {word.split('').map((char, charIdx) => (
              <span
                key={`${lineIdx}-${wordIdx}-${charIdx}`}
                className="char-reveal-char inline-block"
                style={{ opacity: 0.1 }}
              >
                {char}
              </span>
            ))}
            {/* Space after each word (except last) */}
            {wordIdx < line.split(' ').length - 1 && (
              <span className="inline-block">&nbsp;</span>
            )}
          </span>
        ))}
      </React.Fragment>
    ));
  };

  return (
    <div ref={containerRef} className={className}>
      {renderText()}
    </div>
  );
};

export default CharReveal;
