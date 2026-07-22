import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TextReveal from '../../components/showcase/TextReveal';
import CharReveal from '../../components/showcase/CharReveal';
import ParallaxImage from '../../components/showcase/ParallaxImage';
import HorizontalScrollPin from '../../components/showcase/HorizontalScrollPin';
import StaggerGrid from '../../components/showcase/StaggerGrid';
import MarqueeText from '../../components/showcase/MarqueeText';

gsap.registerPlugin(ScrollTrigger);

const LIGHTING_MODES = [
  { id: 'DAY', label: 'Daylight', bg: 'from-slate-900 via-slate-900 to-black', overlay: 'bg-amber-500/5' },
  { id: 'TWILIGHT', label: 'Golden Hour', bg: 'from-amber-950 via-slate-950 to-black', overlay: 'bg-orange-500/10' },
  { id: 'NIGHT', label: 'Skyline Night', bg: 'from-indigo-950 via-slate-950 to-black', overlay: 'bg-indigo-500/10' },
];

const HOTSPOTS = [
  { id: 1, title: 'Cantilevered Infinity Pool', x: '25%', y: '45%', desc: '75ft heated glass-bottom pool overlooking the bay.' },
  { id: 2, title: 'Helipad Terrace', x: '80%', y: '20%', desc: 'Private rooftop helipad with direct elevator access.' },
  { id: 3, title: 'Master Penthouse Suite', x: '50%', y: '35%', desc: '3,200 sq ft master pavilion with panoramic floor-to-ceiling glass.' },
  { id: 4, title: 'Sub-Level Cellar & Spa', x: '35%', y: '75%', desc: 'Climate-controlled 1,200 bottle wine sanctuary and thermal spa.' },
];

const RESIDENCES = [
  {
    title: 'THE SKY PENTHOUSE',
    subtitle: 'Floor 84–86',
    description: 'Triple-story residence featuring 14,000 sq ft of interior living, 360-degree skyline views, private glass elevator, and heated infinity lap pool.',
    gradient: 'from-amber-950 via-stone-950 to-black',
    icon: '🏰',
    price: '$28,500,000',
  },
  {
    title: 'THE HARBOR VILLA',
    subtitle: 'Waterfront Estate',
    description: 'Direct deep-water dock access for 120ft yachts. Natural Italian travertine façade, minimalist gardens, and subterranean car collector sanctuary.',
    gradient: 'from-slate-950 via-stone-950 to-black',
    icon: '🚤',
    price: '$18,200,000',
  },
  {
    title: 'THE ALPINE CHALET',
    subtitle: 'Mountain Crest',
    description: 'Ski-in ski-out architectural masterpiece in Aspen. Timber-and-steel cantilever construction, thermal plunge pools, and private observatory.',
    gradient: 'from-blue-950 via-slate-950 to-black',
    icon: '🏔️',
    price: '$22,000,000',
  },
  {
    title: 'THE DESERT OASIS',
    subtitle: 'Scottsdale Ridge',
    description: 'Rammed-earth passive thermal residence blending seamlessly with desert topography. Infinity reflecting pools and solar canopy micro-grid.',
    gradient: 'from-orange-950 via-stone-950 to-black',
    icon: '🌵',
    price: '$15,800,000',
  },
  {
    title: 'THE METROPOLITAN',
    subtitle: 'Tribeca Loft',
    description: 'Restored cast-iron landmark penthouse with 20ft ceilings, original brick arches, private rooftop garden, and sub-zero wine vault.',
    gradient: 'from-neutral-900 via-stone-950 to-black',
    icon: '🏙️',
    price: '$19,500,000',
  },
];

const ESTATE_SPECS = [
  { label: 'TOTAL AREA', value: '14,200', unit: 'SQ FT' },
  { label: 'BEDROOM SUITES', value: '6', unit: 'BEDS' },
  { label: 'BATHROOMS', value: '8.5', unit: 'BATHS' },
  { label: 'CEILING HEIGHT', value: '16.5', unit: 'FEET' },
  { label: 'PRIVATE GARAGE', value: '8', unit: 'CARS' },
  { label: 'TERRACE DECK', value: '3,400', unit: 'SQ FT' },
];

