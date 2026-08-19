import React, { useEffect, useRef, useState } from 'react';
import AnimationShowcaseButton from '../../components/AnimationShowcaseButton';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { personal } from '../../data/personalInfo';

const roles = [
  'Full-Stack Developer',
  '3D Web Engineer',
  'React Specialist',
  'UI/UX Builder',
  'Open-Source Enthusiast',
];

/* ─── Stagger Container ─── */
const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 200, damping: 20 },
  },
};

const slideRight = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] },
  },
};

export const Hero: React.FC = () => {
  const launchGame = useStore((s) => s.launchGame);
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Typewriter effect
  useEffect(() => {
    const target = roles[roleIndex];
    if (!deleting) {
      if (displayed.length < target.length) {
        const t = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 65);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setDeleting(true), 2000);
        return () => clearTimeout(t);
      }
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => {
          setDeleting(false);
          setRoleIndex((i) => (i + 1) % roles.length);
        }, 50);
        return () => clearTimeout(t);
      }
    }
  }, [displayed, deleting, roleIndex]);

  // Particle canvas background
  useEffect(() => {
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

    // Create particles
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
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
        ctx.fillStyle = `rgba(99, 102, 241, ${p.opacity})`;
        ctx.fill();
      });

      // Draw connections
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach((b) => {
          const dist = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.12 * (1 - dist / 120)})`;
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
  }, []);

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark-900">
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-radial from-primary-500/10 via-transparent to-transparent pointer-events-none" />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
        className="absolute top-0 left-0 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.08, 0.05] }}
        transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"
      />

      {/* Grid lines overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content — Stagger Container */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center px-4 max-w-4xl lg:max-w-5xl mx-auto"
      >
        {/* Availability badge */}
        <motion.div
          variants={scaleIn}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary-200 bg-primary-50 text-primary-700 text-sm font-inter mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Available for opportunities
        </motion.div>

        {/* Name */}
        <motion.h1
          variants={fadeUp}
          className="font-orbitron text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 mb-4 leading-none"
        >
          <span className="animated-gradient-text">
            {personal.name}
          </span>
        </motion.h1>

        {/* Levitating Tech Badges — staggered pop-in */}
        <motion.div
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
          className="flex flex-wrap justify-center gap-3 my-4"
        >
          {['⚛️ React 19', '🔷 TypeScript', '🟢 Node.js', '🐍 Python', '☁️ AWS/Azure', '🤖 Gemini AI'].map((tech) => (
            <motion.span
              key={tech}
              variants={{
                hidden: { opacity: 0, y: 20, scale: 0.7, rotate: -5 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  rotate: 0,
                  transition: { type: 'spring', stiffness: 300, damping: 15 },
                },
              }}
              whileHover={{
                scale: 1.12,
                y: -6,
                rotate: 2,
                boxShadow: '0 8px 25px rgba(124,58,237,0.3)',
                transition: { type: 'spring', stiffness: 400, damping: 10 },
              }}
              className="levitate-badge px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/60 text-slate-200 text-xs font-mono font-semibold shadow-lg backdrop-blur-md cursor-default"
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>

        {/* Typewriter role */}
        <motion.div
          variants={fadeUp}
          className="font-orbitron text-xl md:text-2xl text-slate-700 mb-4 h-8 flex items-center justify-center font-bold"
        >
          <span>{displayed}</span>
          <span className="ml-1 w-0.5 h-6 bg-primary-600 animate-pulse" />
        </motion.div>

        {/* Tagline */}
        <motion.p
          variants={fadeUp}
          className="font-inter text-slate-600 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          {personal.tagline}
        </motion.p>

        {/* CTA Buttons — staggered slide-in */}
        <motion.div
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          {/* View Work button */}
          <motion.button
            variants={slideRight}
            whileHover={{ scale: 1.05, y: -3, boxShadow: '0 12px 30px rgba(99,102,241,0.2)' }}
            whileTap={{ scale: 0.97 }}
            onClick={scrollToProjects}
            id="hero-view-work-btn"
            className="group px-8 py-4 rounded-xl border border-primary-300 text-primary-600 font-orbitron text-sm tracking-widest hover:bg-primary-50 transition-all duration-300 hover:shadow-md"
          >
            VIEW MY WORK
          </motion.button>

          {/* Play Game button */}
          <motion.button
            variants={slideRight}
            whileHover={{ scale: 1.05, y: -3, boxShadow: '0 12px 35px rgba(124,58,237,0.4)' }}
            whileTap={{ scale: 0.97 }}
            onClick={launchGame}
            id="hero-play-game-btn"
            className="group relative px-8 py-4 rounded-xl font-orbitron text-sm tracking-widest font-bold overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              boxShadow: '0 4px 20px rgba(124,58,237,0.3)',
            }}
          >
            <span className="relative z-10 flex items-center gap-3 text-white">
              <span className="text-lg">▶</span>
              PLAY PORTFOLIO GAME
            </span>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.button>

          {/* Animation Showcase button */}
          <motion.div variants={slideRight} className="mt-4">
            <AnimationShowcaseButton />
          </motion.div>
        </motion.div>

        {/* Stats row — count-up style stagger */}
        <motion.div
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } } }}
          className="flex flex-wrap justify-center gap-6 sm:gap-12 mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-gray-200"
        >
          {[
            { value: `${personal.yearsOfExperience}+`, label: 'Years Experience' },
            { value: '8+', label: 'Projects Delivered' },
            { value: '5+', label: 'Countries Served' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.8 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { type: 'spring', stiffness: 200, damping: 15 },
                },
              }}
              whileHover={{ scale: 1.1, y: -4, transition: { type: 'spring', stiffness: 400 } }}
              className="text-center cursor-default"
            >
              <div className="font-orbitron text-2xl sm:text-3xl font-black bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="font-inter text-slate-500 text-xs sm:text-sm mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600 text-xs font-orbitron tracking-widest"
      >
        <span>SCROLL</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-gray-600 to-transparent"
        />
      </motion.div>
    </section>
  );
};
