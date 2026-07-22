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

const NODES = [
  { id: 'webhook', label: 'Webhook Input', type: 'trigger', status: 'ACTIVE', color: 'border-indigo-500 bg-indigo-500/20 text-indigo-300' },
  { id: 'ai', label: 'AI Classifier Node', type: 'transform', status: '0.4ms', color: 'border-purple-500 bg-purple-500/20 text-purple-300' },
  { id: 'cache', label: 'Redis L2 Cache', type: 'storage', status: 'HIT', color: 'border-cyan-500 bg-cyan-500/20 text-cyan-300' },
  { id: 'postgres', label: 'PostgreSQL Vector', type: 'db', status: 'SYNCED', color: 'border-emerald-500 bg-emerald-500/20 text-emerald-300' },
  { id: 'edge', label: 'Edge Dispatcher', type: 'output', status: '200 OK', color: 'border-pink-500 bg-pink-500/20 text-pink-300' },
];

const MODULES = [
  {
    title: 'WORKFLOW BUILDER',
    subtitle: 'Zero-Code DAGs',
    description: 'Visual event-driven workflow engine supporting multi-branch conditional execution and automated failover routing across cloud clusters.',
    gradient: 'from-indigo-950 via-slate-950 to-black',
    icon: '⚡',
    stats: '10K EXEC/SEC',
  },
  {
    title: 'GLOBAL EDGE MESH',
    subtitle: '285 POP Locations',
    description: 'Ultra-low latency serverless edge runtime running V8 isolate sandboxes directly inside cloud provider POPs.',
    gradient: 'from-purple-950 via-slate-950 to-black',
    icon: '🌐',
    stats: '14MS AVG GLOBAL',
  },
  {
    title: 'REAL-TIME OBSERVABILITY',
    subtitle: 'OpenTelemetry Native',
    description: 'Sub-second log tailing, distributed tracing, and automated anomaly detection with Zero-overhead eBPF kernel instrumentation.',
    gradient: 'from-blue-950 via-slate-950 to-black',
    icon: '📊',
    stats: '100% COVERAGE',
  },
  {
    title: 'SECRET MESH SHIELD',
    subtitle: 'HSM Vault',
    description: 'Zero-trust environment variable encryption with automatic key rotation and biometric audit logs for SOC2 compliance.',
    gradient: 'from-pink-950 via-slate-950 to-black',
    icon: '🔐',
    stats: 'AES-256-GCM',
  },
  {
    title: 'AUTO-SCALE KUBERNETES',
    subtitle: 'Cluster Auto-Pilot',
    description: 'Predictive pod autoscaling driven by historical workload metrics, reducing cloud infrastructure burn by up to 42%.',
    gradient: 'from-cyan-950 via-slate-950 to-black',
    icon: '☁️',
    stats: '42% COST SAVINGS',
  },
];

const SAAS_METRICS = [
  { label: 'GLOBAL REQUESTS/SEC', value: '4.8', unit: 'M' },
  { label: 'UPTIME RELIABILITY', value: '99.999', unit: '%' },
  { label: 'EDGE POPs', value: '285', unit: 'CITIES' },
  { label: 'AVG RESPONSE LATENCY', value: '14', unit: 'MS' },
  { label: 'ACTIVE PIPELINES', value: '18,400', unit: '+' },
  { label: 'DATA PROCESSED/DAY', value: '84.2', unit: 'PB' },
];

const INTEGRATIONS = [
  { icon: '🐙', title: 'GITHUB ACTIONS', desc: 'Auto-deploy pipelines directly on code merge.' },
  { icon: '🐳', title: 'DOCKER CONTAINER', desc: 'Single-command container deployment runtime.' },
  { icon: '⚡', title: 'KAFKA STREAM', desc: 'Real-time event bus with zero message drop.' },
  { icon: '❄️', title: 'SNOWFLAKE DWH', desc: 'Automated data lake ETL syncing every 60s.' },
  { icon: '🛡️', title: 'DATADOG MESH', desc: 'Unified metrics dashboard & APM export.' },
  { icon: '🔷', title: 'TERRAFORM IAC', desc: 'Infrastructure as Code provider modules.' },
];

