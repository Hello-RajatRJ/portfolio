import React, { useEffect, useRef } from 'react';

interface ProjectCursorHUDProps {
  scopeRef: React.RefObject<HTMLElement | null>;
  disabled?: boolean;
}

export const ProjectCursorHUD: React.FC<ProjectCursorHUDProps> = ({
  scopeRef,
  disabled = false,
}) => {
  const hudRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled || typeof window === 'undefined') return;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reduced) return;

    const scopeEl = scopeRef.current;
    const hud = hudRef.current;
    if (!scopeEl || !hud) return;

    let targetX = -120;
    let targetY = -120;
    let curX = -120;
    let curY = -120;
    let active = false;
    let rafId = 0;

    const render = () => {
      curX += (targetX - curX) * 0.22;
      curY += (targetY - curY) * 0.22;

      hud.style.transform = `translate3d(${curX}px, ${curY}px, 0) scale(${active ? 1 : 0.72})`;
      hud.style.opacity = active ? '1' : '0';

      if (active || Math.abs(targetX - curX) > 0.5 || Math.abs(targetY - curY) > 0.5) {
        rafId = window.requestAnimationFrame(render);
      } else {
        rafId = 0;
      }
    };

    const startLoop = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(render);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      const overAction = Boolean(target?.closest('[data-no-cursor-hud="true"], button, a'));
      const inProjectZone = !overAction && Boolean(target?.closest('[data-project-cursor="true"]'));
      targetX = e.clientX;
      targetY = e.clientY;

      if (inProjectZone !== active) {
        active = inProjectZone;
      }
      startLoop();
    };

    const onPointerLeave = () => {
      active = false;
      startLoop();
    };

    scopeEl.addEventListener('pointermove', onPointerMove, { passive: true });
    scopeEl.addEventListener('pointerleave', onPointerLeave);

    return () => {
      scopeEl.removeEventListener('pointermove', onPointerMove);
      scopeEl.removeEventListener('pointerleave', onPointerLeave);
      if (rafId) window.cancelAnimationFrame(rafId);
      hud.style.opacity = '0';
    };
  }, [scopeRef, disabled]);

  if (disabled) return null;

  return (
    <div
      ref={hudRef}
      aria-hidden="true"
      className="pu-cursor-hud pointer-events-none fixed left-0 top-0 z-[85] -ml-9 -mt-9 flex h-[72px] w-[72px] items-center justify-center rounded-full border border-[#FF3038]/80 bg-[#080808]/65 opacity-0 backdrop-blur-sm transition-opacity duration-200"
      style={{
        boxShadow: '0 0 24px rgba(255, 48, 56, 0.35), 0 0 10px rgba(255, 48, 56, 0.2) inset',
      }}
    >
      <span className="absolute -inset-1 rounded-full border border-[#FF3038]/25" />
      <span className="font-orbitron text-[8px] font-bold leading-tight tracking-[0.16em] text-white text-center px-1">
        EXPLORE
      </span>
    </div>
  );
};

