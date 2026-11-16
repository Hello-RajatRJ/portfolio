import React, { useRef, useState, useEffect } from 'react';
import { useInView } from 'framer-motion';
import { Globe, ArrowUpRight } from 'lucide-react';
import { scrollToTarget } from '../../hooks/useLenisScroll';

const COUNTRIES_SERVED = [
  { name: 'USA', flag: '🇺🇸' },
  { name: 'Australia', flag: '🇦🇺' },
  { name: 'Taiwan', flag: '🇹🇼' },
  { name: 'India', flag: '🇮🇳' },
  { name: 'Armenia', flag: '🇦🇲' },
];

const STATS = [
  { value: 4, suffix: '', label: 'Years Experience' },
  { value: 8, suffix: '+', label: 'Projects Shipped' },
  { value: 15, suffix: '+', label: 'Technologies' },
  { value: 4, suffix: '', label: 'Verticals' },
];

export const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });

  // Subtle 3D tilt tracking for Photo Card
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [counts, setCounts] = useState([0, 0, 0, 0]);

  // Animated stat counters counting up once
  useEffect(() => {
    if (!inView) return;
    const duration = 1200;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setCounts(STATS.map((s) => Math.floor(ease * s.value)));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCounts(STATS.map((s) => s.value));
      }
    };

    requestAnimationFrame(animate);
  }, [inView]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rx: -y * 10,
      ry: x * 10,
    });
  };

  const handlePointerLeave = () => {
    setTilt({ rx: 0, ry: 0 });
    setIsHovered(false);
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-screen py-24 sm:py-32 bg-[#050505] overflow-hidden select-none border-t border-white/[0.04]"
    >
      {/* Subtle Background Watermark */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 pointer-events-none select-none z-0 overflow-hidden flex justify-center">
        <span
          className="font-orbitron font-black text-[20vw] tracking-tighter opacity-[0.03] select-none"
          style={{ WebkitTextStroke: '1px rgba(255,255,255,0.4)', color: 'transparent' }}
        >
          ENGINEER
        </span>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Pre-title */}
        <div className="mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-[1px] w-6 bg-[#E62429]" />
            <span className="font-mono text-xs font-semibold tracking-[0.25em] text-[#E62429] uppercase">
              01 // BACKGROUND &amp; PHILOSOPHY
            </span>
          </div>

          <h2 className="font-orbitron text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            FULL-STACK ARCHITECTURE, <span className="text-[#E62429]">BUILT FOR SCALE.</span>
          </h2>
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Framed Photo with offset 1px red border and subtle RGB-split on hover */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-sm">
              {/* Offset 1px Red Border Frame */}
              <div className="absolute -inset-2.5 rounded-2xl border border-[#E62429]/60 shadow-[0_0_25px_rgba(230,36,41,0.25)] pointer-events-none transform -rotate-1" />

              {/* 3D Tilt Photo Card Container */}
              <div
                ref={cardRef}
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerLeave}
                onMouseEnter={() => setIsHovered(true)}
                style={{
                  transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                  transition: 'transform 0.15s ease-out',
                }}
                className="relative overflow-hidden rounded-xl bg-[#0D0D0D] border border-white/10 p-2 shadow-2xl group"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-neutral-900">
                  <img
                    src="/myimage.png"
                    alt="Rajat Ambedkar"
                    className={`h-full w-full object-cover object-top transition-all duration-300 ${
                      isHovered
                        ? 'contrast-115 filter drop-shadow-[-2px_0_0_rgba(0,255,255,0.6)] drop-shadow-[2px_0_0_rgba(230,36,41,0.8)]'
                        : 'grayscale-[20%]'
                    }`}
                  />

                  {/* Gradient Bottom Shadow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90" />

                  {/* Name Badge */}
                  <div className="absolute bottom-4 left-4 right-4 text-left">
                    <span className="font-orbitron text-lg font-black text-white block tracking-wide">
                      RAJAT AMBEDKAR
                    </span>
                    <span className="font-mono text-xs text-[#FF2D2D] font-medium tracking-wider">
                      Full-Stack Developer · Mohali, India (IST)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Masked Line Reveals & Stat Counters */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h3 className="font-orbitron text-2xl sm:text-3xl font-black text-white leading-snug">
              Specialized in high-load React products, robust Node APIs, and{' '}
              <span className="text-[#FF2D2D]">interactive web graphics.</span>
            </h3>

            {/* Line-by-Line Narrative */}
            <div className="mt-5 space-y-4 text-base sm:text-lg leading-relaxed text-neutral-300 font-inter">
              <p>
                I am a full-stack developer with 4 years of hands-on experience building and scaling software for international clients across healthcare, EdTech, FinTech, and AI.
              </p>
              <p>
                My work centers on solid software foundations: maintainable TypeScript codebases, high-throughput REST and GraphQL services, structured enterprise dashboards with React-Admin, and optimized 3D graphics that run smoothly at 60fps on consumer devices.
              </p>
            </div>

            {/* 4 Stat Counters (Years, Projects shipped, Technologies, Verticals) */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {STATS.map((stat, idx) => (
                <div
                  key={stat.label}
                  className="rounded-lg bg-[#0D0D0D] p-3.5 border border-white/10"
                >
                  <div className="font-orbitron text-2xl sm:text-3xl font-black text-white">
                    <span className="text-[#FF2D2D]">{counts[idx]}</span>
                    <span>{stat.suffix}</span>
                  </div>
                  <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-neutral-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Open to Work Note with Direct Contact Link */}
            <div className="mt-7 flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-lg border border-[#E62429]/30 bg-[#E62429]/05">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="font-mono text-xs text-neutral-200">
                  Status: <strong className="text-white">Open to relocation &amp; freelance</strong> worldwide
                </span>
              </div>
              <button
                onClick={() => scrollToTarget('#contact')}
                className="inline-flex items-center gap-1 font-mono text-xs text-[#FF2D2D] hover:text-white transition-colors cursor-pointer"
              >
                <span>Get in touch</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Global Footprint */}
            <div className="mt-7 pt-5 border-t border-white/10 flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] font-bold tracking-widest text-[#9CA3AF] uppercase mr-2 flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-[#E62429]" />
                CLIENTS IN:
              </span>
              {COUNTRIES_SERVED.map((c) => (
                <span
                  key={c.name}
                  className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-[#0D0D0D] px-2.5 py-1 font-mono text-xs text-neutral-300"
                >
                  <span>{c.flag}</span>
                  <span>{c.name}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
