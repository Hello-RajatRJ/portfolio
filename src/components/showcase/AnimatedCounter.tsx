import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Animated counter that counts up when scrolled into view.
 * Inspired by nossaman.com stat counters.
 */
interface AnimatedCounterProps {
  end: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  decimals?: number;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  end,
  prefix = '',
  suffix = '',
  duration = 2,
  className = '',
  decimals = 0,
}) => {
  const [display, setDisplay] = useState(`${prefix}0${suffix}`);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;

        const counter = { val: 0 };
        gsap.to(counter, {
          val: end,
          duration,
          ease: 'power2.out',
          onUpdate: () => {
            setDisplay(`${prefix}${counter.val.toFixed(decimals)}${suffix}`);
          },
        });
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill();
      });
    };
  }, [end, prefix, suffix, duration, decimals]);

  return (
    <span ref={ref} className={`counter-num ${className}`}>
      {display}
    </span>
  );
};

export default AnimatedCounter;
