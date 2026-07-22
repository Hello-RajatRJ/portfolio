import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TextReveal from '../../components/showcase/TextReveal';
import AnimatedCounter from '../../components/showcase/AnimatedCounter';
import CharReveal from '../../components/showcase/CharReveal';
import ParallaxImage from '../../components/showcase/ParallaxImage';
import HorizontalScrollPin from '../../components/showcase/HorizontalScrollPin';
import StaggerGrid from '../../components/showcase/StaggerGrid';
import MarqueeText from '../../components/showcase/MarqueeText';

gsap.registerPlugin(ScrollTrigger);

const SAMPLE_PROMPTS = [
  { prompt: 'Analyze real-time financial market volatility', tokens: '1,420 t/s', confidence: '99.8%', latency: '0.4ms', response: 'Market sentiment index +4.2%. Neural hedging vectors calculated across 12 exchange liquidity pools.' },
  { prompt: 'Synthesize 3D Shader GLSL for Cybernetic Field', tokens: '2,890 t/s', confidence: '99.9%', latency: '0.2ms', response: 'GLSL frag shader generated with uniforms u_time, u_resolution. Zero allocation pipeline compiled.' },
  { prompt: 'Optimize Kubernetes cluster load distribution', tokens: '1,840 t/s', confidence: '99.5%', latency: '0.6ms', response: 'Dispatched 48 micro-pods to Frankfurt node. Energy consumption reduced by 28.4%.' },
];

const CAPABILITIES = [
  {
    title: 'DEEP COGNITIVE LEARNING',
    subtitle: 'Neural Architecture',
    description: 'State-of-the-art transformer architectures with automatic hyperparameter tuning. Self-evolving weight matrices adapt in real-time to input domain shifts.',
    gradient: 'from-blue-950 via-neutral-950 to-black',
    icon: '🧠',
  },
  {
    title: 'SUB-MS INFERENCE',
    subtitle: 'Edge Processing',
    description: 'Optimized execution pipelines designed for real-time edge processing. Quantized INT8 kernels run on custom silicon for 0.2ms response times.',
    gradient: 'from-cyan-950 via-neutral-950 to-black',
    icon: '⚡',
  },
  {
    title: 'FEDERATED PRIVACY',
    subtitle: 'Shield Protocol',
    description: 'End-to-end homomorphic encryption with mathematical safety guarantees. Train on distributed data without ever exposing raw inputs to the central model.',
    gradient: 'from-purple-950 via-neutral-950 to-black',
    icon: '🔒',
  },
  {
    title: 'UNIFIED MULTIMODAL',
    subtitle: 'Cross-Domain',
    description: 'Seamlessly processes text, imagery, auditory, and structural pipelines through a unified attention mechanism that learns cross-modal representations.',
    gradient: 'from-indigo-950 via-neutral-950 to-black',
    icon: '🌐',
  },
  {
    title: 'ELASTIC SCALING',
    subtitle: 'Auto Compute',
    description: 'Serverless compute layer which dynamically scales relative to payload volume. Zero cold-start architecture with predictive resource pre-allocation.',
    gradient: 'from-violet-950 via-neutral-950 to-black',
    icon: '🔄',
  },
];

const METRICS = [
  { label: 'REQUESTS PROCESSED', value: '2.4', unit: 'M' },
  { label: 'ACCURACY RATING', value: '99.7', unit: '%' },
  { label: 'AVG LATENCY', value: '0.8', unit: 'MS' },
  { label: 'ACTIVE PODS', value: '128', unit: '' },
  { label: 'MODELS DEPLOYED', value: '847', unit: '' },
  { label: 'UPTIME SLA', value: '99.99', unit: '%' },
];

