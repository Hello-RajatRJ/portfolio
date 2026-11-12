import React, { useEffect, useRef } from 'react';
import type { PointerScreenState } from './hoverMath';

interface AmbientParticleFieldProps {
  sectionRef: React.RefObject<HTMLElement | null>;
  pointerRef: React.MutableRefObject<PointerScreenState>;
  active: boolean;
  reducedMotion: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ox: number; // displaced mouse repulsion x
  oy: number; // displaced mouse repulsion y
  size: number;
  alpha: number;
  depth: number; // parallax multiplier
  kind: 'dark' | 'red' | 'spark';
  pulsePhase: number;
}

export const AmbientParticleField: React.FC<AmbientParticleFieldProps> = ({
  sectionRef,
  pointerRef,
  active,
  reducedMotion,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const parallaxRef = useRef({ x: 0, y: 0 });
  const sizeRef = useRef({ w: 0, h: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const initParticles = (w: number, h: number) => {
      const isMobile = w < 768;
      const count = isMobile ? 48 : 96;
      const list: Particle[] = [];

      for (let i = 0; i < count; i++) {
        const rand1 = ((i * 73 + 17) % 100) / 100;
        const rand2 = ((i * 41 + 59) % 100) / 100;
        const rand3 = ((i * 97 + 11) % 100) / 100;

        // Mix horizontal drifters, vertical travelers, and slow orbital motes
        const horizontalBias = i % 3 === 0;
        const vx = horizontalBias
          ? (rand1 > 0.5 ? 1 : -1) * (0.14 + rand2 * 0.22)
          : (rand1 - 0.5) * 0.16;
        const vy = !horizontalBias
          ? (rand2 > 0.5 ? -1 : 1) * (0.12 + rand3 * 0.24)
          : (rand2 - 0.5) * 0.12;

        const kind: Particle['kind'] =
          i % 9 === 0 ? 'spark' : i % 3 === 0 ? 'red' : 'dark';

        list.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx,
          vy,
          ox: 0,
          oy: 0,
          size: kind === 'spark' ? 1.8 + rand1 * 1.4 : kind === 'red' ? 1.2 + rand2 * 1.1 : 1.0 + rand3 * 1.4,
          alpha: kind === 'spark' ? 0.55 + rand1 * 0.35 : kind === 'red' ? 0.25 + rand2 * 0.25 : 0.16 + rand3 * 0.16,
          depth: kind === 'spark' ? 0.95 : kind === 'red' ? 0.6 : 0.3,
          kind,
          pulsePhase: i * 0.7,
        });
      }
      particlesRef.current = list;
    };

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      sizeRef.current = { w, h };
      canvas.width = w;
      canvas.height = h;
      if (particlesRef.current.length === 0) {
        initParticles(w, h);
      }
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    let rafId = 0;
    let lastTime = performance.now();

    const drawFrame = (now: number) => {
      const secEl = sectionRef.current;
      const { w, h } = sizeRef.current;
      if (!secEl || w === 0 || h === 0) return;

      const secRect = secEl.getBoundingClientRect();
      // Keep canvas aligned smoothly to visible slice of #skills
      const maxOffset = Math.max(0, secRect.height - h);
      const scrollOffset = Math.max(0, Math.min(-secRect.top, maxOffset));
      canvas.style.transform = `translate3d(0, ${scrollOffset.toFixed(1)}px, 0)`;

      const dt = Math.min((now - lastTime) / 16.67, 2.5);
      lastTime = now;
      const tSec = now * 0.001;

      const ptr = pointerRef.current;
      const targetPx = ptr.active ? ((ptr.x / w) - 0.5) * 26 : 0;
      const targetPy = ptr.active ? ((ptr.y / h) - 0.5) * 22 : 0;
      parallaxRef.current.x += (targetPx - parallaxRef.current.x) * 0.06;
      parallaxRef.current.y += (targetPy - parallaxRef.current.y) * 0.06;

      ctx.clearRect(0, 0, w, h);

      const particles = particlesRef.current;
      const localMouseX = ptr.x - secRect.left;
      const localMouseY = ptr.y - secRect.top - scrollOffset;
      const maxLinkDistSq = 108 * 108;
      const repelRadius = 138;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!reducedMotion) {
          p.x += p.vx * dt;
          p.y += p.vy * dt;

          if (p.x < -12) p.x = w + 12;
          if (p.x > w + 12) p.x = -12;
          if (p.y < -12) p.y = h + 12;
          if (p.y > h + 12) p.y = -12;
        }

        const baseDrawX = p.x + parallaxRef.current.x * p.depth;
        const baseDrawY = p.y + parallaxRef.current.y * p.depth;

        if (ptr.active && !reducedMotion) {
          const mdx = baseDrawX + p.ox - localMouseX;
          const mdy = baseDrawY + p.oy - localMouseY;
          const mDist = Math.hypot(mdx, mdy);
          if (mDist < repelRadius && mDist > 1) {
            const force = (1 - mDist / repelRadius) * 2.1;
            p.ox += (mdx / mDist) * force * dt;
            p.oy += (mdy / mDist) * force * dt;
          }
        }

        // Elastic settle back
        p.ox *= Math.pow(0.93, dt);
        p.oy *= Math.pow(0.93, dt);

        const px = baseDrawX + p.ox;
        const py = baseDrawY + p.oy;

        // Subtle connecting constellation lines between nearby mid/foreground particles
        if (p.depth >= 0.55) {
          for (let j = i + 1; j < particles.length; j++) {
            const q = particles[j];
            if (q.depth < 0.55) continue;
            const qx = q.x + parallaxRef.current.x * q.depth + q.ox;
            const qy = q.y + parallaxRef.current.y * q.depth + q.oy;
            const dx = qx - px;
            const dy = qy - py;
            const distSq = dx * dx + dy * dy;

            if (distSq < maxLinkDistSq) {
              const distRatio = 1 - Math.sqrt(distSq) / 108;
              let boost = 1;
              if (ptr.active) {
                const mx = (px + qx) * 0.5 - localMouseX;
                const my = (py + qy) * 0.5 - localMouseY;
                if (mx * mx + my * my < 170 * 170) boost = 1.9;
              }
              ctx.strokeStyle = `rgba(255, 48, 56, ${(0.085 * distRatio * boost).toFixed(3)})`;
              ctx.lineWidth = 0.7;
              ctx.beginPath();
              ctx.moveTo(px, py);
              ctx.lineTo(qx, qy);
              ctx.stroke();
            }
          }
        }

        // Draw particle node
        const pulse = reducedMotion ? 1 : 0.78 + 0.22 * Math.sin(tSec * 2.1 + p.pulsePhase);
        const alpha = p.alpha * pulse;

        if (p.kind === 'spark') {
          ctx.fillStyle = `rgba(255, 92, 64, ${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(px, py, p.size * 2.1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 48, 56, ${(alpha * 0.22).toFixed(3)})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 195, 185, ${alpha.toFixed(3)})`;
          ctx.fill();
        } else if (p.kind === 'red') {
          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(201, 21, 32, ${alpha.toFixed(3)})`;
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(120, 28, 32, ${alpha.toFixed(3)})`;
          ctx.fill();
        }
      }

      if (active && !reducedMotion) {
        rafId = requestAnimationFrame(drawFrame);
      }
    };

    // Draw once immediately even if reducedMotion so background looks atmospheric
    drawFrame(performance.now());
    if (active && !reducedMotion) {
      rafId = requestAnimationFrame(drawFrame);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, [sectionRef, pointerRef, active, reducedMotion]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      <canvas
        ref={canvasRef}
        className="w-full h-screen block will-change-transform"
        style={{ opacity: 0.92 }}
      />
    </div>
  );
};