const SaaSPage: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [activeNode, setActiveNode] = useState(NODES[0]);
  const [isAnnual, setIsAnnual] = useState(true);

  useEffect(() => {
    gsap.utils.toArray('.saas-reveal').forEach((section) => {
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
    <div className="min-h-screen bg-[#080914] text-white overflow-x-hidden select-none font-inter">

      {/* ═══════════════════════════════════════════
          SECTION 1: FULL-BLEED PARALLAX HERO
          ═══════════════════════════════════════════ */}
      <ParallaxImage
        src="/images/categories/saas.jpg"
        alt="VORTEX Cloud Infrastructure Console"
        height="100vh"
        parallaxAmount={150}
        initialScale={1.2}
        overlayColor="rgba(8,9,20,0.6)"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-orbitron tracking-[0.3em] mb-10 shadow-lg shadow-indigo-500/10"
        >
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          ENTERPRISE CLOUD PLATFORM
        </motion.div>

        <TextReveal
          text="VORTEX"
          as="h1"
          className="font-orbitron text-7xl md:text-[10rem] lg:text-[13rem] font-black leading-none tracking-tighter bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-400 bg-clip-text text-transparent"
          stagger={0.1}
        />
        <TextReveal
          text="CLOUD MESH"
          as="h2"
          className="font-orbitron text-3xl md:text-5xl lg:text-7xl font-light leading-none tracking-[0.3em] text-white/60 mt-2"
          stagger={0.12}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="text-indigo-100/40 text-sm md:text-base max-w-md mx-auto mt-8 text-center tracking-wider font-light"
        >
          Autonomous multi-cloud workflow orchestra running 4.8 million requests/sec.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 flex flex-col items-center gap-3"
        >
          <span className="font-orbitron text-[9px] tracking-[0.4em] text-indigo-400/40">SCROLL TO DISCOVER</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="w-px h-16 bg-gradient-to-b from-indigo-400/40 to-transparent"
          />
        </motion.div>
      </ParallaxImage>

      {/* ═══════════════════════════════════════════
          SECTION 2: PHILOSOPHY — CHAR REVEAL
          ═══════════════════════════════════════════ */}
      <section className="relative py-32 md:py-48 px-6 md:px-12 lg:px-24 bg-[#080914]">
        <div className="max-w-5xl mx-auto">
          <span className="font-orbitron text-xs tracking-[0.4em] text-indigo-400/50 block mb-12">THE CLOUD ETHOS</span>
          <CharReveal
            text="DevOps should not feel like wrangling legacy YAML files in the dark. Vortex turns complex distributed cloud infrastructure into an intuitive visual workflow engine that deploys instantly, scales automatically, and monitors continuously without developer friction."
            className="text-3xl md:text-5xl lg:text-6xl font-light leading-tight tracking-tight text-white"
            start="top 80%"
            end="bottom 30%"
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 3: MARQUEE BAND
          ═══════════════════════════════════════════ */}
      <section className="border-y border-indigo-500/10 bg-indigo-500/[0.02]">
        <MarqueeText
          items={['SCALE', 'DEPLOY', 'MONITOR', 'OPTIMIZE', 'SERVERLESS', 'KUBERNETES']}
          speed={22}
          separator="⚙️"
          className="text-indigo-400/15"
        />
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 4: HORIZONTAL SCROLL — PLATFORM MODULES
          ═══════════════════════════════════════════ */}
      <section className="bg-[#080914]">
        <div className="py-20 px-6 md:px-12">
          <div className="flex items-baseline justify-between mb-4 max-w-7xl mx-auto">
            <div>
              <span className="font-orbitron text-xs tracking-[0.4em] text-indigo-400/50 block mb-3">SYSTEM SUITE</span>
              <h2 className="font-orbitron text-4xl md:text-6xl font-black tracking-tight">
                FRESH <span className="font-light italic text-indigo-300/70">Modules</span>
              </h2>
            </div>
            <span className="hidden md:block font-orbitron text-xs tracking-widest text-white/20">SCROLL →</span>
          </div>
        </div>

        <HorizontalScrollPin className="bg-[#080914]" scrollMultiplier={4}>
          {MODULES.map((item, i) => (
            <div
              key={i}
              className={`flex-shrink-0 w-[85vw] md:w-[45vw] h-[75vh] rounded-3xl overflow-hidden border border-indigo-500/20 bg-gradient-to-br ${item.gradient} p-10 md:p-14 flex flex-col justify-between group hover:border-indigo-400/40 transition-colors duration-500`}
            >
              <div>
                <div className="flex justify-between items-start">
                  <span className="font-orbitron text-xs tracking-[0.3em] text-indigo-400/60 block mb-2">{item.subtitle}</span>
                  <span className="font-orbitron text-xs font-bold text-indigo-300 bg-indigo-500/20 px-4 py-1.5 rounded-full border border-indigo-500/30">
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
        src="/images/categories/saas.jpg"
        alt="Vortex Infrastructure Control Room"
        height="70vh"
        parallaxAmount={80}
        initialScale={1.1}
        overlayColor="rgba(8,9,20,0.4)"
        className="border-y border-indigo-500/10"
      >
        <div className="text-center">
          <span className="font-orbitron text-xs tracking-[0.4em] text-indigo-400/50 block mb-4">WORLDWIDE EDGE DISTRIBUTE</span>
          <h2 className="font-orbitron text-5xl md:text-8xl font-black tracking-tighter text-white">
            DEPLOY AT <span className="text-indigo-400">SPEED</span>
          </h2>
        </div>
      </ParallaxImage>

      {/* ═══════════════════════════════════════════
          SECTION 6: STAGGERED PLATFORM METRICS
          ═══════════════════════════════════════════ */}
      <section className="py-32 px-6 md:px-12 bg-[#080914]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="font-orbitron text-xs tracking-[0.4em] text-indigo-400/50 block mb-3">PERFORMANCE BENCHMARKS</span>
            <h2 className="font-orbitron text-4xl md:text-6xl font-black tracking-tight text-white">
              VORTEX <span className="text-indigo-400">TELEMETRY</span>
            </h2>
          </div>

          <StaggerGrid columns="grid-cols-2 md:grid-cols-3" gap="gap-6" stagger={0.1}>
            {SAAS_METRICS.map((metric) => (
              <div key={metric.label} className="p-8 md:p-10 border border-indigo-500/15 bg-indigo-950/20 rounded-2xl text-center group hover:border-indigo-400/30 transition-all duration-500">
                <span className="font-orbitron text-[10px] tracking-[0.3em] text-indigo-300/40 block mb-4">{metric.label}</span>
                <div className="font-orbitron text-4xl md:text-5xl font-black text-white mb-1">{metric.value}</div>
                <span className="font-orbitron text-xs tracking-widest text-indigo-400">{metric.unit}</span>
              </div>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 7: INTEGRATIONS GRID
          ═══════════════════════════════════════════ */}
      <section className="py-32 px-6 md:px-12 bg-[#05060d] border-y border-indigo-500/10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <span className="font-orbitron text-xs tracking-[0.4em] text-indigo-400/50 block mb-3">ECOSYSTEM INTEGRATIONS</span>
            <h2 className="font-orbitron text-4xl md:text-6xl font-black tracking-tight text-white">
              CONNECT <span className="font-light italic text-indigo-300/70">Any Stack</span>
            </h2>
          </div>

          <StaggerGrid columns="grid-cols-1 md:grid-cols-2 lg:grid-cols-3" gap="gap-6" stagger={0.1}>
            {INTEGRATIONS.map((integ) => (
              <div key={integ.title} className="p-8 border border-indigo-500/15 bg-indigo-950/20 rounded-2xl group hover:border-indigo-400/40 transition-all duration-500">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{integ.icon}</div>
                <h3 className="font-orbitron text-base font-bold mb-2 text-white">{integ.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{integ.desc}</p>
              </div>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 8: 3D CARD & PIPELINE BUILDER (existing)
          ═══════════════════════════════════════════ */}
      <section className="saas-reveal py-24 px-4 bg-gradient-to-b from-[#080914] via-[#0d0f24] to-[#080914] border-y border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="font-orbitron text-xs text-indigo-400 tracking-[0.3em] uppercase block mb-3">WORKFLOW GRAPH ARCHITECTURE</span>
            <h2 className="font-orbitron text-3xl md:text-5xl font-black tracking-wider text-white">
              INTERACTIVE <span className="text-purple-400">NODE PIPELINE</span>
            </h2>
          </div>

          {/* 3D Card */}
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative rounded-3xl overflow-hidden border border-indigo-500/30 shadow-2xl shadow-indigo-500/10 bg-[#0a0b1c] transition-transform duration-200 ease-out mb-12"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="relative h-[360px] md:h-[500px] overflow-hidden">
              <img src="/images/categories/saas.jpg" alt="Vortex SaaS Dashboard Screen" className="w-full h-full object-cover transition-all duration-700 hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080914] via-black/50 to-transparent" />

              <div className="absolute top-6 left-6 flex items-center gap-3 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full border border-indigo-500/30">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-ping" />
                <span className="font-orbitron text-xs tracking-widest text-indigo-300">CLUSTER: 12 GLOBAL REGIONS</span>
              </div>
            </div>
          </div>

          {/* Pipeline Node Inspector */}
          <div className="p-8 border border-indigo-500/20 bg-indigo-950/20 rounded-2xl">
            <h3 className="font-orbitron text-xl font-bold text-indigo-400 mb-6">EVENT GRAPH NODE INSPECTOR</h3>
            <div className="flex flex-wrap gap-4 mb-8">
              {NODES.map((node) => (
                <button key={node.id} onClick={() => setActiveNode(node)}
                  className={`px-5 py-3 rounded-xl font-orbitron text-xs border transition cursor-none flex items-center gap-3 ${
                    activeNode.id === node.id ? node.color + ' shadow-lg border-2' : 'border-white/10 bg-white/5 text-white/50 hover:text-white'
                  }`}
                >
                  <span>{node.label}</span>
                  <span className="text-[10px] opacity-60">[{node.status}]</span>
                </button>
              ))}
            </div>

            <div className="p-6 rounded-xl bg-black/70 border border-indigo-500/30 font-mono text-xs text-indigo-200">
              <div className="flex justify-between border-b border-indigo-500/20 pb-3 mb-4">
                <span className="text-indigo-400 font-bold">NODE ID: {activeNode.id.toUpperCase()}</span>
                <span className="text-green-400">HEALTH: 100% OPERATIONAL</span>
              </div>
              <p className="text-white/60 mb-2">TYPE: {activeNode.type.toUpperCase()} // STATUS: {activeNode.status}</p>
              <p className="text-white/40">DISPATCH LATENCY: 0.12ms // MEMORY CONSUMPTION: 4.2MB // THREAD ISOLATE: V8-CORE-04</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 9: PRICING PLANS (existing)
          ═══════════════════════════════════════════ */}
      <section className="saas-reveal py-24 px-4 max-w-5xl mx-auto">
        <div className="flex flex-col items-center mb-16">
          <h2 className="font-orbitron text-3xl md:text-5xl font-bold tracking-wider text-white mb-6">
            INFRASTRUCTURE <span className="text-indigo-400">PRICING</span>
          </h2>
          <div className="flex items-center gap-4 bg-white/5 p-1.5 rounded-full border border-white/10">
            <button onClick={() => setIsAnnual(false)} className={`px-5 py-2 rounded-full font-orbitron text-xs transition ${!isAnnual ? 'bg-indigo-500 text-white' : 'text-white/50'}`}>MONTHLY</button>
            <button onClick={() => setIsAnnual(true)} className={`px-5 py-2 rounded-full font-orbitron text-xs transition ${isAnnual ? 'bg-indigo-500 text-white' : 'text-white/50'}`}>ANNUAL (SAVE 20%)</button>
          </div>
        </div>

        <StaggerGrid columns="grid-cols-1 md:grid-cols-3" gap="gap-6" stagger={0.12}>
          {[
            { tier: 'Developer', price: isAnnual ? 29 : 39, features: ['1M monthly execution credits', '5 global edge locations', 'Community Discord support'] },
            { tier: 'Team Scale', price: isAnnual ? 149 : 189, features: ['25M monthly execution credits', '285 POP global edge mesh', 'SOC2 compliance logs', 'Priority SLA 99.99%'], popular: true },
            { tier: 'Enterprise Node', price: isAnnual ? 499 : 599, features: ['Unlimited execution credits', 'Dedicated isolated VPC clusters', '24/7 dedicated DevOps engineer', 'Custom HSM secret vault'] },
          ].map((plan) => (
            <div key={plan.tier} className={`relative p-8 rounded-2xl border transition-all duration-500 flex flex-col justify-between min-h-[420px] ${
              plan.popular ? 'border-indigo-500 bg-gradient-to-b from-indigo-500/10 to-purple-500/5 shadow-lg shadow-indigo-500/10' : 'border-white/10 bg-white/[0.01]'
            }`}>
              {plan.popular && <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1 bg-indigo-500 text-white text-[10px] font-orbitron tracking-widest rounded-full">MOST POPULAR</div>}
              <div>
                <h3 className="font-orbitron text-lg font-bold mb-3">{plan.tier}</h3>
                <div className="font-orbitron text-4xl font-black text-white mb-8">
                  <AnimatedCounter end={plan.price} prefix="$" suffix="" /><span className="text-sm font-normal text-white/35">/mo</span>
                </div>
                <ul className="space-y-4">
                  {plan.features.map((f) => <li key={f} className="font-inter text-xs text-white/50 flex items-center gap-2"><span className="text-indigo-400">✓</span> {f}</li>)}
                </ul>
              </div>
              <button className={`w-full py-3.5 rounded-lg font-orbitron text-xs font-bold tracking-wider mt-8 ${plan.popular ? 'bg-indigo-500 text-white' : 'border border-white/10 text-white/60 hover:border-indigo-500/50'}`}>START FREE TRIAL</button>
            </div>
          ))}
        </StaggerGrid>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 10: LARGE CTA FOOTER
          ═══════════════════════════════════════════ */}
      <section className="py-40 px-6 text-center bg-gradient-to-t from-black to-[#080914] border-t border-indigo-500/10">
        <span className="font-orbitron text-xs tracking-[0.4em] text-indigo-400/30 block mb-8">LAUNCH YOUR CLOUD PIPELINE</span>
        <h2 className="font-orbitron text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-6 text-white">
          BUILD WITH <span className="text-indigo-400">VORTEX</span>
        </h2>
        <p className="text-white/40 text-base md:text-lg mb-12 max-w-lg mx-auto leading-relaxed">
          Deploy your first serverless workflow in under 60 seconds with zero credit card required.
        </p>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 60px rgba(99,102,241,0.4)' }}
          whileTap={{ scale: 0.95 }}
          className="px-14 py-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-orbitron text-sm tracking-widest font-bold transition duration-300 cursor-none rounded-full"
          data-cursor-label="LAUNCH NOW"
        >
          CREATE FREE ACCOUNT
        </motion.button>

        <div className="mt-24 flex flex-wrap justify-center gap-12 text-white/20 font-orbitron text-[10px] tracking-[0.3em]">
          <span>VORTEX MESH © 2026</span>
          <span>SYSTEM STATUS: 100% OPERATIONAL</span>
          <span>TERMS & API</span>
        </div>
      </section>
    </div>
  );
};

export default SaaSPage;