const AMENITIES = [
  { icon: '🚁', title: 'PRIVATE HELIPAD', desc: 'Rooftop FAA-approved landing pad with direct secure elevator to master penthouse.' },
  { icon: '🍷', title: 'SOMMELIER CELLAR', desc: '1,200 bottle humidity-controlled sommelier sanctuary with tasting lounge.' },
  { icon: '🏊', title: 'INFINITY SKY POOL', desc: 'Cantilevered 75ft glass-bottom heated infinity pool extending over the boulevard.' },
  { icon: '🎥', title: 'IMAX SCREENING ROOM', desc: 'Custom 14-seat Dolby Atmos screening room with acoustic isolation.' },
  { icon: '🧘', title: 'THERMAL WELLNESS SPA', desc: 'Finnish cedar sauna, cold plunge, hammam steam, and hydrotherapy pool.' },
  { icon: '🛡️', title: 'BIOMETRIC SECURITY', desc: 'Facial recognition access, subterranean safe room, and 24/7 security concierge.' },
];

const RealEstatePage: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [lightingMode, setLightingMode] = useState(LIGHTING_MODES[1]);
  const [selectedHotspot, setSelectedHotspot] = useState<typeof HOTSPOTS[0] | null>(null);

  // Mortgage Calculator
  const [price, setPrice] = useState(12500000);
  const [downPercent, setDownPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(5.5);
  const termYears = 30;

  const principal = price * (1 - downPercent / 100);
  const monthlyRate = interestRate / 100 / 12;
  const totalPayments = termYears * 12;
  const monthlyPayment = Math.round(
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
      (Math.pow(1 + monthlyRate, totalPayments) - 1)
  );

  useEffect(() => {
    gsap.utils.toArray('.estate-reveal').forEach((section) => {
      gsap.from(section as HTMLElement, {
        scrollTrigger: { trigger: section as HTMLElement, start: 'top 85%', toggleActions: 'play none none reverse' },
        y: 60, opacity: 0, duration: 1.2, ease: 'power3.out',
      });
    });
    return () => { ScrollTrigger.getAll().forEach((t) => t.kill()); };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = `perspective(1000px) rotateX(${-y / 25}deg) rotateY(${x / 25}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-white overflow-x-hidden select-none font-inter">

      {/* ═══════════════════════════════════════════
          SECTION 1: FULL-BLEED PARALLAX HERO
          ═══════════════════════════════════════════ */}
      <ParallaxImage
        src="/images/categories/real-estate.jpg"
        alt="AURA Horizon Penthouse Residence"
        height="100vh"
        parallaxAmount={150}
        initialScale={1.2}
        overlayColor="rgba(8,8,10,0.5)"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-orbitron tracking-[0.3em] mb-10 shadow-lg shadow-amber-500/10"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          ARCHITECTURAL RESIDENCES
        </motion.div>

        <TextReveal
          text="AURA"
          as="h1"
          className="font-orbitron text-7xl md:text-[10rem] lg:text-[13rem] font-black leading-none tracking-tighter bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent"
          stagger={0.1}
        />
        <TextReveal
          text="HORIZON"
          as="h2"
          className="font-orbitron text-3xl md:text-5xl lg:text-7xl font-light leading-none tracking-[0.3em] text-white/60 mt-2"
          stagger={0.12}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="text-amber-100/40 text-sm md:text-base max-w-md mx-auto mt-8 text-center tracking-wider font-light"
        >
          Architectural sanctuary where monolithic glass meets ocean horizon.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 flex flex-col items-center gap-3"
        >
          <span className="font-orbitron text-[9px] tracking-[0.4em] text-amber-400/40">SCROLL TO DISCOVER</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="w-px h-16 bg-gradient-to-b from-amber-400/40 to-transparent"
          />
        </motion.div>
      </ParallaxImage>

      {/* ═══════════════════════════════════════════
          SECTION 2: PHILOSOPHY — CHAR REVEAL
          ═══════════════════════════════════════════ */}
      <section className="relative py-32 md:py-48 px-6 md:px-12 lg:px-24 bg-[#08080a]">
        <div className="max-w-5xl mx-auto">
          <span className="font-orbitron text-xs tracking-[0.4em] text-amber-400/50 block mb-12">ARCHITECTURAL VISION</span>
          <CharReveal
            text="Architecture is the freeze-frame of human emotion in stone and glass. We do not construct buildings; we curate lived sanctuaries that frame the sunrise, capture the breeze, and elevate daily life into an ongoing artistic performance."
            className="text-3xl md:text-5xl lg:text-6xl font-light leading-tight tracking-tight text-white"
            start="top 80%"
            end="bottom 30%"
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 3: MARQUEE BAND
          ═══════════════════════════════════════════ */}
      <section className="border-y border-amber-500/10 bg-amber-500/[0.02]">
        <MarqueeText
          items={['ARCHITECTURE', 'LUXURY', 'PENTHOUSE', 'HAVEN', 'CANTILEVER', 'HORIZON']}
          speed={22}
          separator="🏛️"
          className="text-amber-400/15"
        />
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 4: HORIZONTAL SCROLL — RESIDENCES
          ═══════════════════════════════════════════ */}
      <section className="bg-[#08080a]">
        <div className="py-20 px-6 md:px-12">
          <div className="flex items-baseline justify-between mb-4 max-w-7xl mx-auto">
            <div>
              <span className="font-orbitron text-xs tracking-[0.4em] text-amber-400/50 block mb-3">GLOBAL PORTFOLIO</span>
              <h2 className="font-orbitron text-4xl md:text-6xl font-black tracking-tight">
                FRESH <span className="font-light italic text-amber-200/70">Residences</span>
              </h2>
            </div>
            <span className="hidden md:block font-orbitron text-xs tracking-widest text-white/20">SCROLL →</span>
          </div>
        </div>

        <HorizontalScrollPin className="bg-[#08080a]" scrollMultiplier={4}>
          {RESIDENCES.map((item, i) => (
            <div
              key={i}
              className={`flex-shrink-0 w-[85vw] md:w-[45vw] h-[75vh] rounded-3xl overflow-hidden border border-amber-500/20 bg-gradient-to-br ${item.gradient} p-10 md:p-14 flex flex-col justify-between group hover:border-amber-400/40 transition-colors duration-500`}
            >
              <div>
                <div className="flex justify-between items-start">
                  <span className="font-orbitron text-xs tracking-[0.3em] text-amber-400/60 block mb-2">{item.subtitle}</span>
                  <span className="font-orbitron text-sm font-bold text-amber-300 bg-amber-500/20 px-4 py-1.5 rounded-full border border-amber-500/30">
                    {item.price}
                  </span>
                </div>
                <div className="text-7xl md:text-8xl my-6 group-hover:scale-110 transition-transform duration-700">{item.icon}</div>
              </div>
              <div>
                <h3 className="font-orbitron text-3xl md:text-4xl font-black tracking-wider mb-4 text-white">{item.title}</h3>
                <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-lg">{item.description}</p>
              </div>
            </div>
          ))}
        </HorizontalScrollPin>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 5: FULL-WIDTH IMAGE BREAK
          ═══════════════════════════════════════════ */}
      <ParallaxImage
        src="/images/categories/real-estate.jpg"
        alt="Architectural Luxury Interior"
        height="70vh"
        parallaxAmount={80}
        initialScale={1.1}
        overlayColor="rgba(8,8,10,0.4)"
        className="border-y border-amber-500/10"
      >
        <div className="text-center">
          <span className="font-orbitron text-xs tracking-[0.4em] text-amber-400/50 block mb-4">CRAFTED FOR ETERNITY</span>
          <h2 className="font-orbitron text-5xl md:text-8xl font-black tracking-tighter text-white">
            UNRIVALED <span className="text-amber-400">LUXURY</span>
          </h2>
        </div>
      </ParallaxImage>

      {/* ═══════════════════════════════════════════
          SECTION 6: STAGGERED ESTATE SPECS
          ═══════════════════════════════════════════ */}
      <section className="py-32 px-6 md:px-12 bg-[#08080a]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="font-orbitron text-xs tracking-[0.4em] text-amber-400/50 block mb-3">RESIDENCE METRICS</span>
            <h2 className="font-orbitron text-4xl md:text-6xl font-black tracking-tight text-white">
              PENTHOUSE <span className="text-amber-400">SPECS</span>
            </h2>
          </div>

          <StaggerGrid columns="grid-cols-2 md:grid-cols-3" gap="gap-6" stagger={0.1}>
            {ESTATE_SPECS.map((spec) => (
              <div key={spec.label} className="p-8 md:p-10 border border-amber-500/15 bg-amber-950/20 rounded-2xl text-center group hover:border-amber-400/30 transition-all duration-500">
                <span className="font-orbitron text-[10px] tracking-[0.3em] text-amber-300/40 block mb-4">{spec.label}</span>
                <div className="font-orbitron text-4xl md:text-5xl font-black text-white mb-1">{spec.value}</div>
                <span className="font-orbitron text-xs tracking-widest text-amber-400">{spec.unit}</span>
              </div>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 7: STAGGERED AMENITIES GRID
          ═══════════════════════════════════════════ */}
      <section className="py-32 px-6 md:px-12 bg-[#050507] border-y border-amber-500/10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <span className="font-orbitron text-xs tracking-[0.4em] text-amber-400/50 block mb-3">PRIVATE APPOINTMENTS</span>
            <h2 className="font-orbitron text-4xl md:text-6xl font-black tracking-tight text-white">
              EXCLUSIVE <span className="font-light italic text-amber-200/70">Amenities</span>
            </h2>
          </div>

          <StaggerGrid columns="grid-cols-1 md:grid-cols-2 lg:grid-cols-3" gap="gap-6" stagger={0.1}>
            {AMENITIES.map((a) => (
              <div key={a.title} className="p-8 border border-amber-500/15 bg-amber-950/20 rounded-2xl group hover:border-amber-400/40 transition-all duration-500">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{a.icon}</div>
                <h3 className="font-orbitron text-base font-bold mb-2 text-white">{a.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 8: 3D CARD & HOTSPOTS (existing)
          ═══════════════════════════════════════════ */}
      <section className="estate-reveal py-24 px-4 bg-gradient-to-b from-[#08080a] via-[#121018] to-[#08080a] border-y border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="font-orbitron text-xs text-amber-400 tracking-[0.3em] uppercase block mb-3">ARCHITECTURAL MATRIX</span>
            <h2 className="font-orbitron text-3xl md:text-5xl font-black tracking-wider text-white">
              INTERACTIVE <span className="text-amber-400">HOTSPOTS</span>
            </h2>
          </div>

          {/* 3D Card */}
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative rounded-3xl overflow-hidden border border-amber-500/30 shadow-2xl shadow-amber-500/10 bg-[#0e0c14] transition-transform duration-200 ease-out mb-12"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="relative h-[380px] md:h-[550px] overflow-hidden">
              <img src="/images/categories/real-estate.jpg" alt="AURA Penthouse Screen" className="w-full h-full object-cover transition-all duration-700 hover:scale-105" />
              <div className={`absolute inset-0 bg-gradient-to-t ${lightingMode.bg} opacity-60 transition-colors duration-700`} />

              {/* Hotspots */}
              {HOTSPOTS.map((h) => (
                <div key={h.id} className="absolute z-20" style={{ left: h.x, top: h.y }}>
                  <button
                    onClick={() => setSelectedHotspot(selectedHotspot?.id === h.id ? null : h)}
                    className="w-8 h-8 rounded-full bg-amber-500/80 text-black font-orbitron font-bold text-xs flex items-center justify-center border-2 border-white shadow-lg hover:scale-125 transition-transform"
                  >
                    {h.id}
                  </button>
                  {selectedHotspot?.id === h.id && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="absolute left-10 top-0 w-64 p-4 rounded-xl bg-black/90 backdrop-blur-md border border-amber-500/40 text-xs shadow-2xl z-30"
                    >
                      <h4 className="font-orbitron font-bold text-amber-400 mb-1">{h.title}</h4>
                      <p className="text-white/70 leading-relaxed">{h.desc}</p>
                    </motion.div>
                  )}
                </div>
              ))}

              <div className="absolute bottom-6 left-6 right-6 flex flex-wrap justify-between items-end gap-4">
                <div>
                  <h3 className="font-orbitron text-2xl md:text-4xl font-black text-white mb-2">AURA HORIZON PENTHOUSE</h3>
                  <p className="font-inter text-xs text-amber-100/70 max-w-md hidden sm:block">
                    Click numbered pins to inspect structural features in detail.
                  </p>
                </div>
                <div className="flex gap-2 bg-black/70 backdrop-blur-md p-1.5 rounded-xl border border-amber-500/30">
                  {LIGHTING_MODES.map((mode) => (
                    <button key={mode.id} onClick={() => setLightingMode(mode)}
                      className={`px-3 py-1.5 rounded-lg font-orbitron text-[10px] font-bold tracking-wider transition ${
                        lightingMode.id === mode.id ? 'bg-amber-400 text-black shadow-lg' : 'text-white/50 hover:text-white'
                      }`}
                    >
                      {mode.id}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 9: MORTGAGE CALCULATOR (existing)
          ═══════════════════════════════════════════ */}
      <section className="estate-reveal py-24 px-4 max-w-5xl mx-auto">
        <div className="p-8 border border-amber-500/20 bg-amber-950/20 rounded-2xl">
          <h3 className="font-orbitron text-xl font-bold text-amber-400 mb-2">FINANCIAL INVESTMENT ESTIMATOR</h3>
          <p className="text-white/50 text-xs mb-8">Calculate custom commission mortgage terms for AURA Horizon</p>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex justify-between text-xs font-orbitron mb-2 text-white/70">
                <span>LIST PRICE</span><span className="text-amber-400">${(price / 1000000).toFixed(2)}M</span>
              </div>
              <input type="range" min="5000000" max="30000000" step="500000" value={price} onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full accent-amber-400 bg-amber-950/60 rounded-lg cursor-pointer" />
            </div>
            <div>
              <div className="flex justify-between text-xs font-orbitron mb-2 text-white/70">
                <span>DOWN PAYMENT</span><span className="text-amber-400">{downPercent}% (${((price * downPercent) / 100 / 1000000).toFixed(2)}M)</span>
              </div>
              <input type="range" min="10" max="50" step="5" value={downPercent} onChange={(e) => setDownPercent(Number(e.target.value))}
                className="w-full accent-amber-400 bg-amber-950/60 rounded-lg cursor-pointer" />
            </div>
            <div>
              <div className="flex justify-between text-xs font-orbitron mb-2 text-white/70">
                <span>INTEREST RATE</span><span className="text-amber-400">{interestRate}%</span>
              </div>
              <input type="range" min="3.0" max="8.0" step="0.25" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full accent-amber-400 bg-amber-950/60 rounded-lg cursor-pointer" />
            </div>
          </div>

          <div className="p-6 rounded-xl bg-black/60 border border-amber-500/30 flex flex-wrap justify-between items-center gap-4">
            <div>
              <span className="font-orbitron text-xs text-white/40 block mb-1">ESTIMATED MONTHLY MORTGAGE (30-YR FIXED)</span>
              <div className="font-orbitron text-4xl font-black text-amber-400">${monthlyPayment.toLocaleString()}<span className="text-xs text-white/40 font-normal"> /mo</span></div>
            </div>
            <button className="px-8 py-4 bg-amber-500 text-black font-orbitron font-bold text-xs tracking-widest rounded-xl hover:bg-amber-400 transition cursor-none" data-cursor-label="INQUIRE">
              SCHEDULE PRIVATE VIEWING
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 10: LARGE CTA FOOTER
          ═══════════════════════════════════════════ */}
      <section className="py-40 px-6 text-center bg-gradient-to-t from-black to-[#08080a] border-t border-amber-500/10">
        <span className="font-orbitron text-xs tracking-[0.4em] text-amber-400/30 block mb-8">INQUIRE FOR PRIVATE ACQUISITION</span>
        <h2 className="font-orbitron text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-6 text-white">
          CLAIM YOUR <span className="text-amber-400">SANCTUARY</span>
        </h2>
        <p className="text-white/40 text-base md:text-lg mb-12 max-w-lg mx-auto leading-relaxed">
          Private confidential tours available exclusively for accredited collectors and principals.
        </p>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 60px rgba(245,158,11,0.4)' }}
          whileTap={{ scale: 0.95 }}
          className="px-14 py-6 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-orbitron text-sm tracking-widest font-bold transition duration-300 cursor-none rounded-full"
          data-cursor-label="ACQUIRE"
        >
          CONTACT ADVISORY AGENT
        </motion.button>

        <div className="mt-24 flex flex-wrap justify-center gap-12 text-white/20 font-orbitron text-[10px] tracking-[0.3em]">
          <span>AURA RESIDENCES © 2026</span>
          <span>DISCLOSURES</span>
          <span>PRIVACY MATRIX</span>
        </div>
      </section>
    </div>
  );
};

export default RealEstatePage;
