import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { personal } from '../../data/personalInfo';

/* ─── Animation Variants ─── */
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 50, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] },
  },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] },
  },
};

const slideInRight = {
  hidden: { opacity: 0, x: 60, rotateY: 8 },
  visible: {
    opacity: 1,
    x: 0,
    rotateY: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] },
  },
};

const factCardVariant = {
  hidden: { opacity: 0, y: 30, scale: 0.85 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 250, damping: 18 },
  },
};

const codeSnippet = `// Building the future, one commit at a time
const developer = {
  name: "${personal.firstName}",
  passion: "Immersive web experiences",
  currentlyLearning: "WebGPU & AI Agents",
  stack: ["React", "Three.js", "Node.js"],
  coffeePerDay: "∞",
};

const buildGreatThings = async () => {
  while (true) {
    await learn();
    await build();
    await ship();
  }
};`;

export const About: React.FC = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="about" ref={ref} className="py-32 bg-dark-800 relative overflow-hidden">
      {/* Animated background glow */}
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.15, 1] }}
        transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut' }}
        className="absolute top-1/2 left-0 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none"
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Section heading */}
        <motion.div variants={fadeUp} className="text-center mb-16">
          <motion.p
            variants={fadeUp}
            className="font-orbitron text-primary-600 text-sm tracking-[0.3em] mb-3"
          >
            01. ABOUT ME
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="font-orbitron text-3xl md:text-4xl lg:text-5xl font-black text-slate-900"
          >
            Who I <span className="bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">Am</span>
          </motion.h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Text side — slide in from left */}
          <motion.div variants={slideInLeft} className="space-y-6">
            <motion.p
              variants={fadeUp}
              className="font-inter text-slate-700 text-lg leading-relaxed"
            >
              {personal.bio}
            </motion.p>
            <motion.p
              variants={fadeUp}
              className="font-inter text-slate-600 leading-relaxed"
            >
              When I'm not writing code, I'm exploring the intersection of web technology and game design —
              which is why I built this portfolio as an interactive 3D experience you can actually <em className="text-primary-600 font-semibold not-italic">drive through</em>.
            </motion.p>
            <motion.p
              variants={fadeUp}
              className="font-inter text-slate-600 leading-relaxed"
            >
              I've had the privilege of working with clients across <span className="text-slate-850 font-semibold">Australia, Taiwan, the United States, India, and Armenia</span> — 
              delivering everything from healthcare platforms to AI-powered communication tools.
            </motion.p>

            {/* Quick facts — staggered spring cards */}
            <motion.div
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } } }}
              className="grid grid-cols-2 gap-4 pt-4"
            >
              {[
                { label: 'Location', value: personal.location },
                { label: 'Experience', value: `${personal.yearsOfExperience}+ Years` },
                { label: 'Status', value: personal.availableForWork ? '✅ Open to Work' : 'Engaged' },
                { label: 'Focus', value: 'Full-Stack + 3D Web' },
              ].map((fact) => (
                <motion.div
                  key={fact.label}
                  variants={factCardVariant}
                  whileHover={{
                    scale: 1.06,
                    y: -6,
                    boxShadow: '0 16px 40px rgba(99,102,241,0.15)',
                    borderColor: 'rgba(99,102,241,0.6)',
                    transition: { type: 'spring', stiffness: 400, damping: 12 },
                  }}
                  className="bg-white border border-gray-250 hover:border-indigo-400 rounded-xl p-4 shadow-sm transition-colors"
                >
                  <div className="font-orbitron text-xs text-indigo-600 tracking-widest mb-1 font-bold">{fact.label.toUpperCase()}</div>
                  <div className="font-inter text-slate-950 font-bold text-sm">{fact.value}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Code block side — 3D rotate in from right */}
          <motion.div variants={slideInRight} className="relative">
            {/* Glow border */}
            <motion.div
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute -inset-px rounded-2xl bg-gradient-to-r from-primary-500/20 via-violet-500/20 to-indigo-500/20 blur-sm"
            />
            <motion.div
              whileHover={{
                rotateY: 3,
                rotateX: -2,
                scale: 1.02,
                boxShadow: '0 20px 60px rgba(124,58,237,0.15)',
                transition: { type: 'spring', stiffness: 200, damping: 20 },
              }}
              className="relative bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-md"
              style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
            >
              {/* Window bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 bg-gray-50">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 3, delay: 0 }}
                  className="w-3 h-3 rounded-full bg-red-500/60"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
                  className="w-3 h-3 rounded-full bg-yellow-500/60"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 3, delay: 1 }}
                  className="w-3 h-3 rounded-full bg-green-500/60"
                />
                <span className="ml-3 font-mono text-xs text-slate-500">developer.ts</span>
              </div>
              {/* Code */}
              <pre className="p-4 sm:p-6 text-xs sm:text-sm font-mono overflow-x-auto">
                <code className="text-slate-800 whitespace-pre">
                  {codeSnippet.split('\n').map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.6 + i * 0.04, duration: 0.4 }}
                      className="flex"
                    >
                      <span className="text-slate-400 select-none w-6 mr-4 text-right shrink-0">{i + 1}</span>
                      <span dangerouslySetInnerHTML={{
                        __html: line
                          .replace(/(\".*?\")/g, '<span style="color:#059669">$1</span>')
                          .replace(/\b(const|async|await|while|true|return)\b/g, '<span style="color:#7c3aed;font-weight:bold">$1</span>')
                          .replace(/\/\/.*/g, '<span style="color:#64748b">$&</span>')
                          .replace(/\b(name|passion|stack|coffeePerDay)\b/g, '<span style="color:#2563eb">$&</span>')
                      }} />
                    </motion.div>
                  ))}
                </code>
              </pre>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};
