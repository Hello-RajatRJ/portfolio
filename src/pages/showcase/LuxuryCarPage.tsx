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

const CAR_COLORS = [
  { hex: '#d4af37', name: 'Aurum Gold', filter: 'hue-rotate(0deg)' },
  { hex: '#ef4444', name: 'Rosso Red', filter: 'hue-rotate(140deg) saturate(1.8)' },
  { hex: '#3b82f6', name: 'Cobalt Blue', filter: 'hue-rotate(220deg) saturate(1.8)' },
  { hex: '#10b981', name: 'Emerald Green', filter: 'hue-rotate(90deg) saturate(1.6)' },
  { hex: '#ffffff', name: 'Carrara White', filter: 'brightness(1.3) contrast(1.1)' },
];

const DRIVE_MODES = [
  { id: 'ECO', name: 'Range Mode', rpmLimit: 5000, maxSpeed: 130, accent: '#10b981' },
  { id: 'SPORT', name: 'Sport Dynamic', rpmLimit: 7500, maxSpeed: 180, accent: '#3b82f6' },
  { id: 'TRACK', name: 'Apex Track +', rpmLimit: 9500, maxSpeed: 230, accent: '#d4af37' },
];

const SPECS = [
  { label: 'PEAK POWER', value: '1,480', unit: 'HP' },
  { label: '0–60 MPH', value: '1.92', unit: 'SEC' },
  { label: 'TOP SPEED', value: '267', unit: 'MPH' },
  { label: 'RANGE', value: '412', unit: 'MI' },
  { label: 'TORQUE', value: '1,100', unit: 'NM' },
  { label: 'WEIGHT', value: '1,380', unit: 'KG' },
];

const GALLERY_ITEMS = [
  {
    title: 'CARBON MONOCOQUE',
    subtitle: 'Structural Integrity',
    description: 'Single-piece carbon fiber tub providing unmatched torsional rigidity at just 98kg. Track-proven lattice geometry derived from aerospace composites.',
    gradient: 'from-amber-950 via-neutral-950 to-black',
    icon: '⬡',
  },
  {
    title: 'TORQUE VECTORING',
    subtitle: 'Precision Control',
    description: 'Quad-motor independent drive with sub-millisecond torque distribution. Each wheel receives precisely calculated force for maximum grip and stability.',
    gradient: 'from-blue-950 via-neutral-950 to-black',
    icon: '◎',
  },
  {
    title: 'AERO DYNAMICS',
    subtitle: 'Ground Effect',
    description: 'Active aerodynamic elements generate 1,200kg of downforce at speed. Venturi tunnels and adaptive spoiler angle respond to real-time telemetry data.',
    gradient: 'from-emerald-950 via-neutral-950 to-black',
    icon: '△',
  },
  {
    title: 'BATTERY SYSTEM',
    subtitle: 'Energy Architecture',
    description: 'Solid-state 120kWh battery pack with 800V architecture supporting 350kW ultra-rapid charging. Temperature managed with phase-change cooling fluid.',
    gradient: 'from-purple-950 via-neutral-950 to-black',
    icon: '⚡',
  },
  {
    title: 'INTERIOR COCKPIT',
    subtitle: 'Driver Interface',
    description: 'Minimalist yoke steering with haptic feedback zones. Holographic heads-up display projects critical telemetry directly into the driver\'s line of sight.',
    gradient: 'from-rose-950 via-neutral-950 to-black',
    icon: '◇',
  },
];

const PROCESS_STEPS = [
  { num: '01', title: 'CONSULTATION', desc: 'Personal session with our design architects to define your vision and specification requirements.' },
  { num: '02', title: 'CONFIGURATION', desc: 'Bespoke selection of materials, colorways, performance mappings, and interior appointments.' },
  { num: '03', title: 'ENGINEERING', desc: 'Each component hand-assembled by a dedicated master technician over a 14-week build cycle.' },
  { num: '04', title: 'COMMISSIONING', desc: 'Track-proven validation followed by personal delivery to your chosen destination worldwide.' },
];

