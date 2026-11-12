import React, { useEffect, useRef } from 'react';
import type { ParallaxSignalState } from './projectTypes';

interface ProjectParallaxBackdropProps {
  signalRef: React.MutableRefObject<ParallaxSignalState>;
  introVisible: boolean;
  reducedMotion: boolean;
}

const DISTANT_TOWERS = [
  { left: '3%', width: 42, height: 145, beaconTop: 14 },
  { left: '9%', width: 64, height: 210, beaconTop: 8 },
  { left: '17%', width: 38, height: 120, beaconTop: 10 },
  { left: '25%', width: 76, height: 180, beaconTop: 12 },
  { left: '36%', width: 46, height: 135, beaconTop: 16 },
  { left: '47%', width: 88, height: 225, beaconTop: 6 },
  { left: '58%', width: 54, height: 155, beaconTop: 14 },
  { left: '69%', width: 72, height: 198, beaconTop: 10 },
  { left: '79%', width: 44, height: 142, beaconTop: 14 },
  { left: '87%', width: 68, height: 188, beaconTop: 9 },
  { left: '94%', width: 48, height: 132, beaconTop: 12 },
];

const STREAK_LINES = [
  { top: '14%', width: '28%', left: '8%' },
  { top: '34%', width: '22%', left: '66%' },
  { top: '58%', width: '32%', left: '18%' },
  { top: '79%', width: '24%', left: '58%' },
];

export const ProjectParallaxBackdrop: React.FC<ProjectParallaxBackdropProps> = ({
  signalRef,
  introVisible,
  reducedMotion,
}) => {
  const skyLayerRef = useRef<HTMLDivElement>(null);
  const skylineLayerRef = useRef<HTMLDivElement>(null);
  const streaksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;

    let rafId = 0;
    let curX = 0;
    let curY = 0;
    let curVel = 0;

    const tick = () => {
      const s = signalRef.current;
      curX += (s.pointerX - curX) * 0.06;
      curY += (s.pointerY - curY) * 0.06;
      curVel += (Math.min(Math.abs(s.scrollVelocity), 18) - curVel) * 0.12;

      if (skyLayerRef.current) {
        const offsetY = (s.scrollProgress - 0.5) * -28;
        skyLayerRef.current.style.transform = `translate3d(${curX * -14}px, ${curY * -10 + offsetY}px, 0)`;
      }

      if (skylineLayerRef.current) {
        const horizonShiftY = (s.scrollProgress - 0.5) * -46;
        skylineLayerRef.current.style.transform = `translate3d(${curX * -24}px, ${curY * -12 + horizonShiftY}px, 0)`;
      }

      if (streaksRef.current) {
        const opacity = Math.min(0.42, curVel * 0.035);
        streaksRef.current.style.opacity = opacity.toFixed(3);
        streaksRef.current.style.transform = `translate3d(${-curVel * 6}px, 0, 0)`;
      }

      if (s.active) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    const checkAndRun = () => {
      rafId = window.requestAnimationFrame(tick);
    };

    checkAndRun();
    const interval = window.setInterval(() => {
      if (signalRef.current.active && rafId === 0) {
        rafId = window.requestAnimationFrame(tick);
      }
    }, 350);

    return () => {
      window.clearInterval(interval);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [signalRef, reducedMotion]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
    >
      {/* Layer 1A: Obsidian atmospheric mist & faint cosmic coordinate grid */}
      <div
        ref={skyLayerRef}
        className={`absolute -inset-12 transition-opacity duration-1000 ${
          introVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 45% at 22% 18%, rgba(255, 48, 56, 0.085) 0%, transparent 65%), radial-gradient(ellipse 65% 50% at 82% 72%, rgba(201, 21, 32, 0.08) 0%, transparent 65%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,48,56,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,48,56,0.35) 1px, transparent 1px)',
            backgroundSize: '88px 88px',
            maskImage: 'radial-gradient(ellipse 80% 75% at 50% 45%, #000 35%, transparent 100%)',
          }}
        />
      </div>

      {/* Layer 1B: Distant futuristic industrial skyline silhouettes + crimson aerial beacons */}
      <div
        ref={skylineLayerRef}
        className={`absolute inset-x-0 bottom-0 h-72 transition-opacity duration-1000 ${
          introVisible ? 'opacity-70' : 'opacity-0'
        }`}
      >
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, #080808 18%, rgba(8, 8, 8, 0.4) 68%, transparent 100%)',
          }}
        />
        {DISTANT_TOWERS.map((tower, idx) => (
          <div
            key={`tower-${idx}`}
            className="absolute bottom-0 border-t border-x border-red-900/20"
            style={{
              left: tower.left,
              width: `${tower.width}px`,
              height: `${tower.height}px`,
              background:
                'linear-gradient(180deg, rgba(22, 10, 12, 0.85) 0%, rgba(10, 10, 11, 0.95) 60%, #080808 100%)',
            }}
          >
            {/* Subtle structural slit windows */}
            <div className="mx-auto mt-6 h-16 w-[2px] bg-gradient-to-b from-red-500/30 via-red-700/10 to-transparent" />
            {/* Tiny crimson industrial roof beacon */}
            <span
              className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#FF3038]"
              style={{
                top: `${tower.beaconTop}px`,
                boxShadow: '0 0 10px 2px rgba(255, 48, 56, 0.65)',
                opacity: idx % 2 === 0 ? 0.78 : 0.45,
              }}
            />
          </div>
        ))}
      </div>

      {/* Layer 1C: Scroll-velocity crimson horizon streak trails */}
      <div
        ref={streaksRef}
        className="absolute inset-0 opacity-0 transition-opacity duration-200"
      >
        {STREAK_LINES.map((streak, i) => (
          <div
            key={`streak-${i}`}
            className="absolute h-px bg-gradient-to-r from-transparent via-[#FF3038]/55 to-transparent"
            style={{
              top: streak.top,
              left: streak.left,
              width: streak.width,
            }}
          />
        ))}
      </div>
    </div>
  );
};

