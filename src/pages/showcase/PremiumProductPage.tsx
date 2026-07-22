import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TextReveal from '../../components/showcase/TextReveal';
import CharReveal from '../../components/showcase/CharReveal';
import ParallaxImage from '../../components/showcase/ParallaxImage';
import HorizontalScrollPin from '../../components/showcase/HorizontalScrollPin';
import StaggerGrid from '../../components/showcase/StaggerGrid';
import MarqueeText from '../../components/showcase/MarqueeText';

gsap.registerPlugin(ScrollTrigger);

const PRODUCT_FINISHES = [
  { id: 'obsidian', name: 'Obsidian Matte', filter: 'brightness(0.9) contrast(1.2)', accent: '#ffffff' },
  { id: 'titanium', name: 'Space Titanium', filter: 'brightness(1.1) contrast(1.05)', accent: '#94a3b8' },
  { id: 'emerald', name: 'Emerald Dusk', filter: 'hue-rotate(90deg) brightness(1.05)', accent: '#10b981' },
  { id: 'starlight', name: 'Cyber Starlight', filter: 'brightness(1.3) hue-rotate(180deg)', accent: '#06b6d4' },
];

const LAYERS = [
  { name: 'Grade-5 Titanium Shell', desc: 'CNC milled from a solid billet of aerospace-grade titanium alloy with zero visible seam lines.' },
  { name: 'Planar Magnetic Driver', desc: 'Ultra-thin 2-micron beryllium diaphragm delivering 5Hz–50kHz acoustic frequency response.' },
  { name: 'Neural Spatial DSP', desc: 'Quad-core dedicated audio processor computing 3D head-tracked binaural soundstage at 96kHz/24-bit.' },
  { name: 'Anodized Haptic Dial', desc: 'Tactile volume control wheel with custom electromagnetic resistance levels.' },
];

const CRAFTSMANSHIP = [
  {
    title: 'AEROSPACE TITANIUM',
    subtitle: 'Material Engineering',
    description: 'Precision CNC-milled chassis crafted from Grade 5 titanium. Light as carbon, indestructible as steel, with hand-finished micro-brushed texture.',
    gradient: 'from-slate-900 via-stone-950 to-black',
    icon: '💎',
    badge: '0.01MM TOLERANCE',
  },
  {
    title: 'BERYLLIUM DRIVERS',
    subtitle: 'Acoustic Transducer',
    description: 'Custom 50mm planar magnetic transducers utilizing pure Beryllium foil for near-zero harmonic distortion across the ultra-wide audio spectrum.',
    gradient: 'from-neutral-900 via-stone-950 to-black',
    icon: '🔊',
    badge: '5Hz – 50kHz',
  },
  {
    title: 'SPATIAL BRAIN CORE',
    subtitle: 'Neural Soundstage',
    description: 'Proprietary spatial audio engine recalculates acoustic reflection vectors 1,000 times per second to project pin-point soundstage positioning.',
    gradient: 'from-[#12121e] via-[#090912] to-black',
    icon: '⚡',
    badge: '96kHz / 24-BIT',
  },
  {
    title: 'LAMBSKIN EARPADS',
    subtitle: 'Ergonomic Luxury',
    description: 'Perforated Tuscan lambskin ear cushions filled with high-density cooling memory foam for zero-fatigue 12-hour listening sessions.',
    gradient: 'from-amber-950 via-stone-950 to-black',
    icon: '🎧',
    badge: 'ZERO FATIGUE',
  },
  {
    title: 'CUSTOM DAC CIRCUIT',
    subtitle: 'Analog Purity',
    description: 'Dual ESS Sabre DAC architecture with independent channel isolation, delivering 132dB dynamic range and sub-0.0001% THD+N.',
    gradient: 'from-blue-950 via-stone-950 to-black',
    icon: '🎛️',
    badge: '132dB DYNAMIC',
  },
];

const PRODUCT_SPECS = [
  { label: 'FREQUENCY RESPONSE', value: '5Hz–50k', unit: 'HZ' },
  { label: 'THD + NOISE', value: '0.0001', unit: '%' },
  { label: 'BATTERY DURATION', value: '45', unit: 'HOURS' },
  { label: 'CHARGING SPEED', value: '15', unit: 'MIN (10HRS)' },
  { label: 'BLUETOOTH CODEC', value: 'LDAC', unit: '990kbps' },
  { label: 'WEIGHT', value: '310', unit: 'GRAMS' },
];

