import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { animationCategories } from '../data/animationCategories';
import CategoryCard from '../components/CategoryCard';
import { ArrowLeft, FileText, Sparkles } from 'lucide-react';
import LuxuryCarPage from './showcase/LuxuryCarPage';
import RealEstatePage from './showcase/RealEstatePage';
import AIProductPage from './showcase/AIProductPage';
import NaturePage from './showcase/NaturePage';
import SaaSPage from './showcase/SaaSPage';
import PremiumProductPage from './showcase/PremiumProductPage';

// Import our new premium components
import CustomCursor from '../components/showcase/CustomCursor';
import SmoothScroll from '../components/showcase/SmoothScroll';
import TextReveal from '../components/showcase/TextReveal';
import MarqueeText from '../components/showcase/MarqueeText';
import PageTransition, { type PageTransitionHandle } from '../components/showcase/PageTransition';
import ShowcaseLoader from '../components/showcase/ShowcaseLoader';

const categoryPages: Record<string, React.FC> = {
  'luxury-car': LuxuryCarPage,
  'real-estate': RealEstatePage,
  'ai-product': AIProductPage,
  'nature': NaturePage,
  'saas': SaaSPage,
  'premium-product': PremiumProductPage,
};

const AnimationShowcase: React.FC = () => {
  const showcasePage = useStore((s) => s.showcasePage);
  const setShowcasePage = useStore((s) => s.setShowcasePage);
  const returnToLanding = useStore((s) => s.returnToLanding);
  const openResumeBuilder = useStore((s) => s.openResumeBuilder);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const transitionRef = useRef<PageTransitionHandle>(null);
  const [loadingComplete, setLoadingComplete] = useState(false);

  // Particle background
  useEffect(() => {
    if (!loadingComplete) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: Array<{ x: number; y: number; vx: number; vy: number; size: number; opacity: number }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${p.opacity})`;
        ctx.fill();
      });

      // Connections with soft gradient lines
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach((b) => {
          const dist = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
          if (dist < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.09 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        });
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [loadingComplete]);

  // Page navigation wrapper with cinematic overlay transitions
  const handleNavigateToCategory = (slug: string) => {
    if (transitionRef.current) {
      transitionRef.current.play(() => {
        setShowcasePage(slug);
        const container = document.getElementById('showcase-scroll-container');
        if (container) container.scrollTop = 0;
      });
    } else {
      setShowcasePage(slug);
      const container = document.getElementById('showcase-scroll-container');
      if (container) container.scrollTop = 0;
    }
  };

  const handleBackToGrid = () => {
    if (transitionRef.current) {
      transitionRef.current.play(() => {
        setShowcasePage(null);
        const container = document.getElementById('showcase-scroll-container');
        if (container) container.scrollTop = 0;
      });
    } else {
      setShowcasePage(null);
      const container = document.getElementById('showcase-scroll-container');
      if (container) container.scrollTop = 0;
    }
  };

  const handleExitShowcase = () => {
    if (transitionRef.current) {
      transitionRef.current.play(() => {
        returnToLanding();
        const container = document.getElementById('showcase-scroll-container');
        if (container) container.scrollTop = 0;
      });
    } else {
      returnToLanding();
      const container = document.getElementById('showcase-scroll-container');
      if (container) container.scrollTop = 0;
    }
  };

  // If a category page is selected, render it in a clean wrapper with custom cursor
  if (showcasePage) {
    const PageComponent = categoryPages[showcasePage];
    if (PageComponent) {
      return (
        <div className="relative min-h-screen bg-black text-white showcase-cursor-hide">
          <CustomCursor />
          <PageTransition ref={transitionRef} />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={showcasePage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative min-h-screen"
            >
              {/* Floating Back Button */}
              <button
                onClick={handleBackToGrid}
                className="fixed top-6 left-6 z-50 flex items-center gap-2 px-5 py-2.5 rounded-full font-orbitron text-xs tracking-widest text-white border border-white/10 hover:border-white/30 bg-black/60 backdrop-blur-md hover:bg-black/85 transition-all duration-300 shadow-lg shadow-black/40 cursor-none"
                data-cursor-label="GO BACK"
              >
                <ArrowLeft size={14} />
                BACK TO SHOWCASE
              </button>
              
              <SmoothScroll>
                <PageComponent />
              </SmoothScroll>
            </motion.div>
          </AnimatePresence>
        </div>
      );
    }
  }

  return (
    <>
      <PageTransition ref={transitionRef} />
      
      {!loadingComplete && (
        <ShowcaseLoader onComplete={() => setLoadingComplete(true)} duration={2.0} />
      )}

      {loadingComplete && (
        <div className="relative min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden showcase-cursor-hide">
          {/* Custom Cursor system */}
          <CustomCursor />

          {/* Smooth Lenis Scroll */}
          <SmoothScroll>
            {/* Particle canvas */}
            <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />

            {/* Futuristic blurred radial background blobs */}
            <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[130px] pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[110px] pointer-events-none" />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[160px] pointer-events-none" />

            {/* Back to portfolio button */}
            <motion.button
              onClick={handleExitShowcase}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="fixed top-6 left-6 z-50 flex items-center gap-2 px-5 py-2.5 rounded-full font-orbitron text-xs tracking-widest text-white/60 hover:text-white border border-white/10 hover:border-white/30 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all duration-300 cursor-none"
              data-cursor-label="PORTFOLIO"
            >
              <ArrowLeft size={14} />
              PORTFOLIO
            </motion.button>

            {/* Hero Section */}
            <section className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 pt-32 pb-16">
              {/* Interactive Experience Badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-xs font-orbitron tracking-wider text-white/70 mb-8"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                INTERACTIVE EXPERIENCES
              </motion.div>

              {/* Text line mask reveal */}
              <TextReveal
                text="Animation\nShowcase"
                as="h1"
                className="font-orbitron text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-center leading-[1.02] tracking-tight mb-8"
                stagger={0.15}
              />

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="max-w-2xl text-center text-white/55 font-inter text-base md:text-lg leading-relaxed mb-12"
              >
                Explore a series of bespoke, high-end landing pages designed to demonstrate
                advanced frontend scrolling dynamics, creative clip reveals, and responsive web aesthetics.
              </motion.p>

              {/* Scroll indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
                className="flex flex-col items-center gap-2 text-white/20"
              >
                <span className="font-orbitron text-[9px] tracking-[0.4em] uppercase">SCROLL TO CHOOSE</span>
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent"
                />
              </motion.div>
            </section>

            {/* Infinite Horizontal Marquee */}
            <section className="relative z-10 w-full overflow-hidden border-y border-white/5 bg-white/[0.01] backdrop-blur-xs mb-20">
              <MarqueeText
                items={['Luxury Car', 'Real Estate', 'AI Platform', 'Nature & Eco', 'SaaS Suite', 'Premium Tech']}
                speed={25}
                className="text-white/20 hover:text-white/50 transition-colors duration-500"
              />
            </section>

            {/* Category Cards Grid */}
            <section className="relative z-10 px-4 sm:px-6 lg:px-8 pb-32 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {animationCategories.map((cat, i) => (
                  <CategoryCard
                    key={cat.slug}
                    title={cat.title}
                    subtitle={cat.subtitle}
                    icon={cat.icon}
                    imageSrc={cat.imageSrc}
                    slug={cat.slug}
                    index={i}
                    gradient={cat.gradient}
                    accentColor={cat.accentColor}
                    badge={cat.badge}
                    onClick={() => handleNavigateToCategory(cat.slug)}
                  />
                ))}
              </div>
            </section>

            {/* Resume Builder Showcase Callout Section */}
            <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 mb-24">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-indigo-950/40 via-purple-950/20 to-slate-950/80 p-8 sm:p-12 text-center backdrop-blur-xl shadow-2xl"
              >
                {/* Background ambient glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-orbitron tracking-widest uppercase">
                    <Sparkles size={14} className="text-purple-400" />
                    POWERFUL ATS RESUME ARCHITECT
                  </div>

                  <h2 className="font-orbitron text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                    BUILD YOUR FREE <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">ATS-FRIENDLY RESUME</span>
                  </h2>

                  <p className="max-w-2xl mx-auto font-inter text-slate-300 text-sm sm:text-base leading-relaxed">
                    Craft modern, recruiter-approved resumes with real-time ATS optimization scoring, AI-driven description suggestions, Job Description matching, and free exportable templates.
                  </p>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: '0 0 35px rgba(99, 102, 241, 0.5)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={openResumeBuilder}
                      className="flex items-center gap-3 px-8 py-4 rounded-2xl font-orbitron text-sm tracking-widest font-black text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 shadow-xl hover:brightness-110 transition-all duration-300 cursor-none"
                      data-cursor-label="BUILD NOW"
                    >
                      <FileText size={18} />
                      CREATE YOUR RESUME
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/5 py-12 text-center">
              <p className="font-orbitron text-xs tracking-wider text-white/25 uppercase">
                AWARDS-GRADE FRONTEND DEVELOPMENT © 2026
              </p>
              <p className="font-inter text-xs text-white/15 mt-2">
                Built with GSAP ScrollTrigger, Lenis, Framer Motion, and Tailwind CSS.
              </p>
            </footer>
          </SmoothScroll>
        </div>
      )}
    </>
  );
};

export default AnimationShowcase;