const LuxuryCarPage: React.FC = () => {
  const [speed, setSpeed] = useState(0);
  const [rpm, setRpm] = useState(1000);
  const [gear, setGear] = useState<'P' | 'D' | 'S' | 'R'>('P');
  const [activeAero, setActiveAero] = useState(false);
  const [selectedColor, setSelectedColor] = useState(CAR_COLORS[0]);
  const [driveMode, setDriveMode] = useState(DRIVE_MODES[2]);
  const [isAccelerating, setIsAccelerating] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const audioCanvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef1 = useRef<OscillatorNode | null>(null);
  const oscRef2 = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const pathRef = useRef<SVGPathElement>(null);

  const startEngineSound = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();
    if (oscRef1.current) return;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';
    osc1.frequency.value = 45;
    osc2.frequency.value = 45.3;
    filter.type = 'lowpass';
    filter.frequency.value = driveMode.id === 'TRACK' ? 320 : 200;
    gainNode.gain.value = 0.05;

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc1.start();
    osc2.start();

    oscRef1.current = osc1;
    oscRef2.current = osc2;
    gainNodeRef.current = gainNode;
  };

  const stopEngineSound = () => {
    if (oscRef1.current) oscRef1.current.stop();
    if (oscRef2.current) oscRef2.current.stop();
    oscRef1.current = null;
    oscRef2.current = null;
  };

  useEffect(() => {
    if (!oscRef1.current || !oscRef2.current || !gainNodeRef.current) return;
    const baseFreq = 35 + (rpm / driveMode.rpmLimit) * 140;
    oscRef1.current.frequency.setValueAtTime(baseFreq, audioCtxRef.current!.currentTime);
    oscRef2.current.frequency.setValueAtTime(baseFreq * 1.015, audioCtxRef.current!.currentTime + 0.1);
    const volume = isAccelerating ? 0.09 : 0.04;
    gainNodeRef.current.gain.linearRampToValueAtTime(volume, audioCtxRef.current!.currentTime + 0.1);
  }, [rpm, isAccelerating, driveMode]);

  useEffect(() => {
    const canvas = audioCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.08;
      const bars = 28;
      const barWidth = (canvas.width - bars * 3) / bars;

      for (let i = 0; i < bars; i++) {
        const factor = isAccelerating ? Math.sin(time + i * 0.3) * 0.8 + 0.9 : Math.sin(time + i * 0.2) * 0.2 + 0.3;
        const barHeight = Math.min(canvas.height * 0.8, (rpm / driveMode.rpmLimit) * canvas.height * 0.8 * factor);
        const x = i * (barWidth + 3);
        const y = canvas.height - barHeight;
        ctx.fillStyle = selectedColor.hex;
        ctx.shadowColor = selectedColor.hex;
        ctx.shadowBlur = isAccelerating ? 12 : 3;
        ctx.fillRect(x, y, barWidth, barHeight);
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, [isAccelerating, rpm, driveMode, selectedColor]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isAccelerating) {
      startEngineSound();
      interval = setInterval(() => {
        setSpeed((prev) => {
          const maxSpeed = gear === 'S' ? driveMode.maxSpeed : gear === 'D' ? Math.min(driveMode.maxSpeed, 160) : gear === 'R' ? 30 : 0;
          const increment = gear === 'S' ? 4 : 2.5;
          if (prev >= maxSpeed) return maxSpeed;
          return Math.min(prev + increment, maxSpeed);
        });
        setRpm((prev) => {
          if (prev >= driveMode.rpmLimit) return driveMode.rpmLimit - 1600;
          return prev + 300;
        });
      }, 30);
    } else {
      interval = setInterval(() => {
        setSpeed((prev) => Math.max(prev - 2.5, 0));
        setRpm((prev) => Math.max(prev - 200, 1000));
        if (speed === 0) stopEngineSound();
      }, 30);
    }
    return () => clearInterval(interval);
  }, [isAccelerating, gear, driveMode]);

  useEffect(() => {
    gsap.utils.toArray('.luxury-panel-reveal').forEach((section) => {
      gsap.from(section as HTMLElement, {
        scrollTrigger: {
          trigger: section as HTMLElement,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
      });
    });

    const path = pathRef.current;
    if (path) {
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 2.2,
        ease: 'power2.inOut',
        scrollTrigger: { trigger: path, start: 'top 80%' },
      });
    }

    return () => {
      stopEngineSound();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
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
    <div className="min-h-screen bg-black text-white overflow-x-hidden font-inter select-none">

      {/* ═══════════════════════════════════════════
          LAYOUT STEP 1: HERO WITH SPEEDLINES & CAR BADGE
          ═══════════════════════════════════════════ */}
      <ParallaxImage
        src="/images/categories/luxury-car.jpg"
        alt="Hyperion GT-EV Luxury Supercar"
        height="100vh"
        parallaxAmount={150}
        initialScale={1.2}
        overlayColor="rgba(0,0,0,0.5)"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border bg-black/40 backdrop-blur-sm text-xs font-orbitron tracking-[0.3em] mb-6"
          style={{ borderColor: `${selectedColor.hex}50`, color: selectedColor.hex }}
        >
          <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: selectedColor.hex }} />
          HYPERCAR PROTOCOL v2.4
        </motion.div>

        <TextReveal
          text="HYPERION"
          as="h1"
          className="font-orbitron text-7xl md:text-[10rem] lg:text-[13rem] font-black leading-none tracking-tighter text-white"
          stagger={0.1}
        />
        <TextReveal
          text="GT-EV PROTO"
          as="h2"
          className="font-orbitron text-3xl md:text-6xl lg:text-7xl font-light leading-none tracking-[0.3em] text-white/70 mt-2"
          stagger={0.12}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-white/40 text-sm md:text-base max-w-md mx-auto mt-8 text-center tracking-wider font-light"
        >
          Stuttgart design ethos. Sub-millisecond torque vectoring. Synthetic audio acoustics.
        </motion.p>
      </ParallaxImage>

      {/* ═══════════════════════════════════════════
          LAYOUT STEP 2: INTERACTIVE SIMULATOR DECK (FIRST IN FLOW)
          ═══════════════════════════════════════════ */}
      <section id="simulator" className="relative py-24 px-4 bg-gradient-to-b from-black via-[#08080c] to-black border-y border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <span className="font-orbitron text-xs tracking-[0.4em] uppercase block mb-3 text-center" style={{ color: selectedColor.hex }}>
            LIVE COCKPIT DYNAMICS
          </span>
          <h2 className="font-orbitron text-3xl md:text-6xl font-black tracking-wider text-center mb-4">
            TEST <span style={{ color: selectedColor.hex }}>TELEMETRY</span>
          </h2>
          <p className="text-white/40 text-xs md:text-sm text-center mb-12 max-w-lg">
            Select transmission gear, choose drive mode, and hold "ACCELERATE" to engage synthetic motors.
          </p>

          <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="p-6 border border-white/10 bg-white/[0.02] rounded-2xl flex flex-col justify-between items-center text-center h-[210px]">
              <span className="font-orbitron text-xs text-white/40 tracking-widest">VELOCITY</span>
              <div className="font-orbitron text-5xl font-black text-white tabular-nums">
                {speed} <span className="text-xs text-white/40">MPH</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div className="h-full transition-all duration-150" style={{ width: `${(speed / driveMode.maxSpeed) * 100}%`, backgroundColor: selectedColor.hex }} />
              </div>
            </div>

            <div className="p-6 border border-white/10 bg-white/[0.02] rounded-2xl flex flex-col justify-between items-center text-center h-[210px]">
              <span className="font-orbitron text-xs text-white/40 tracking-widest">MOTOR RPM</span>
              <div className="font-orbitron text-5xl font-black text-white tabular-nums">
                {rpm} <span className="text-xs text-white/40">RPM</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div className="h-full transition-all duration-150" style={{ width: `${(rpm / driveMode.rpmLimit) * 100}%`, backgroundColor: selectedColor.hex }} />
              </div>
            </div>

            <div className="p-6 border border-white/10 bg-white/[0.02] rounded-2xl flex flex-col justify-between items-center text-center h-[210px]">
              <span className="font-orbitron text-xs text-white/40 tracking-widest">GEAR SELECTION</span>
              <div className="flex gap-2.5 items-center">
                {['P', 'D', 'S', 'R'].map((g) => (
                  <button
                    key={g}
                    onClick={() => { setGear(g as any); if (g === 'P') setSpeed(0); }}
                    className={`w-10 h-10 font-orbitron font-bold text-xs rounded-xl flex items-center justify-center transition ${
                      gear === g ? 'bg-white text-black font-black shadow-lg scale-105' : 'border border-white/10 text-white/40 hover:text-white'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
              <span className="font-orbitron text-[10px] tracking-widest" style={{ color: selectedColor.hex }}>
                GEAR {gear} ACTIVE
              </span>
            </div>

            <div className="p-6 border border-white/10 bg-white/[0.02] rounded-2xl flex flex-col justify-between items-center text-center h-[210px]">
              <span className="font-orbitron text-xs text-white/40 tracking-widest">ACOUSTIC FREQ</span>
              <canvas ref={audioCanvasRef} width={180} height={70} className="w-full h-16 my-auto" />
              <span className="font-orbitron text-[10px] text-white/40 tracking-widest">
                {isAccelerating ? 'SYNTH REV ACTIVE' : 'ENGINE IDLE'}
              </span>
            </div>
          </div>

          <div className="w-full flex flex-wrap gap-6 items-center justify-between">
            <div className="flex gap-4 items-center">
              <button
                onMouseDown={() => setIsAccelerating(true)}
                onMouseUp={() => setIsAccelerating(false)}
                onTouchStart={() => setIsAccelerating(true)}
                onTouchEnd={() => setIsAccelerating(false)}
                onMouseLeave={() => setIsAccelerating(false)}
                className="px-10 py-4.5 text-black font-orbitron font-bold tracking-widest rounded-xl shadow-lg active:scale-95 transition cursor-none select-none"
                style={{ backgroundColor: selectedColor.hex }}
                data-cursor-label="ACCELERATE"
              >
                HOLD TO ACCELERATE
              </button>
              <button
                onClick={() => setActiveAero(!activeAero)}
                className={`px-6 py-4.5 font-orbitron font-bold tracking-wider rounded-xl border transition cursor-none ${
                  activeAero ? 'border-white text-white bg-white/10' : 'border-white/10 text-white/40'
                }`}
              >
                {activeAero ? 'SPOILER DEPLOYED' : 'DEPLOY SPOILER'}
              </button>
            </div>
            <div className="flex gap-3 items-center">
              <span className="font-orbitron text-[10px] text-white/40 tracking-widest mr-2">BODY FINISH</span>
              {CAR_COLORS.map((c) => (
                <button key={c.hex} onClick={() => setSelectedColor(c)}
                  className={`w-7 h-7 rounded-full border flex items-center justify-center transition cursor-none ${
                    selectedColor.hex === c.hex ? 'border-white scale-125 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          LAYOUT STEP 3: CHAR REVEAL PHILOSOPHY
          ═══════════════════════════════════════════ */}
      <section className="relative py-32 md:py-48 px-6 md:px-12 lg:px-24 bg-black">
        <div className="max-w-5xl mx-auto">
          <span className="font-orbitron text-xs tracking-[0.4em] text-white/30 block mb-12">PHILOSOPHY</span>
          <CharReveal
            text="We don't merely engineer automobiles — we sculpt velocity into form. Every curve is a calculated dialogue between air and ambition. Every surface tells a story of relentless pursuit. This is not transportation. This is the manifestation of an obsession with perfection, distilled into carbon, titanium, and electric pulse."
            className="text-3xl md:text-5xl lg:text-6xl font-light leading-tight tracking-tight text-white"
            start="top 80%"
            end="bottom 30%"
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          LAYOUT STEP 4: MARQUEE BAND
          ═══════════════════════════════════════════ */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <MarqueeText
          items={['AERODYNAMICS', 'PERFORMANCE', 'PRECISION', 'ENGINEERING', 'CARBON FIBER', 'ELECTRIC PULSE']}
          speed={20}
          separator="✦"
          className="text-white/15"
        />
      </section>

      {/* ═══════════════════════════════════════════
          LAYOUT STEP 5: HORIZONTAL SCROLL GALLERY
          ═══════════════════════════════════════════ */}
      <section className="bg-black">
        <div className="py-20 px-6 md:px-12">
          <div className="flex items-baseline justify-between mb-4 max-w-7xl mx-auto">
            <div>
              <span className="font-orbitron text-xs tracking-[0.4em] text-white/30 block mb-3">ENGINEERING DETAILS</span>
              <h2 className="font-orbitron text-4xl md:text-6xl font-black tracking-tight">
                FRESH <span className="font-light italic text-white/60">Architecture</span>
              </h2>
            </div>
            <span className="hidden md:block font-orbitron text-xs tracking-widest text-white/20">SCROLL →</span>
          </div>
        </div>

        <HorizontalScrollPin className="bg-black" scrollMultiplier={4}>
          {GALLERY_ITEMS.map((item, i) => (
            <div
              key={i}
              className={`flex-shrink-0 w-[85vw] md:w-[45vw] h-[75vh] rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br ${item.gradient} p-10 md:p-14 flex flex-col justify-between group hover:border-white/20 transition-colors duration-500`}
            >
              <div>
                <span className="font-orbitron text-xs tracking-[0.3em] text-white/30 block mb-2">{item.subtitle}</span>
                <div className="text-8xl md:text-9xl opacity-10 group-hover:opacity-20 transition-opacity duration-700 mb-4">
                  {item.icon}
                </div>
              </div>
              <div>
                <h3 className="font-orbitron text-3xl md:text-4xl font-black tracking-wider mb-4">{item.title}</h3>
                <p className="text-white/50 text-base md:text-lg leading-relaxed max-w-lg">{item.description}</p>
              </div>
            </div>
          ))}
        </HorizontalScrollPin>
      </section>

      {/* ═══════════════════════════════════════════
          LAYOUT STEP 6: 3D CARD SHOWCASE
          ═══════════════════════════════════════════ */}
      <section id="showcase" className="luxury-panel-reveal py-24 px-4 bg-gradient-to-b from-black via-[#08080c] to-black border-y border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="font-orbitron text-xs tracking-[0.3em] uppercase block mb-3" style={{ color: selectedColor.hex }}>
              VISUAL MATRIX
            </span>
            <h2 className="font-orbitron text-3xl md:text-5xl font-black tracking-wider">
              AERODYNAMIC <span style={{ color: selectedColor.hex }}>SILHOUETTE</span>
            </h2>
          </div>

          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-gradient-to-b from-[#111] to-[#040406] transition-transform duration-200 ease-out"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="relative h-[380px] md:h-[550px] overflow-hidden">
              <img
                src="/images/categories/luxury-car.jpg"
                alt="Luxury Supercar Showcase Screen"
                className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
                style={{ filter: selectedColor.filter }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

              <div className="absolute top-6 left-6 flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: selectedColor.hex }} />
                <span className="font-orbitron text-xs tracking-widest text-white/80">APEX AERO-ACTIVE v2.4</span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 flex flex-wrap justify-between items-end gap-4">
                <div>
                  <h3 className="font-orbitron text-2xl md:text-4xl font-black text-white mb-2">
                    HYPERION GT-EV <span className="text-xs font-normal opacity-60">LIMITED EDITION</span>
                  </h3>
                  <p className="font-inter text-xs text-white/60 max-w-md hidden sm:block">
                    Monolithic dry carbon body shell engineered with active ground-effect venturi channels.
                  </p>
                </div>
                <div className="flex gap-2 bg-black/70 backdrop-blur-md p-1.5 rounded-xl border border-white/10">
                  {DRIVE_MODES.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setDriveMode(mode)}
                      className={`px-3 py-1.5 rounded-lg font-orbitron text-[10px] font-bold tracking-wider transition ${
                        driveMode.id === mode.id ? 'bg-white text-black shadow-lg' : 'text-white/50 hover:text-white'
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
          LAYOUT STEP 7: SPECS & PROCESS
          ═══════════════════════════════════════════ */}
      <section className="py-32 px-6 md:px-12 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="font-orbitron text-xs tracking-[0.4em] text-white/30 block mb-3">SPECIFICATIONS</span>
            <h2 className="font-orbitron text-4xl md:text-6xl font-black tracking-tight">
              BY THE <span style={{ color: selectedColor.hex }}>NUMBERS</span>
            </h2>
          </div>

          <StaggerGrid columns="grid-cols-2 md:grid-cols-3" gap="gap-6" stagger={0.1}>
            {SPECS.map((spec) => (
              <div
                key={spec.label}
                className="p-8 md:p-10 border border-white/10 bg-white/[0.02] rounded-2xl text-center group hover:border-white/20 transition-all duration-500 hover:bg-white/[0.04]"
              >
                <span className="font-orbitron text-[10px] tracking-[0.3em] text-white/30 block mb-4">{spec.label}</span>
                <div className="font-orbitron text-4xl md:text-5xl font-black text-white mb-1">{spec.value}</div>
                <span className="font-orbitron text-xs tracking-widest text-white/40">{spec.unit}</span>
              </div>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          LAYOUT STEP 8: COMMISSION PROCESS
          ═══════════════════════════════════════════ */}
      <section className="py-32 px-6 md:px-12 bg-[#050508] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <span className="font-orbitron text-xs tracking-[0.4em] text-white/30 block mb-3">OUR PROCESS</span>
            <h2 className="font-orbitron text-4xl md:text-6xl font-black tracking-tight">
              FROM VISION <span className="font-light italic text-white/60">to Reality</span>
            </h2>
          </div>

          <StaggerGrid columns="grid-cols-1 md:grid-cols-2 lg:grid-cols-4" gap="gap-6" stagger={0.12}>
            {PROCESS_STEPS.map((step) => (
              <div
                key={step.num}
                className="p-8 border border-white/10 bg-white/[0.02] rounded-2xl group hover:border-white/25 transition-all duration-500"
              >
                <span
                  className="font-orbitron text-5xl font-black block mb-6 transition-colors duration-500"
                  style={{ color: `${selectedColor.hex}40` }}
                >
                  {step.num}
                </span>
                <h3 className="font-orbitron text-sm tracking-widest font-bold mb-3">{step.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          LAYOUT STEP 8: LARGE CTA FOOTER
          ═══════════════════════════════════════════ */}
      <section className="py-40 px-6 text-center bg-gradient-to-t from-[#0d0d12] to-black border-t border-white/5">
        <span className="font-orbitron text-xs tracking-[0.4em] text-white/25 block mb-8">COMMISSION YOUR HYPERION</span>
        <h2 className="font-orbitron text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-6">
          SECURE YOUR <span style={{ color: selectedColor.hex }}>SLOT</span>
        </h2>
        <p className="text-white/40 text-base md:text-lg mb-12 max-w-lg mx-auto leading-relaxed">
          Collaborate with our engineering specialists to specify your hypercar configuration. Only 99 units will ever be produced.
        </p>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: `0 0 60px ${selectedColor.hex}50` }}
          whileTap={{ scale: 0.95 }}
          className="px-14 py-6 text-black font-orbitron text-sm tracking-widest font-bold transition duration-300 cursor-none rounded-full"
          style={{ backgroundColor: selectedColor.hex }}
          data-cursor-label="COMMISSION"
        >
          RESERVE COMMISSION SLOT
        </motion.button>
      </section>
    </div>
  );
};

export default LuxuryCarPage;