const CRAFT_STEPS = [
  { step: '01', title: 'BILLET MACHINING', desc: '5-axis CNC milling from solid aerospace titanium blocks over a 6-hour precision cycle.' },
  { step: '02', title: 'HAND FINISHING', desc: 'Master artisans hand-satin each ear-cup shell to achieve the signature micro-textured sheen.' },
  { step: '03', title: 'ACOUSTIC TUNING', desc: 'Individual driver matching within 0.1dB tolerance in an anechoic chamber.' },
  { step: '04', title: 'FINAL COMMISSION', desc: 'Custom laser engraving of serial number and personal commission certificate.' },
];

const PremiumProductPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const soundCanvasRef = useRef<HTMLCanvasElement>(null);

  const { scrollYProgress } = useScroll();
  const rotateY = useTransform(scrollYProgress, [0, 0.4], [0, 360]);

  const [selectedFinish, setSelectedFinish] = useState(PRODUCT_FINISHES[0]);
  const [activeLayer, setActiveLayer] = useState(0);

  // Sound field canvas visualizer
  useEffect(() => {
    const canvas = soundCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.05;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      for (let r = 20; r < 140; r += 20) {
        ctx.beginPath();
        const radius = r + Math.sin(time + r * 0.1) * 6;
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.4 * (1 - r / 140)})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  useEffect(() => {
    gsap.utils.toArray('.product-reveal').forEach((section) => {
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
    <div ref={containerRef} className="min-h-screen bg-[#070709] text-white overflow-x-hidden select-none font-inter">

      {/* ═══════════════════════════════════════════
          SECTION 1: FULL-BLEED PARALLAX HERO
          ═══════════════════════════════════════════ */}
      <ParallaxImage
        src="/images/categories/premium-product.jpg"
        alt="APEX ONE Reference Headphones"
        height="100vh"
        parallaxAmount={150}
        initialScale={1.2}
        overlayColor="rgba(7,7,9,0.5)"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/20 bg-white/5 text-white/80 text-xs font-orbitron tracking-[0.3em] mb-10 backdrop-blur-sm"
        >
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          REFERENCE ACOUSTICS
        </motion.div>

        <TextReveal
          text="APEX"
          as="h1"
          className="font-orbitron text-7xl md:text-[10rem] lg:text-[14rem] font-black leading-none tracking-tighter text-white"
          stagger={0.1}
        />
        <TextReveal
          text="ONE EDITION"
          as="h2"
          className="font-orbitron text-3xl md:text-5xl lg:text-7xl font-light leading-none tracking-[0.3em] text-white/50 mt-2"
          stagger={0.12}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="text-white/40 text-sm md:text-base max-w-md mx-auto mt-8 text-center tracking-wider font-light"
        >
          Acoustic perfection milled from aerospace titanium. Hear sound in its purest form.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 flex flex-col items-center gap-3"
        >
          <span className="font-orbitron text-[9px] tracking-[0.4em] text-white/30">SCROLL TO DISCOVER</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="w-px h-16 bg-gradient-to-b from-white/40 to-transparent"
          />
        </motion.div>
      </ParallaxImage>

      {/* ═══════════════════════════════════════════
          SECTION 2: PHILOSOPHY — CHAR REVEAL
          ═══════════════════════════════════════════ */}
      <section className="relative py-32 md:py-48 px-6 md:px-12 lg:px-24 bg-[#070709]">
        <div className="max-w-5xl mx-auto">
          <span className="font-orbitron text-xs tracking-[0.4em] text-white/30 block mb-12">ACOUSTIC PURITY</span>
          <CharReveal
            text="Sound is not just frequency — it is texture, space, and emotion. We designed APEX ONE with zero acoustic compromise. Stripping away unnecessary components to leave only raw metallic elegance and pristine planar soundstage."
            className="text-3xl md:text-5xl lg:text-6xl font-light leading-tight tracking-tight text-white"
            start="top 80%"
            end="bottom 30%"
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 3: MARQUEE BAND
          ═══════════════════════════════════════════ */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <MarqueeText
          items={['PRECISION', 'TITANIUM', 'ACOUSTICS', 'PLANAR', 'CRAFTSMANSHIP', 'FIDELITY']}
          speed={22}
          separator="✧"
          className="text-white/15"
        />
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 4: HORIZONTAL SCROLL — CRAFTSMANSHIP
          ═══════════════════════════════════════════ */}
      <section className="bg-[#070709]">
        <div className="py-20 px-6 md:px-12">
          <div className="flex items-baseline justify-between mb-4 max-w-7xl mx-auto">
            <div>
              <span className="font-orbitron text-xs tracking-[0.4em] text-white/30 block mb-3">ENGINEERING HIGHLIGHTS</span>
              <h2 className="font-orbitron text-4xl md:text-6xl font-black tracking-tight">
                FRESH <span className="font-light italic text-white/60">Craftsmanship</span>
              </h2>
            </div>
            <span className="hidden md:block font-orbitron text-xs tracking-widest text-white/20">SCROLL →</span>
          </div>
        </div>

        <HorizontalScrollPin className="bg-[#070709]" scrollMultiplier={4}>
          {CRAFTSMANSHIP.map((item, i) => (
            <div
              key={i}
              className={`flex-shrink-0 w-[85vw] md:w-[45vw] h-[75vh] rounded-3xl overflow-hidden border border-white/15 bg-gradient-to-br ${item.gradient} p-10 md:p-14 flex flex-col justify-between group hover:border-white/30 transition-colors duration-500`}
            >
              <div>
                <div className="flex justify-between items-start">
                  <span className="font-orbitron text-xs tracking-[0.3em] text-white/40 block mb-2">{item.subtitle}</span>
                  <span className="font-orbitron text-xs font-bold text-white/80 bg-white/10 px-4 py-1.5 rounded-full border border-white/20">
                    {item.badge}
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
        src="/images/categories/premium-product.jpg"
        alt="Apex One Studio Macro Details"
        height="70vh"
        parallaxAmount={80}
        initialScale={1.1}
        overlayColor="rgba(7,7,9,0.4)"
        className="border-y border-white/10"
      >
        <div className="text-center">
          <span className="font-orbitron text-xs tracking-[0.4em] text-white/50 block mb-4">PURE ANALOG FIDELITY</span>
          <h2 className="font-orbitron text-5xl md:text-8xl font-black tracking-tighter text-white">
            AUDIO <span className="text-white/70">REDEFINED</span>
          </h2>
        </div>
      </ParallaxImage>

      {/* ═══════════════════════════════════════════
          SECTION 6: STAGGERED PRODUCT SPECS
          ═══════════════════════════════════════════ */}
      <section className="py-32 px-6 md:px-12 bg-[#070709]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="font-orbitron text-xs tracking-[0.4em] text-white/30 block mb-3">TECHNICAL BENCHMARKS</span>
            <h2 className="font-orbitron text-4xl md:text-6xl font-black tracking-tight text-white">
              APEX <span className="text-white/70">SPECS</span>
            </h2>
          </div>

          <StaggerGrid columns="grid-cols-2 md:grid-cols-3" gap="gap-6" stagger={0.1}>
            {PRODUCT_SPECS.map((spec) => (
              <div key={spec.label} className="p-8 md:p-10 border border-white/10 bg-white/[0.02] rounded-2xl text-center group hover:border-white/25 transition-all duration-500">
                <span className="font-orbitron text-[10px] tracking-[0.3em] text-white/30 block mb-4">{spec.label}</span>
                <div className="font-orbitron text-4xl md:text-5xl font-black text-white mb-1">{spec.value}</div>
                <span className="font-orbitron text-xs tracking-widest text-white/50">{spec.unit}</span>
              </div>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 7: STAGGERED CRAFT PROCESS
          ═══════════════════════════════════════════ */}
      <section className="py-32 px-6 md:px-12 bg-[#040406] border-y border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <span className="font-orbitron text-xs tracking-[0.4em] text-white/30 block mb-3">MANUFACTURING PROCESS</span>
            <h2 className="font-orbitron text-4xl md:text-6xl font-black tracking-tight text-white">
              HAND-CRAFTED <span className="font-light italic text-white/60">Precision</span>
            </h2>
          </div>

          <StaggerGrid columns="grid-cols-1 md:grid-cols-2 lg:grid-cols-4" gap="gap-6" stagger={0.12}>
            {CRAFT_STEPS.map((s) => (
              <div key={s.step} className="p-8 border border-white/10 bg-white/[0.02] rounded-2xl group hover:border-white/30 transition-all duration-500">
                <span className="font-orbitron text-5xl font-black block mb-6 text-white/20 group-hover:text-white transition-colors">
                  {s.step}
                </span>
                <h3 className="font-orbitron text-sm tracking-widest font-bold mb-3 text-white">{s.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 8: 3D CARD & EXPLODED ASSEMBLY (existing)
          ═══════════════════════════════════════════ */}
      <section className="product-reveal py-24 px-4 bg-gradient-to-b from-[#070709] via-[#0e0e14] to-[#070709] border-y border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="font-orbitron text-xs text-white/40 tracking-[0.3em] uppercase block mb-3">PHYSICAL MATRIX</span>
            <h2 className="font-orbitron text-3xl md:text-5xl font-black tracking-wider text-white">
              3D FINISH <span className="text-white/60">& ASSEMBLY</span>
            </h2>
          </div>

          {/* 3D Card */}
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-gradient-to-b from-[#111] to-[#040406] transition-transform duration-200 ease-out mb-12"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="relative h-[380px] md:h-[520px] overflow-hidden flex items-center justify-center">
              <motion.img
                src="/images/categories/premium-product.jpg"
                alt="APEX ONE Product Finish Screen"
                className="w-full h-full object-cover transition-all duration-700"
                style={{ filter: selectedFinish.filter, rotateY }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

              <div className="absolute top-6 left-6 flex items-center gap-3 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full border border-white/15">
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                <span className="font-orbitron text-xs tracking-widest text-white/80">FINISH: {selectedFinish.name.toUpperCase()}</span>
              </div>

              {/* Finishes */}
              <div className="absolute bottom-6 left-6 right-6 flex flex-wrap justify-between items-end gap-4">
                <div>
                  <h3 className="font-orbitron text-2xl md:text-4xl font-black text-white mb-2">APEX ONE REFERENCE</h3>
                  <p className="font-inter text-xs text-white/60 max-w-md hidden sm:block">
                    Grade-5 Titanium chassis milled to 0.01mm tolerances. Select custom metallic finishes.
                  </p>
                </div>
                <div className="flex gap-2 bg-black/70 backdrop-blur-md p-2 rounded-2xl border border-white/10">
                  {PRODUCT_FINISHES.map((f) => (
                    <button key={f.id} onClick={() => setSelectedFinish(f)}
                      className={`w-8 h-8 rounded-full border flex items-center justify-center transition cursor-none ${
                        selectedFinish.id === f.id ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: f.accent }}
                      title={f.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Exploded View Layer Switcher */}
          <div className="p-8 border border-white/10 bg-white/[0.02] rounded-2xl">
            <h3 className="font-orbitron text-xl font-bold text-white mb-6">EXPLODED LAYER ARCHITECTURE</h3>
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              {LAYERS.map((layer, idx) => (
                <button key={layer.name} onClick={() => setActiveLayer(idx)}
                  className={`p-4 rounded-xl border text-left font-orbitron text-xs transition ${
                    activeLayer === idx ? 'border-white bg-white/10 text-white font-bold' : 'border-white/10 bg-white/5 text-white/40 hover:text-white'
                  }`}
                >
                  <span className="block text-[10px] opacity-40 mb-1">0{idx + 1} LAYER</span>
                  {layer.name}
                </button>
              ))}
            </div>
            <div className="p-6 rounded-xl bg-black/80 border border-white/10 font-mono text-xs text-white/70">
              <span className="text-white font-bold block mb-1">SELECTED: {LAYERS[activeLayer].name.toUpperCase()}</span>
              {LAYERS[activeLayer].desc}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 9: ACOUSTIC SOUNDWAVE VISUALIZER (existing)
          ═══════════════════════════════════════════ */}
      <section className="product-reveal py-24 px-4 max-w-5xl mx-auto text-center">
        <h2 className="font-orbitron text-3xl md:text-5xl font-bold mb-4">NEURAL SPATIAL SOUND FIELD</h2>
        <p className="font-inter text-xs text-white/40 mb-12">Simulated 360-degree head-tracked binaural wave distribution</p>
        <div className="p-8 rounded-2xl border border-white/10 bg-black/60 flex flex-col items-center">
          <canvas ref={soundCanvasRef} width={300} height={300} className="w-64 h-64 my-4" />
          <span className="font-orbitron text-xs text-white/40 tracking-widest mt-4">96kHz / 24-BIT LOSSLESS STREAM</span>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 10: LARGE CTA FOOTER
          ═══════════════════════════════════════════ */}
      <section className="py-40 px-6 text-center bg-gradient-to-t from-black to-[#070709] border-t border-white/10">
        <span className="font-orbitron text-xs tracking-[0.4em] text-white/30 block mb-8">LIMITED PRODUCTION BATCH</span>
        <h2 className="font-orbitron text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-6 text-white">
          OWN THE <span className="text-white/60">APEX</span>
        </h2>
        <p className="text-white/40 text-base md:text-lg mb-12 max-w-lg mx-auto leading-relaxed">
          Each APEX ONE is individually numbered and accompanied by an aluminum flight case and certificate of authenticity.
        </p>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 60px rgba(255,255,255,0.3)' }}
          whileTap={{ scale: 0.95 }}
          className="px-14 py-6 bg-white text-black font-orbitron text-sm tracking-widest font-bold transition duration-300 cursor-none rounded-full"
          data-cursor-label="ORDER APEX"
        >
          ORDER APEX ONE ($2,450)
        </motion.button>

        <div className="mt-24 flex flex-wrap justify-center gap-12 text-white/20 font-orbitron text-[10px] tracking-[0.3em]">
          <span>APEX ACOUSTICS © 2026</span>
          <span>WARRANTY & REPAIR</span>
          <span>AUTHENTICITY VERIFIER</span>
        </div>
      </section>
    </div>
  );
};

export default PremiumProductPage;