const AIProductPage: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [typedText, setTypedText] = useState(SAMPLE_PROMPTS[0].response);

  // Interactive Neural Particle Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const mouse = { x: canvas.width / 2, y: canvas.height / 2 };

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = 360;
    };
    resize();
    window.addEventListener('resize', resize);

    const nodes: Array<{ x: number; y: number; vx: number; vy: number; radius: number }> = [];
    for (let i = 0; i < 45; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2 + 1.5,
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    canvas.addEventListener('mousemove', handleMouseMove);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        a.x += a.vx;
        a.y += a.vy;
        if (a.x < 0 || a.x > canvas.width) a.vx *= -1;
        if (a.y < 0 || a.y > canvas.height) a.vy *= -1;

        const dxMouse = mouse.x - a.x;
        const dyMouse = mouse.y - a.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(59, 130, 246, ${0.4 * (1 - distMouse / 120)})`;
          ctx.lineWidth = 1;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }

        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dist = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.25 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#60a5fa';
        ctx.shadowColor = '#3b82f6';
        ctx.shadowBlur = 8;
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // GSAP scroll animations
  useEffect(() => {
    if (gridRef.current) {
      const lines = gridRef.current.querySelectorAll('.grid-line');
      gsap.from(lines, { scaleY: 0, opacity: 0, stagger: 0.05, duration: 1.5, ease: 'power4.out' });
    }

    gsap.utils.toArray('.ai-reveal').forEach((section) => {
      gsap.from(section as HTMLElement, {
        scrollTrigger: { trigger: section as HTMLElement, start: 'top 85%', toggleActions: 'play none none reverse' },
        y: 60, opacity: 0, duration: 1.2, ease: 'power3.out',
      });
    });

    return () => { ScrollTrigger.getAll().forEach((t) => t.kill()); };
  }, []);

  // Handle Prompt Trigger
  const triggerPrompt = (index: number) => {
    setActivePromptIndex(index);
    setIsGenerating(true);
    setTypedText('');
    const target = SAMPLE_PROMPTS[index].response;
    let i = 0;
    const interval = setInterval(() => {
      if (i < target.length) { setTypedText(target.substring(0, i + 1)); i++; }
      else { setIsGenerating(false); clearInterval(interval); }
    }, 18);
  };

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
    <div className="min-h-screen bg-[#04040a] text-white overflow-x-hidden select-none">

      {/* ═══════════════════════════════════════════
          SECTION 1: FULL-BLEED PARALLAX HERO
          ═══════════════════════════════════════════ */}
      <ParallaxImage
        src="/images/categories/ai-product.jpg"
        alt="Nexus Intelligence AI Platform"
        height="100vh"
        parallaxAmount={150}
        initialScale={1.2}
        overlayColor="rgba(4,4,10,0.6)"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-orbitron tracking-[0.3em] mb-10 shadow-lg shadow-blue-500/10"
        >
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          NEURAL ENGINE v4.0
        </motion.div>

        <TextReveal
          text="NEXUS"
          as="h1"
          className="font-orbitron text-7xl md:text-[10rem] lg:text-[14rem] font-black leading-none tracking-tighter bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent"
          stagger={0.1}
        />
        <TextReveal
          text="INTELLIGENCE"
          as="h2"
          className="font-orbitron text-3xl md:text-5xl lg:text-7xl font-light leading-none tracking-[0.3em] text-white/60 mt-2"
          stagger={0.08}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="text-white/40 text-sm md:text-base max-w-md mx-auto mt-8 text-center tracking-wider font-light"
        >
          Build, deploy, and scale complex machine learning workflows at 60 FPS speed.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 flex flex-col items-center gap-3"
        >
          <span className="font-orbitron text-[9px] tracking-[0.4em] text-white/30">SCROLL TO EXPLORE</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="w-px h-16 bg-gradient-to-b from-blue-400/40 to-transparent"
          />
        </motion.div>
      </ParallaxImage>

      {/* ═══════════════════════════════════════════
          SECTION 2: PHILOSOPHY — CHAR REVEAL
          ═══════════════════════════════════════════ */}
      <section className="relative py-32 md:py-48 px-6 md:px-12 lg:px-24 bg-[#04040a]">
        <div className="max-w-5xl mx-auto">
          <span className="font-orbitron text-xs tracking-[0.4em] text-blue-400/50 block mb-12">OUR VISION</span>
          <CharReveal
            text="We believe intelligence should be accessible, transparent, and infinitely scalable. Nexus was built from the ground up to democratize machine cognition — giving every developer, researcher, and enterprise the power to build systems that think, reason, and evolve autonomously."
            className="text-3xl md:text-5xl lg:text-6xl font-light leading-tight tracking-tight text-white"
            start="top 80%"
            end="bottom 30%"
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 3: MARQUEE BAND
          ═══════════════════════════════════════════ */}
      <section className="border-y border-blue-500/10 bg-blue-500/[0.02]">
        <MarqueeText
          items={['INTELLIGENCE', 'INFERENCE', 'COMPUTE', 'SCALE', 'NEURAL NETWORKS', 'DEEP LEARNING']}
          speed={20}
          separator="◆"
          className="text-blue-400/15"
        />
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 4: HORIZONTAL SCROLL — CAPABILITIES
          ═══════════════════════════════════════════ */}
      <section className="bg-[#04040a]">
        <div className="py-20 px-6 md:px-12">
          <div className="flex items-baseline justify-between mb-4 max-w-7xl mx-auto">
            <div>
              <span className="font-orbitron text-xs tracking-[0.4em] text-blue-400/50 block mb-3">CORE ENGINE</span>
              <h2 className="font-orbitron text-4xl md:text-6xl font-black tracking-tight">
                FRESH <span className="font-light italic text-white/60">Capabilities</span>
              </h2>
            </div>
            <span className="hidden md:block font-orbitron text-xs tracking-widest text-white/20">SCROLL →</span>
          </div>
        </div>

        <HorizontalScrollPin className="bg-[#04040a]" scrollMultiplier={4}>
          {CAPABILITIES.map((item, i) => (
            <div
              key={i}
              className={`flex-shrink-0 w-[85vw] md:w-[45vw] h-[75vh] rounded-3xl overflow-hidden border border-blue-500/15 bg-gradient-to-br ${item.gradient} p-10 md:p-14 flex flex-col justify-between group hover:border-blue-500/30 transition-colors duration-500`}
            >
              <div>
                <span className="font-orbitron text-xs tracking-[0.3em] text-blue-400/40 block mb-2">{item.subtitle}</span>
                <div className="text-7xl md:text-8xl mb-4 group-hover:scale-110 transition-transform duration-700">{item.icon}</div>
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
          SECTION 5: FULL-WIDTH IMAGE BREAK
          ═══════════════════════════════════════════ */}
      <ParallaxImage
        src="/images/categories/ai-product.jpg"
        alt="Nexus Neural Console"
        height="70vh"
        parallaxAmount={80}
        initialScale={1.1}
        overlayColor="rgba(4,4,10,0.4)"
        className="border-y border-blue-500/10"
      >
        <div className="text-center">
          <span className="font-orbitron text-xs tracking-[0.4em] text-blue-400/50 block mb-4">QUANTUM ARCHITECTURE</span>
          <h2 className="font-orbitron text-5xl md:text-8xl font-black tracking-tighter">
            THINK <span className="text-blue-400">FASTER</span>
          </h2>
        </div>
      </ParallaxImage>

      {/* ═══════════════════════════════════════════
          SECTION 6: STAGGERED METRICS GRID
          ═══════════════════════════════════════════ */}
      <section className="py-32 px-6 md:px-12 bg-[#04040a]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="font-orbitron text-xs tracking-[0.4em] text-blue-400/50 block mb-3">TELEMETRY</span>
            <h2 className="font-orbitron text-4xl md:text-6xl font-black tracking-tight">
              NEXUS <span className="text-purple-400">METRICS</span>
            </h2>
          </div>

          <StaggerGrid columns="grid-cols-2 md:grid-cols-3" gap="gap-6" stagger={0.1}>
            {METRICS.map((metric) => (
              <div key={metric.label} className="p-8 md:p-10 border border-blue-500/10 bg-blue-500/[0.02] rounded-2xl text-center group hover:border-blue-500/25 transition-all duration-500">
                <span className="font-orbitron text-[10px] tracking-[0.3em] text-white/30 block mb-4">{metric.label}</span>
                <div className="font-orbitron text-4xl md:text-5xl font-black text-white mb-1">{metric.value}</div>
                <span className="font-orbitron text-xs tracking-widest text-blue-400/60">{metric.unit}</span>
              </div>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 7: SECOND CHAR REVEAL
          ═══════════════════════════════════════════ */}
      <section className="py-32 md:py-40 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-[#04040a] via-[#080816] to-[#04040a] border-y border-blue-500/5">
        <div className="max-w-4xl mx-auto">
          <CharReveal
            text="Our neural architecture processes over two million inference requests daily with 99.7% accuracy. We've built a system that doesn't just respond — it anticipates, learns, and continuously optimizes itself. Nexus represents a fundamental shift from reactive computing to predictive intelligence."
            className="text-xl md:text-3xl lg:text-4xl font-light leading-relaxed tracking-tight text-white"
            dimOpacity={0.08}
            start="top 75%"
            end="bottom 25%"
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 8: 3D SHOWCASE CARD (existing)
          ═══════════════════════════════════════════ */}
      <section id="ai-showcase" className="ai-reveal py-24 px-4 bg-gradient-to-b from-[#04040a] via-[#080816] to-[#04040a] border-y border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="font-orbitron text-xs text-blue-400 tracking-[0.3em] uppercase block mb-3">INTERFACE GRAPHICS</span>
            <h2 className="font-orbitron text-3xl md:text-5xl font-black tracking-wider">
              NEXUS <span className="text-purple-400">NEURAL CONSOLE</span>
            </h2>
          </div>

          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative rounded-3xl overflow-hidden border border-blue-500/30 shadow-2xl shadow-blue-500/10 bg-[#080814] transition-transform duration-200 ease-out"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="relative h-[360px] md:h-[520px] overflow-hidden">
              <img src="/images/categories/ai-product.jpg" alt="AI Product Dashboard Screen" className="w-full h-full object-cover transition-all duration-700 hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#04040a] via-black/40 to-transparent" />
              <motion.div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee]" animate={{ y: [0, 500, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }} />
              <div className="absolute top-6 left-6 flex items-center gap-3 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full border border-blue-500/30">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-orbitron text-xs tracking-widest text-cyan-300">SYSTEM: QUANTUM ONLINE</span>
              </div>
              <div className="absolute top-6 right-6 hidden md:flex items-center gap-4 bg-black/70 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10 font-orbitron text-xs">
                <div><span className="text-white/40 block text-[9px]">COMPUTE NODES</span><span className="font-black text-blue-400 text-sm">128 ACTIVE</span></div>
                <div className="w-px h-6 bg-white/10" />
                <div><span className="text-white/40 block text-[9px]">LATENCY</span><span className="font-black text-cyan-400 text-sm">0.4ms</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 9: INTERACTIVE SANDBOX (existing)
          ═══════════════════════════════════════════ */}
      <section id="ai-sandbox" className="ai-reveal py-24 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-orbitron text-3xl md:text-5xl font-bold tracking-wider mb-3">
            INTERACTIVE <span className="text-blue-400">PROMPT STREAM</span>
          </h2>
          <p className="font-inter text-sm text-white/50">Test the sub-millisecond cognitive output pipeline</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {SAMPLE_PROMPTS.map((_, idx) => (
            <button key={idx} onClick={() => triggerPrompt(idx)}
              className={`px-5 py-2.5 rounded-xl font-orbitron text-xs transition border cursor-none ${
                activePromptIndex === idx
                  ? 'border-blue-500 bg-blue-500/20 text-blue-300 shadow-lg shadow-blue-500/20'
                  : 'border-white/10 bg-white/5 text-white/60 hover:text-white'
              }`}
            >
              PROMPT {idx + 1}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/80 backdrop-blur-md p-6 md:p-8 font-mono text-sm relative shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <span className="text-xs text-white/40 ml-2 font-orbitron">nexus-terminal ~ stream-v4</span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-blue-400">TOKENS: {SAMPLE_PROMPTS[activePromptIndex].tokens}</span>
              <span className="text-purple-400">CONFIDENCE: {SAMPLE_PROMPTS[activePromptIndex].confidence}</span>
            </div>
          </div>
          <div className="mb-4 text-white/70">
            <span className="text-blue-400">$ prompt_input:</span> "{SAMPLE_PROMPTS[activePromptIndex].prompt}"
          </div>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 min-h-[90px] text-cyan-300 leading-relaxed">
            {typedText}
            {isGenerating && <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse" />}
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-white/10 bg-gradient-to-b from-[#080816] to-[#04040a] overflow-hidden relative">
          <div className="absolute top-4 left-6 z-10 font-orbitron text-xs text-white/40 tracking-widest">
            NEURAL GRAPH MATRIX (HOVER TO CONNECT)
          </div>
          <canvas ref={canvasRef} className="w-full h-[360px] cursor-crosshair" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 10: MARQUEE BAND 2
          ═══════════════════════════════════════════ */}
      <section className="border-y border-blue-500/10 bg-blue-500/[0.02]">
        <MarqueeText
          items={['NEXUS', 'ENGINE', 'v4.0', 'QUANTUM', 'COMPUTE', 'NEURAL']}
          speed={35}
          direction="right"
          separator="—"
          className="text-blue-400/10"
        />
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 11: DASHBOARD TELEMETRY (existing — enhanced)
          ═══════════════════════════════════════════ */}
      <section className="ai-reveal py-32 px-4 bg-gradient-to-b from-[#04040a] via-[#080816] to-[#04040a] border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-orbitron text-3xl md:text-5xl font-bold text-center mb-16 tracking-wider">
            LIVE <span className="text-purple-400">TELEMETRY</span>
          </h2>

          <div className="rounded-2xl border border-white/10 bg-white/[0.01] backdrop-blur-xs p-6 md:p-8 overflow-hidden shadow-2xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Requests Processed', end: 2.4, suffix: 'M', decimals: 1 },
                { label: 'Accuracy Rating', end: 99.7, suffix: '%', decimals: 1 },
                { label: 'Avg Execution Latency', end: 0.8, suffix: 'ms', decimals: 1 },
                { label: 'Active Compute Pods', end: 128, suffix: '', decimals: 0 },
              ].map((metric) => (
                <div key={metric.label} className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="font-inter text-xs text-white/35 mb-2">{metric.label}</div>
                  <div className="font-orbitron text-2xl font-black text-white">
                    <AnimatedCounter end={metric.end} prefix="" suffix={metric.suffix} decimals={metric.decimals} />
                  </div>
                </div>
              ))}
            </div>

            <div className="h-48 rounded-lg bg-white/5 border border-white/5 flex items-end gap-1.5 p-4">
              {Array.from({ length: 32 }).map((_, i) => (
                <motion.div key={i} className="flex-1 rounded-t-sm"
                  style={{ background: `linear-gradient(180deg, rgba(59,130,246,0.6), rgba(139,92,246,0.2))` }}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${15 + Math.random() * 85}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.02, duration: 0.6 }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 12: PRICING (existing — enhanced)
          ═══════════════════════════════════════════ */}
      <section className="ai-reveal py-32 px-4 max-w-5xl mx-auto">
        <h2 className="font-orbitron text-3xl md:text-5xl font-bold mb-20 text-center tracking-wider">
          COMPUTE <span className="text-blue-400">PLANNING</span>
        </h2>

        <StaggerGrid columns="grid-cols-1 md:grid-cols-3" gap="gap-6" stagger={0.12}>
          {[
            { tier: 'Starter', price: 49, features: ['10K request telemetry/mo', '5 neural models deployed', 'Standard community support'] },
            { tier: 'Pro Engine', price: 199, features: ['Unlimited telemetry requests', '50 active compute pods', 'Priority engineer support', 'Custom neural model training'], popular: true },
            { tier: 'Enterprise Hybrid', price: 899, features: ['Dedicated on-prem hybrid infra', 'Unlimited custom compute pods', '24/7 dedicated support matrix', 'Compliance SLA guarantees'] },
          ].map((plan) => (
            <div key={plan.tier}
              className={`relative p-8 rounded-2xl border transition-all duration-500 cursor-none flex flex-col justify-between min-h-[420px] ${
                plan.popular
                  ? 'border-blue-500 bg-gradient-to-b from-blue-500/10 to-purple-500/5 shadow-lg shadow-blue-500/10'
                  : 'border-white/10 bg-white/[0.01] hover:border-white/20'
              }`}
              data-cursor-label="PLAN"
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[10px] font-orbitron tracking-widest rounded-full">MOST DEPLOYED</div>
              )}
              <div>
                <h3 className="font-orbitron text-lg font-bold mb-3">{plan.tier}</h3>
                <div className="font-orbitron text-4xl font-black text-white mb-8">
                  <AnimatedCounter end={plan.price} prefix="$" suffix="" /><span className="text-sm font-normal text-white/35">/mo</span>
                </div>
                <ul className="space-y-4 text-left">
                  {plan.features.map((f) => <li key={f} className="font-inter text-xs text-white/50 flex items-center gap-2"><span className="text-blue-400">✓</span> {f}</li>)}
                </ul>
              </div>
              <button className={`w-full py-3.5 rounded-lg font-orbitron text-xs font-bold tracking-wider mt-8 ${
                plan.popular ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'border border-white/10 text-white/60 hover:border-blue-500/50'
              }`}>DEPLOY ENDPOINT</button>
            </div>
          ))}
        </StaggerGrid>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 13: LARGE CTA FOOTER
          ═══════════════════════════════════════════ */}
      <section className="py-40 px-6 text-center bg-gradient-to-t from-[#080816] to-[#04040a] border-t border-blue-500/10">
        <span className="font-orbitron text-xs tracking-[0.4em] text-blue-400/30 block mb-8">START BUILDING TODAY</span>
        <h2 className="font-orbitron text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-6">
          DEPLOY <span className="text-blue-400">NEXUS</span>
        </h2>
        <p className="text-white/40 text-base md:text-lg mb-12 max-w-lg mx-auto leading-relaxed">
          Join over 12,000 engineering teams who've already accelerated their AI pipelines with Nexus Intelligence.
        </p>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 60px rgba(59,130,246,0.4)' }}
          whileTap={{ scale: 0.95 }}
          className="px-14 py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-orbitron text-sm tracking-widest font-bold transition duration-300 cursor-none rounded-full"
          data-cursor-label="DEPLOY"
        >
          START FREE TRIAL
        </motion.button>

        <div className="mt-24 flex flex-wrap justify-center gap-12 text-white/20 font-orbitron text-[10px] tracking-[0.3em]">
          <span>NEXUS INTELLIGENCE © 2026</span>
          <span>PRIVACY POLICY</span>
          <span>DOCUMENTATION</span>
        </div>
      </section>
    </div>
  );
};

export default AIProductPage;
