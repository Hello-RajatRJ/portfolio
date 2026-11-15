import React, { useEffect, useState } from 'react';

export const ScrollProgressBar: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) {
        setProgress(0);
        return;
      }
      const currentScroll = window.scrollY;
      const pct = Math.min(100, Math.max(0, (currentScroll / totalHeight) * 100));
      setProgress(pct);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 right-0 z-[1001] h-[2.5px] bg-transparent"
    >
      <div
        className="h-full bg-gradient-to-r from-[#8B0000] via-[#E62429] to-[#FF2D2D] transition-[width] duration-75 ease-out"
        style={{
          width: `${progress}%`,
          boxShadow: '0 0 12px #FF2D2D, 0 0 4px #FFFFFF',
        }}
      />
    </div>
  );
};
