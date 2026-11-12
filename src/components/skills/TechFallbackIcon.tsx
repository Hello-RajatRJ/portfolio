import React from 'react';
import type { TechMetadata } from '../../data/techRegistry';

interface TechFallbackIconProps {
  tech: TechMetadata;
  className?: string;
}

const SPECIAL_SVGS: Record<string, (color: string, sec: string) => React.ReactNode> = {
  'react-atom': (c) => (
    <>
      <circle cx="50" cy="50" r="9" fill={c} />
      <g fill="none" stroke={c} strokeWidth="4.5">
        <ellipse cx="50" cy="50" rx="40" ry="15" />
        <ellipse cx="50" cy="50" rx="40" ry="15" transform="rotate(60 50 50)" />
        <ellipse cx="50" cy="50" rx="40" ry="15" transform="rotate(120 50 50)" />
      </g>
    </>
  ),
  'redux-zustand': (c, sec) => (
    <>
      <g fill="none" stroke={c} strokeWidth="4.5">
        <ellipse cx="50" cy="50" rx="37" ry="16" transform="rotate(20 50 50)" />
        <ellipse cx="50" cy="50" rx="37" ry="16" transform="rotate(140 50 50)" />
      </g>
      <circle cx="50" cy="50" r="10" fill={sec} />
    </>
  ),
  'docker-whale': (c) => (
    <>
      <rect x="24" y="24" width="14" height="12" rx="2" fill="#38BDF8" />
      <rect x="42" y="24" width="14" height="12" rx="2" fill="#0EA5E9" />
      <rect x="33" y="39" width="14" height="12" rx="2" fill="#38BDF8" />
      <rect x="51" y="39" width="14" height="12" rx="2" fill="#7DD3FC" />
      <rect x="15" y="39" width="14" height="12" rx="2" fill="#0EA5E9" />
      <path d="M12 54 H72 C76 47 84 44 90 48 C88 55 83 59 77 61 C71 76 54 84 36 84 C19 84 10 73 12 54 Z" fill={c} />
    </>
  ),
  'java-cup': (c, sec) => (
    <>
      <path d="M48 36 C38 28 58 20 46 10" stroke={c} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M24 44 H68 V64 C68 74 58 80 46 80 C34 80 24 74 24 64 Z" fill={sec} />
      <path d="M68 48 H74 A7 7 0 0 1 74 64 H68" fill="none" stroke={sec} strokeWidth="5" />
      <ellipse cx="46" cy="84" rx="28" ry="5" fill={sec} opacity="0.8" />
    </>
  ),
  'threejs-pyramid': (c, sec) => (
    <>
      <polygon points="50,14 86,80 14,80" fill="none" stroke={c} strokeWidth="5" strokeLinejoin="round" />
      <polygon points="50,48 68,80 32,80" fill="none" stroke={sec} strokeWidth="4" strokeLinejoin="round" />
      <circle cx="50" cy="52" r="7" fill={sec} />
    </>
  ),
  'ai-core': (c, sec) => (
    <>
      <ellipse cx="50" cy="50" rx="38" ry="18" fill="none" stroke={sec} strokeWidth="4" transform="rotate(35 50 50)" />
      <ellipse cx="50" cy="50" rx="38" ry="18" fill="none" stroke="#FCA5A5" strokeWidth="3.5" transform="rotate(-35 50 50)" />
      <polygon points="50,24 70,50 50,76 30,50" fill={c} />
    </>
  ),
  'git-tree': (c, sec) => (
    <>
      <path d="M50 8 L92 50 L50 92 L8 50 Z" fill={c} />
      <line x1="50" y1="26" x2="50" y2="70" stroke={sec} strokeWidth="5" strokeLinecap="round" />
      <line x1="50" y1="42" x2="67" y2="33" stroke={sec} strokeWidth="5" strokeLinecap="round" />
      <circle cx="50" cy="26" r="6" fill={sec} />
      <circle cx="50" cy="70" r="6" fill={sec} />
      <circle cx="67" cy="33" r="6" fill={sec} />
    </>
  ),
  'socketio-bolt': (c, sec) => (
    <>
      <circle cx="50" cy="50" r="38" fill="#111827" stroke={c} strokeWidth="7" />
      <path d="M55 20 L34 53 H48 L43 80 L67 47 H53 Z" fill={sec} />
    </>
  ),
  'agile-orbit': (c, sec) => (
    <>
      <path d="M22 60 A32 32 0 1 1 78 36" fill="none" stroke={c} strokeWidth="7" strokeLinecap="round" />
      <polygon points="82,48 70,32 88,30" fill={sec} />
      <circle cx="50" cy="50" r="8" fill="#FFFFFF" />
    </>
  ),
  'cicd-gears': (c) => (
    <>
      <circle cx="38" cy="58" r="20" fill="none" stroke={c} strokeWidth="8" strokeDasharray="7 5" />
      <circle cx="64" cy="36" r="14" fill="none" stroke="#E2E8F0" strokeWidth="7" strokeDasharray="6 4" />
    </>
  ),
};

export const TechFallbackIcon: React.FC<TechFallbackIconProps> = ({ tech, className = 'w-full h-full' }) => {
  const specialRenderer = SPECIAL_SVGS[tech.special3D];

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
      style={{ filter: `drop-shadow(0 0 8px ${tech.brandColor}55)` }}
    >
      {specialRenderer
        ? specialRenderer(tech.brandColor, tech.secondaryColor)
        : tech.layers.map((layer, i) => (
            <path key={i} d={layer.d} fill={layer.color} fillRule="evenodd" />
          ))}
    </svg>
  );
};

