import React from 'react';

const SCAN_SPARKS: Array<{
  left: string;
  top: string;
  sx: string;
  sy: string;
  sd: string;
}> = [
  { left: '22px', top: '14px', sx: '-8px', sy: '-10px', sd: '0.12s' },
  { left: '46px', top: '16px', sx: '10px', sy: '-8px', sd: '0.17s' },
  { left: '54px', top: '34px', sx: '11px', sy: '6px', sd: '0.20s' },
  { left: '34px', top: '48px', sx: '2px', sy: '10px', sd: '0.16s' },
  { left: '16px', top: '36px', sx: '-9px', sy: '5px', sd: '0.14s' },
];

export const LaserScanEffect: React.FC = () => {
  return (
    <>
      <span className="tech-card-holo-glow" aria-hidden="true" />
      <span className="tech-laser-overlay" aria-hidden="true">
        {SCAN_SPARKS.map((sp, i) => (
          <span
            key={i}
            className="tech-scan-spark"
            style={
              {
                left: sp.left,
                top: sp.top,
                '--sx': sp.sx,
                '--sy': sp.sy,
                '--sd': sp.sd,
              } as React.CSSProperties
            }
          />
        ))}
      </span>
    </>
  );
};

