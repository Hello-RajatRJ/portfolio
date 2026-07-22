import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface SmoothScrollProps {
  children: React.ReactNode;
}

const SmoothScroll: React.FC<SmoothScrollProps> = ({ children }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = document.getElementById('showcase-scroll-container');
    const content = contentRef.current;
    
    // Fallback if wrapper is not found
    if (!wrapper || !content) return;

    // Initialize Lenis on the scroll container
    const lenis = new Lenis({
      wrapper: wrapper,
      content: content,
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      infinite: false,
    });

    let animId: number;
    function raf(time: number) {
      lenis.raf(time);
      animId = requestAnimationFrame(raf);
    }
    animId = requestAnimationFrame(raf);

    // Sync GSAP ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update);

    // Tell ScrollTrigger to use this scroller
    ScrollTrigger.defaults({
      scroller: wrapper,
    });

    // Configure scroller proxy for GSAP ScrollTrigger
    ScrollTrigger.scrollerProxy(wrapper, {
      scrollTop(value) {
        return arguments.length
          ? lenis.scrollTo(value as number, { immediate: true })
          : lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    // Refresh ScrollTrigger when Lenis updates
    ScrollTrigger.addEventListener('refresh', () => lenis.resize());
    ScrollTrigger.refresh();

    return () => {
      cancelAnimationFrame(animId);
      lenis.destroy();
      // Clean up scroller defaults to default back to window for other views
      ScrollTrigger.defaults({
        scroller: window,
      });
    };
  }, []);

  return (
    <div ref={contentRef} className="w-full scroll-content">
      {children}
    </div>
  );
};

export default SmoothScroll;
