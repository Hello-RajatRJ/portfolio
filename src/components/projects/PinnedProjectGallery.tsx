import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ProjectUniverseItem } from '../../data/projectUniverseData';
import type { ParallaxSignalState } from './projectTypes';
import { ProjectHoloCard } from './ProjectHoloCard';

gsap.registerPlugin(ScrollTrigger);

interface PinnedProjectGalleryProps {
  projects: ProjectUniverseItem[];
  onSelectProject: (project: ProjectUniverseItem) => void;
  reducedMotion: boolean;
  signalRef: React.MutableRefObject<ParallaxSignalState>;
}

export const PinnedProjectGallery: React.FC<PinnedProjectGalleryProps> = ({
  projects,
  onSelectProject,
  reducedMotion,
  signalRef,
}) => {
  const galleryMode = reducedMotion ? 'auto-stream' : 'scroll-drive';
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDesktopViewport, setIsDesktopViewport] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true
  );

  const pinSectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardSlotRefs = useRef<Array<HTMLDivElement | null>>([]);
  const mobileScrollerRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const activeIdxRef = useRef(0);

  const totalProjects = projects.length;

  // Keep viewport width check reactive for desktop pinning vs mobile swipe carousel
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = (e: MediaQueryListEvent) => setIsDesktopViewport(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Desktop GSAP + ScrollTrigger Pinned Horizontal Showcase
  useEffect(() => {
    if (reducedMotion || galleryMode !== 'scroll-drive' || !isDesktopViewport) {
      scrollTriggerRef.current = null;
      return;
    }

    const pinEl = pinSectionRef.current;
    const stageEl = stageRef.current;
    const trackEl = trackRef.current;
    if (!pinEl || !stageEl || !trackEl) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(min-width: 768px)', () => {
        gsap.set(trackEl, { x: 0 });

        const getMaxScrollX = () => Math.max(0, trackEl.scrollWidth - stageEl.clientWidth);
        if (getMaxScrollX() <= 16) return;

        const tween = gsap.to(trackEl, {
          x: () => -getMaxScrollX(),
          ease: 'none',
          scrollTrigger: {
            trigger: pinEl,
            start: 'top top+=76',
            end: () => `+=${Math.max(500, getMaxScrollX() + 180)}`,
            pin: true,
            pinSpacing: true,
            scrub: 0.85,
            anticipatePin: 1,
            fastScrollEnd: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = Math.max(0, Math.min(1, self.progress));
              signalRef.current.scrollProgress = p;
              signalRef.current.scrollVelocity = self.getVelocity() / 400;

              const nextIdx = Math.min(
                totalProjects - 1,
                Math.max(0, Math.round(p * (totalProjects - 1)))
              );
              if (nextIdx !== activeIdxRef.current) {
                activeIdxRef.current = nextIdx;
                setActiveIndex(nextIdx);
              }

              // Apply subtle 3D focus scale & angle based on horizontal offset
              const stageWidth = stageEl.clientWidth || 1;
              const currentTranslateX = getMaxScrollX() * p;
              const stageCenterX = stageWidth * 0.5;

              for (let i = 0; i < totalProjects; i++) {
                const slot = cardSlotRefs.current[i];
                if (!slot) continue;
                const slotCenter = slot.offsetLeft + slot.offsetWidth * 0.5 - currentTranslateX;
                const normDist = Math.max(
                  -1.2,
                  Math.min(1.2, (slotCenter - stageCenterX) / (stageWidth * 0.45))
                );
                const absDist = Math.abs(normDist);
                const scale = 1 - Math.min(0.11, absDist * 0.09);
                const opacity = 1 - Math.min(0.36, absDist * 0.3);
                const rotY = normDist * -7.5;

                slot.style.transform = `perspective(1200px) scale(${scale.toFixed(3)}) rotateY(${rotY.toFixed(2)}deg)`;
                slot.style.opacity = opacity.toFixed(3);
                slot.style.zIndex = absDist < 0.35 ? '10' : '1';
              }
            },
          },
        });

        scrollTriggerRef.current = tween.scrollTrigger ?? null;
      });
    }, pinSectionRef);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize, { passive: true });
    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 160);

    return () => {
      window.clearTimeout(refreshTimer);
      window.removeEventListener('resize', onResize);
      scrollTriggerRef.current = null;
      ctx.revert();
    };
  }, [galleryMode, isDesktopViewport, reducedMotion, signalRef, totalProjects]);

  const navigateToIndex = (targetIdx: number) => {
    const clamped = Math.max(0, Math.min(totalProjects - 1, targetIdx));
    activeIdxRef.current = clamped;
    setActiveIndex(clamped);

    if (galleryMode === 'scroll-drive' && isDesktopViewport && scrollTriggerRef.current) {
      const st = scrollTriggerRef.current;
      const ratio = totalProjects > 1 ? clamped / (totalProjects - 1) : 0;
      const targetY = st.start + (st.end - st.start) * ratio;
      window.scrollTo({ top: targetY, behavior: reducedMotion ? 'auto' : 'smooth' });
      return;
    }

    if (!isDesktopViewport && mobileScrollerRef.current) {
      const slot = mobileScrollerRef.current.children[clamped] as HTMLElement | undefined;
      slot?.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  };

  const handleMobileScroll = () => {
    const scroller = mobileScrollerRef.current;
    if (!scroller) return;
    const stepWidth = scroller.scrollWidth / Math.max(1, totalProjects);
    const idx = Math.max(
      0,
      Math.min(totalProjects - 1, Math.round(scroller.scrollLeft / Math.max(1, stepWidth)))
    );
    if (idx !== activeIdxRef.current) {
      activeIdxRef.current = idx;
      setActiveIndex(idx);
    }
  };

  const handleTrackKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      navigateToIndex(activeIndex + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      navigateToIndex(activeIndex - 1);
    }
  };

  return (
    <div
      ref={pinSectionRef}
      onKeyDown={handleTrackKeyDown}
      className="relative z-10 mt-6 rounded-3xl border border-red-500/20 bg-[#080808]/75 py-4 sm:py-6 backdrop-blur-md shadow-[0_24px_80px_-24px_rgba(0,0,0,0.95)]"
    >
      {/* Desktop Pinned Horizontal Scroll Track */}
      {isDesktopViewport && galleryMode === 'scroll-drive' && !reducedMotion && (
        <div
          ref={stageRef}
          className="relative w-full overflow-hidden py-4"
        >
          {/* Side Fog Fades framing the active 3D stage */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 bg-gradient-to-r from-[#080808] to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 bg-gradient-to-l from-[#080808] to-transparent"
          />

          <div
            ref={trackRef}
            className="flex w-max items-stretch gap-7 px-[12vw]"
          >
            {projects.map((project, idx) => (
              <div
                key={project.id}
                ref={(el) => {
                  cardSlotRefs.current[idx] = el;
                }}
                className="w-[360px] lg:w-[400px] shrink-0 transition-[box-shadow] duration-300"
              >
                <ProjectHoloCard
                  project={project}
                  onSelect={onSelectProject}
                  reducedMotion={reducedMotion}
                  variant="gallery"
                  isActiveInGallery={idx === activeIndex}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Continuous Auto-Stream Mode (Optional Desktop Mode OR Reduced Motion Clean Carousel) */}
      {isDesktopViewport && (galleryMode === 'auto-stream' || reducedMotion) && (
        <div className="pu-marquee-wrapper relative w-full overflow-hidden py-4">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-20 w-20 bg-gradient-to-r from-[#080808] to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-20 w-20 bg-gradient-to-l from-[#080808] to-transparent"
          />

          <div className="pu-marquee-track gap-6 px-6">
            {[...projects, ...projects].map((project, dupIdx) => (
              <div
                key={`${project.id}-stream-${dupIdx}`}
                className="w-[340px] lg:w-[375px] shrink-0"
              >
                <ProjectHoloCard
                  project={project}
                  onSelect={onSelectProject}
                  reducedMotion={reducedMotion}
                  variant="gallery"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Swipeable Snap Carousel (zero ScrollTrigger pin, zero page horizontal overflow) */}
      {!isDesktopViewport && (
        <div
          ref={mobileScrollerRef}
          onScroll={handleMobileScroll}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 pt-2 scroll-smooth"
        >
          {projects.map((project, idx) => (
            <div
              key={`${project.id}-mobile`}
              className="w-[84vw] max-w-[350px] shrink-0 snap-center"
            >
              <ProjectHoloCard
                project={project}
                onSelect={onSelectProject}
                reducedMotion={reducedMotion}
                variant="gallery"
                isActiveInGallery={idx === activeIndex}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

