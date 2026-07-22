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

const TIME_MODES = [
  { id: 'DAWN', label: 'Golden Dawn', bg: 'from-[#0d2818] via-[#091e12] to-[#041108]', accent: '#34d399', text: 'Sunrise Spectrum' },
  { id: 'NOON', label: 'Solar Zenith', bg: 'from-[#061406] via-[#092209] to-[#061406]', accent: '#10b981', text: 'Full Photo-Synthesis' },
  { id: 'DUSK', label: 'Bioluminescent Dusk', bg: 'from-[#021812] via-[#010f0d] to-[#010a08]', accent: '#06b6d4', text: 'Night Flora Glow' },
];

const BIOMES = [
  {
    title: 'OLD-GROWTH CANOPY',
    subtitle: 'Pacific Rainforest',
    description: 'Sequoiadendron sanctuary buffering 45,000 tons of sequestered carbon annually. Multi-layered canopy supporting 1,400 micro-fauna species.',
    gradient: 'from-emerald-950 via-teal-950 to-black',
    icon: '🌲',
    stats: '45K TONS CO₂',
  },
  {
    title: 'CORAL MATRIX REEF',
    subtitle: 'Indo-Pacific Arch',
    description: 'Bioluminescent coral sanctuary with autonomous pH stabilization arrays. 94% living coral coverage protecting 320 miles of coastal shelf.',
    gradient: 'from-cyan-950 via-blue-950 to-black',
    icon: '🪸',
    stats: '94% RECOVERED',
  },
  {
    title: 'ALPINE MEADOW',
    subtitle: 'Patagonian Plateau',
    description: 'High-altitude endemic flora preserve powered by glacial meltwater monitoring. Zero pesticide ecosystem with natural pollinator corridors.',
    gradient: 'from-lime-950 via-emerald-950 to-black',
    icon: '🌸',
    stats: '1,200 SPECIES',
  },
  {
    title: 'BIOPHISIC MANGROVE',
    subtitle: 'Sundarbans Reserve',
    description: 'Intertidal root networks engineering natural storm surges. Absorbs 4x more carbon per hectare than terrestrial tropical rainforests.',
    gradient: 'from-teal-950 via-slate-950 to-black',
    icon: '🌿',
    stats: '4x CARBON DENSITY',
  },
  {
    title: 'SAVANNA CORRIDOR',
    subtitle: 'Serengeti Shield',
    description: 'Wildlife migration sanctuary monitored by thermal acoustic AI arrays. Zero-fencing wilderness preservation model spanning 12,000 km².',
    gradient: 'from-amber-950 via-emerald-950 to-black',
    icon: '🦏',
    stats: '12,000 KM² PROTECTED',
  },
];

const ECO_STATS = [
  { label: 'CARBON SEQUESTERED', value: '84.2', unit: 'K TONS' },
  { label: 'BIODIVERSITY INDEX', value: '98.4', unit: '/ 100' },
  { label: 'RENEWABLE YIELD', value: '100', unit: '%' },
  { label: 'SPECIES PROTECTED', value: '4,890', unit: '+' },
  { label: 'WATER PURIFIED', value: '12.4', unit: 'M L/DAY' },
  { label: 'ECO-ZONES RESTORED', value: '142', unit: 'REGIONS' },
];

const RESTORATION_STEPS = [
  { step: '01', title: 'SOIL REVITALIZATION', desc: 'Mycelial inoculation to rebuild subterranean nutrient networks and fungal transport lines.' },
  { step: '02', title: 'CANOPY RE-SEEDING', desc: 'Drone-assisted precision planting of climate-resilient endemic flora seeds across degraded areas.' },
  { step: '03', title: 'HYDROLOGIC TETHER', desc: 'Restoration of natural wetlands and rainwater catchment basins for continuous sub-surface hydration.' },
  { step: '04', title: 'BIODIVERSITY GUARDIAN', desc: 'AI acoustic monitoring detecting species re-population and territorial expansion in real time.' },
];

