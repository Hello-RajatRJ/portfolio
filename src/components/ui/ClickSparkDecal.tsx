import React, { useEffect, useState } from 'react';

interface BulletHole {
  id: number;
  x: number;
  y: number;
  rotation: number;
}

interface Spark {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

export const ClickSparkDecal: React.FC = () => {
  const [decals, setDecals] = useState<BulletHole[]>([]);
  const [sparks, setSparks] = useState<Spark[]>([]);

  useEffect(() => {
    let nextId = 0;

    const handleClick = (e: MouseEvent) => {
      // Don't spawn on touches or if clicked element has data-no-decal
      const target = e.target as HTMLElement | null;
      if (target?.closest('[data-no-decal="true"]')) return;

      const clickX = e.clientX;
      const clickY = e.clientY;
      const id = ++nextId;

      // 1. Add Bullet Hole
      const newHole: BulletHole = {
        id,
        x: clickX,
        y: clickY,
        rotation: Math.floor(Math.random() * 360),
      };

      setDecals((prev) => [...prev.slice(-12), newHole]); // keep max 12 holes on screen

      // 2. Generate Sparks
      const newSparks: Spark[] = [];
      const sparkCount = 9;
      for (let i = 0; i < sparkCount; i++) {
        const angle = (Math.PI * 2 * i) / sparkCount + (Math.random() - 0.5) * 0.5;
        const speed = Math.random() * 4.5 + 2.5;
        newSparks.push({
          id: id * 100 + i,
          x: clickX,
          y: clickY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 2.5 + 1.5,
          opacity: 1,
        });
      }

      setSparks((prev) => [...prev, ...newSparks]);

      // Remove bullet hole after 4 seconds
      setTimeout(() => {
        setDecals((prev) => prev.filter((h) => h.id !== id));
      }, 4000);
    };

    window.addEventListener('click', handleClick);

    // Animate sparks
    let rafId: number;
    const animateSparks = () => {
      setSparks((prev) => {
        if (prev.length === 0) return prev;
        return prev
          .map((s) => ({
            ...s,
            x: s.x + s.vx,
            y: s.y + s.vy,
            vy: s.vy + 0.18, // slight gravity
            opacity: s.opacity - 0.04,
          }))
          .filter((s) => s.opacity > 0);
      });
      rafId = requestAnimationFrame(animateSparks);
    };

    rafId = requestAnimationFrame(animateSparks);

    return () => {
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[998] overflow-hidden" aria-hidden="true">
      {/* Bullet Holes */}
      {decals.map((hole) => (
        <div
          key={hole.id}
          className="absolute -translate-x-1/2 -translate-y-1/2 transition-opacity duration-1000 animate-in fade-in zoom-in-75 duration-75"
          style={{
            left: `${hole.x}px`,
            top: `${hole.y}px`,
            transform: `translate(-50%, -50%) rotate(${hole.rotation}deg)`,
          }}
        >
          {/* Stylized Deadpool Bullet Decal */}
          <div className="relative h-6 w-6">
            {/* Dark scorched crater */}
            <div className="absolute inset-1 rounded-full bg-black border border-[#8B0000] shadow-[0_0_8px_rgba(230,36,41,0.7)]" />
            {/* Center punched puncture */}
            <div className="absolute inset-2 rounded-full bg-[#050102] shadow-inner" />
            {/* Jagged radial fractures */}
            <div className="absolute top-1/2 left-0 w-6 h-[1.5px] -translate-y-1/2 bg-gradient-to-r from-transparent via-[#E62429]/60 to-transparent" />
            <div className="absolute top-0 left-1/2 h-6 w-[1.5px] -translate-x-1/2 bg-gradient-to-b from-transparent via-[#E62429]/60 to-transparent" />
          </div>
        </div>
      ))}

      {/* Sparks */}
      {sparks.map((spark) => (
        <div
          key={spark.id}
          className="absolute rounded-full bg-[#FF2D2D] shadow-[0_0_6px_#FF2D2D]"
          style={{
            left: `${spark.x}px`,
            top: `${spark.y}px`,
            width: `${spark.size}px`,
            height: `${spark.size}px`,
            opacity: spark.opacity,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
};
