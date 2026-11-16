import React, { useEffect, useRef, useState } from 'react';

export const DeadpoolCursor: React.FC = () => {
  const [isFinePointer, setIsFinePointer] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(hover: hover) and (pointer: fine)').matches
      : false
  );
  const [isHoveringLink, setIsHoveringLink] = useState(false);
  const [isHoveringProject, setIsHoveringProject] = useState(false);
  const [isHoveringDrive, setIsHoveringDrive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const rafId = useRef<number>(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const onMqChange = (e: MediaQueryListEvent) => setIsFinePointer(e.matches);
    mq.addEventListener('change', onMqChange);

    if (!mq.matches) return;

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isDrive = Boolean(
        target.closest('[data-cursor-drive="true"], .racing-teaser-zone')
      );
      const isProject = !isDrive && Boolean(
        target.closest('[data-project-card="true"], .project-card, [data-project-cursor="true"]')
      );
      const isLink = Boolean(
        target.closest('a, button, [role="button"], input, textarea, select, .cursor-pointer')
      );

      setIsHoveringDrive(isDrive);
      setIsHoveringProject(isProject);
      setIsHoveringLink(isLink && !isProject && !isDrive);
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    const loop = () => {
      const rx = ringPos.current.x;
      const ry = ringPos.current.y;
      const tx = mousePos.current.x;
      const ty = mousePos.current.y;

      ringPos.current.x += (tx - rx) * 0.18;
      ringPos.current.y += (ty - ry) * 0.18;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);

    return () => {
      mq.removeEventListener('change', onMqChange);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isVisible]);

  if (!isFinePointer) return null;

  const showSpecialBadge = isHoveringProject || isHoveringDrive;

  return (
    <>
      {/* Center red laser dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 left-0 -ml-1 -mt-1 h-2 w-2 rounded-full bg-[#E62429] shadow-[0_0_8px_#FF2D2D] z-[1000] transition-opacity duration-200 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        } ${showSpecialBadge ? 'scale-0' : 'scale-100'}`}
      />

      {/* Trailing elastic ring / VIEW & DRIVE badge */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 left-0 flex items-center justify-center rounded-full z-[999] transition-all duration-300 ease-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        } ${
          showSpecialBadge
            ? '-ml-9 -mt-9 h-18 w-18 border-2 border-[#E62429] bg-black/85 shadow-[0_0_24px_rgba(230,36,41,0.65)] backdrop-blur-sm'
            : isHoveringLink
            ? '-ml-6 -mt-6 h-12 w-12 border border-[#FF2D2D] bg-[#E62429]/15 shadow-[0_0_16px_rgba(255,45,45,0.4)]'
            : '-ml-4 -mt-4 h-8 w-8 border border-[#E62429]/60 bg-transparent'
        }`}
      >
        {isHoveringProject && (
          <span className="font-orbitron text-[10px] font-black tracking-widest text-white drop-shadow-[0_0_6px_#FF2D2D]">
            VIEW
          </span>
        )}
        {isHoveringDrive && (
          <span className="font-orbitron text-[10px] font-black tracking-widest text-white drop-shadow-[0_0_6px_#FF2D2D]">
            DRIVE
          </span>
        )}
      </div>
    </>
  );
};