const NaturePage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [timeMode, setTimeMode] = useState(TIME_MODES[1]);

  const [temp, setTemp] = useState(22);
  const [co2Offset, setCo2Offset] = useState(84);
  const [solarYield, setSolarYield] = useState(96);

  // Water ripple effect on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = 180;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.02;

      for (let x = 0; x < canvas.width; x += 6) {
        const y1 = Math.sin(x * 0.01 + time) * 10 + 40;
        const y2 = Math.sin(x * 0.015 + time * 1.2) * 7 + 70;
        const y3 = Math.sin(x * 0.008 + time * 0.8) * 12 + 100;

        ctx.fillStyle = `rgba(16, 185, 129, ${0.12 + Math.sin(x * 0.005 + time) * 0.05})`;
        ctx.fillRect(x, y1, 5, 3);
        ctx.fillStyle = `rgba(52, 211, 153, ${0.1 + Math.sin(x * 0.007 + time) * 0.04})`;
        ctx.fillRect(x, y2, 5, 3);
        ctx.fillStyle = `rgba(110, 231, 183, ${0.07 + Math.sin(x * 0.009 + time) * 0.03})`;
        ctx.fillRect(x, y3, 5, 3);
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Card Mouse Tilt
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
    <div className="min-h-screen bg-[#041009] text-white overflow-x-hidden select-none font-inter">

      {/* ═══════════════════════════════════════════
          SECTION 1: FULL-BLEED PARALLAX HERO
          ═══════════════════════════════════════════ */}
      <ParallaxImage
        src="/images/categories/nature.jpg"
        alt="Earth Sanctuary Eco Sanctuary"
        height="100vh"
        parallaxAmount={160}
        initialScale={1.2}
        overlayColor="rgba(4,16,9,0.5)"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-orbitron tracking-[0.3em] mb-10 shadow-lg shadow-emerald-500/10"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          ECO-RESTORATION PROTOCOL v3
        </motion.div>

        <TextReveal
          text="BIOSPHERE"
          as="h1"
          className="font-orbitron text-7xl md:text-[10rem] lg:text-[13rem] font-black leading-none tracking-tighter bg-gradient-to-r from-emerald-300 via-teal-200 to-green-400 bg-clip-text text-transparent"
          stagger={0.1}
        />
        <TextReveal
          text="SANCTUARY"
          as="h2"
          className="font-orbitron text-3xl md:text-5xl lg:text-7xl font-light leading-none tracking-[0.3em] text-emerald-200/70 mt-2"
          stagger={0.12}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="text-emerald-100/40 text-sm md:text-base max-w-md mx-auto mt-8 text-center tracking-wider font-light"
        >
          Harmonizing technology with ancient biomes to safeguard biodiversity for future generations.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 flex flex-col items-center gap-3"
        >
          <span className="font-orbitron text-[9px] tracking-[0.4em] text-emerald-400/40">SCROLL TO DISCOVER</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="w-px h-16 bg-gradient-to-b from-emerald-400/40 to-transparent"
          />
        </motion.div>
      </ParallaxImage>

      {/* ═══════════════════════════════════════════
          SECTION 2: PHILOSOPHY — CHAR REVEAL
          ═══════════════════════════════════════════ */}
      <section className="relative py-32 md:py-48 px-6 md:px-12 lg:px-24 bg-[#041009]">
        <div className="max-w-5xl mx-auto">
          <span className="font-orbitron text-xs tracking-[0.4em] text-emerald-400/50 block mb-12">THE MANIFESTO</span>
          <CharReveal
            text="Nature does not negotiate with human momentum. For centuries we took without listening. Now, using non-invasive bio-sensors, ecological AI models, and habitat restoration algorithms, we are giving Earth a voice to heal itself. Every tree planted is an act of defiance against degradation."
            className="text-3xl md:text-5xl lg:text-6xl font-light leading-tight tracking-tight text-white"
            start="top 80%"
            end="bottom 30%"
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 3: MARQUEE BAND
          ═══════════════════════════════════════════ */}
      <section className="border-y border-emerald-500/10 bg-emerald-500/[0.02]">
        <MarqueeText
          items={['SUSTAINABILITY', 'BIODIVERSITY', 'CONSERVATION', 'CANOPY', 'REFORESTATION', 'BIOLUMINESCENCE']}
          speed={22}
          separator="🌱"
          className="text-emerald-400/15"
        />
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 4: HORIZONTAL SCROLL — BIOMES
          ═══════════════════════════════════════════ */}
      <section className="bg-[#041009]">
        <div className="py-20 px-6 md:px-12">
          <div className="flex items-baseline justify-between mb-4 max-w-7xl mx-auto">
            <div>
              <span className="font-orbitron text-xs tracking-[0.4em] text-emerald-400/50 block mb-3">PROTECTED ECOSYSTEMS</span>
              <h2 className="font-orbitron text-4xl md:text-6xl font-black tracking-tight">
                FRESH <span className="font-light italic text-emerald-300/70">Biomes</span>
              </h2>
            </div>
            <span className="hidden md:block font-orbitron text-xs tracking-widest text-white/20">SCROLL →</span>
          </div>
        </div>

        <HorizontalScrollPin className="bg-[#041009]" scrollMultiplier={4}>
          {BIOMES.map((item, i) => (
            <div
              key={i}
              className={`flex-shrink-0 w-[85vw] md:w-[45vw] h-[75vh] rounded-3xl overflow-hidden border border-emerald-500/20 bg-gradient-to-br ${item.gradient} p-10 md:p-14 flex flex-col justify-between group hover:border-emerald-400/40 transition-colors duration-500`}
            >
              <div>
                <div className="flex justify-between items-start">
                  <span className="font-orbitron text-xs tracking-[0.3em] text-emerald-400/60 block mb-2">{item.subtitle}</span>
                  <span className="font-orbitron text-[10px] px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {item.stats}
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
        src="/images/categories/nature.jpg"
        alt="Wilderness Sanctuary Panorama"
        height="70vh"
        parallaxAmount={80}
        initialScale={1.1}
        overlayColor="rgba(4,16,9,0.4)"
        className="border-y border-emerald-500/10"
      >
        <div className="text-center">
          <span className="font-orbitron text-xs tracking-[0.4em] text-emerald-400/50 block mb-4">RESTORATION IMPERATIVE</span>
          <h2 className="font-orbitron text-5xl md:text-8xl font-black tracking-tighter text-white">
            REBUILD THE <span className="text-emerald-400">WILD</span>
          </h2>
        </div>
      </ParallaxImage>

      {/* ═══════════════════════════════════════════
          SECTION 6: STAGGERED ECO-STATS GRID
          ═══════════════════════════════════════════ */}
      <section className="py-32 px-6 md:px-12 bg-[#041009]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="font-orbitron text-xs tracking-[0.4em] text-emerald-400/50 block mb-3">ECOLOGICAL IMPACT</span>
            <h2 className="font-orbitron text-4xl md:text-6xl font-black tracking-tight text-white">
              MEASURED <span className="text-emerald-400">RESULTS</span>
            </h2>
          </div>

          <StaggerGrid columns="grid-cols-2 md:grid-cols-3" gap="gap-6" stagger={0.1}>
            {ECO_STATS.map((stat) => (
              <div key={stat.label} className="p-8 md:p-10 border border-emerald-500/15 bg-emerald-950/20 rounded-2xl text-center group hover:border-emerald-400/30 transition-all duration-500">
                <span className="font-orbitron text-[10px] tracking-[0.3em] text-emerald-300/40 block mb-4">{stat.label}</span>
                <div className="font-orbitron text-4xl md:text-5xl font-black text-white mb-1">{stat.value}</div>
                <span className="font-orbitron text-xs tracking-widest text-emerald-400">{stat.unit}</span>
              </div>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 7: RESTORATION STEPS
          ═══════════════════════════════════════════ */}
      <section className="py-32 px-6 md:px-12 bg-[#020b06] border-y border-emerald-500/10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <span className="font-orbitron text-xs tracking-[0.4em] text-emerald-400/50 block mb-3">FOUR-STAGE METHODOLOGY</span>
            <h2 className="font-orbitron text-4xl md:text-6xl font-black tracking-tight text-white">
              RESTORATION <span className="font-light italic text-emerald-300/70">Pipeline</span>
            </h2>
          </div>

          <StaggerGrid columns="grid-cols-1 md:grid-cols-2 lg:grid-cols-4" gap="gap-6" stagger={0.12}>
            {RESTORATION_STEPS.map((s) => (
              <div key={s.step} className="p-8 border border-emerald-500/15 bg-emerald-950/30 rounded-2xl group hover:border-emerald-400/40 transition-all duration-500">
                <span className="font-orbitron text-5xl font-black block mb-6 text-emerald-500/30 group-hover:text-emerald-400 transition-colors">
                  {s.step}
                </span>
                <h3 className="font-orbitron text-sm tracking-widest font-bold mb-3 text-white">{s.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 8: 3D CARD & CLIMATE SIMULATOR (existing)
          ═══════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-gradient-to-b from-[#041009] via-[#082012] to-[#041009] border-y border-emerald-500/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="font-orbitron text-xs text-emerald-400 tracking-[0.3em] uppercase block mb-3">BIOME SIMULATOR</span>
            <h2 className="font-orbitron text-3xl md:text-5xl font-black tracking-wider text-white">
              CANOPY <span className="text-emerald-400">MICRO-CLIMATE</span>
            </h2>
          </div>

          {/* 3D Card */}
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative rounded-3xl overflow-hidden border border-emerald-500/30 shadow-2xl shadow-emerald-500/10 bg-[#06180e] transition-transform duration-200 ease-out mb-12"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="relative h-[360px] md:h-[500px] overflow-hidden">
              <img src="/images/categories/nature.jpg" alt="Nature Sanctuary Screen" className="w-full h-full object-cover transition-all duration-700 hover:scale-105" />
              <div className={`absolute inset-0 bg-gradient-to-t ${timeMode.bg} opacity-70 transition-colors duration-700`} />

              <div className="absolute top-6 left-6 flex items-center gap-3 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full border border-emerald-500/30">
                <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: timeMode.accent }} />
                <span className="font-orbitron text-xs tracking-widest text-emerald-200">SPECTRUM: {timeMode.text}</span>
              </div>

              {/* Time buttons */}
              <div className="absolute bottom-6 left-6 right-6 flex flex-wrap justify-between items-end gap-4">
                <div>
                  <h3 className="font-orbitron text-2xl md:text-4xl font-black text-white mb-2">PACIFIC ECO SANCTUARY</h3>
                  <p className="font-inter text-xs text-emerald-100/70 max-w-md hidden sm:block">
                    Autonomous bio-dome running on solar micro-grids with live mycorrhizal network sensors.
                  </p>
                </div>
                <div className="flex gap-2 bg-black/70 backdrop-blur-md p-1.5 rounded-xl border border-emerald-500/30">
                  {TIME_MODES.map((mode) => (
                    <button key={mode.id} onClick={() => setTimeMode(mode)}
                      className={`px-3 py-1.5 rounded-lg font-orbitron text-[10px] font-bold tracking-wider transition ${
                        timeMode.id === mode.id ? 'bg-emerald-400 text-black shadow-lg' : 'text-white/50 hover:text-white'
                      }`}
                    >
                      {mode.id}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Sliders */}
          <div className="p-8 border border-emerald-500/20 bg-emerald-950/20 rounded-2xl">
            <h3 className="font-orbitron text-lg font-bold text-emerald-400 mb-6 tracking-wider">CLIMATE CONTROLS</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="flex justify-between text-xs font-orbitron mb-2 text-white/70">
                  <span>AMBIENT TEMP</span><span className="text-emerald-400">{temp}°C</span>
                </div>
                <input type="range" min="15" max="30" value={temp} onChange={(e) => setTemp(Number(e.target.value))}
                  className="w-full accent-emerald-400 bg-emerald-950/60 rounded-lg cursor-pointer" />
              </div>
              <div>
                <div className="flex justify-between text-xs font-orbitron mb-2 text-white/70">
                  <span>CO₂ SEQUESTERED</span><span className="text-emerald-400">{co2Offset} T/DAY</span>
                </div>
                <input type="range" min="40" max="150" value={co2Offset} onChange={(e) => setCo2Offset(Number(e.target.value))}
                  className="w-full accent-emerald-400 bg-emerald-950/60 rounded-lg cursor-pointer" />
              </div>
              <div>
                <div className="flex justify-between text-xs font-orbitron mb-2 text-white/70">
                  <span>SOLAR YIELD</span><span className="text-emerald-400">{solarYield}%</span>
                </div>
                <input type="range" min="50" max="100" value={solarYield} onChange={(e) => setSolarYield(Number(e.target.value))}
                  className="w-full accent-emerald-400 bg-emerald-950/60 rounded-lg cursor-pointer" />
              </div>
            </div>
            {/* Water Canvas */}
            <div className="mt-8 rounded-xl border border-emerald-500/20 overflow-hidden relative">
              <canvas ref={canvasRef} className="w-full h-[180px]" />
              <div className="absolute top-3 left-4 font-orbitron text-[10px] text-emerald-400/60 tracking-widest">SUB-SURFACE HYDRO-SPECTRUM</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 9: LARGE CTA FOOTER
          ═══════════════════════════════════════════ */}
      <section className="py-40 px-6 text-center bg-gradient-to-t from-[#010a05] to-[#041009] border-t border-emerald-500/10">
        <span className="font-orbitron text-xs tracking-[0.4em] text-emerald-400/30 block mb-8">PROTECT EARTH'S LEGACY</span>
        <h2 className="font-orbitron text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-6 text-white">
          JOIN THE <span className="text-emerald-400">SANCTUARY</span>
        </h2>
        <p className="text-white/40 text-base md:text-lg mb-12 max-w-lg mx-auto leading-relaxed">
          Partner with our conservation architects to fund and restore protected bio-zones across six continents.
        </p>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 60px rgba(16,185,129,0.4)' }}
          whileTap={{ scale: 0.95 }}
          className="px-14 py-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-orbitron text-sm tracking-widest font-bold transition duration-300 cursor-none rounded-full"
          data-cursor-label="SPONSOR BIOME"
        >
          SPONSOR A BIOME ZONE
        </motion.button>

        <div className="mt-24 flex flex-wrap justify-center gap-12 text-white/20 font-orbitron text-[10px] tracking-[0.3em]">
          <span>BIOSPHERE SANCTUARY © 2026</span>
          <span>ECO-AUDIT REPORT</span>
          <span>GLOBAL TRUST</span>
        </div>
      </section>
    </div>
  );
};

export default NaturePage;
