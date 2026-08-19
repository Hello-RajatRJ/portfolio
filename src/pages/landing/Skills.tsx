import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { skills } from '../../data/personalInfo';

const defaultColors = [
  '#7c3aed', // Purple
  '#4f46e5', // Indigo
  '#8b5cf6', // Violet
  '#059669', // Emerald
  '#2563eb', // Blue
  '#db2777', // Pink
  '#ea580c', // Orange
  '#16a34a', // Green
  '#ca8a04', // Yellow
];

// Extract unique categories directly from the skills array
const categories = Array.from(new Set(skills.map(s => s.category)));

// Dynamically assign colors
const categoryColor: Record<string, string> = {};
categories.forEach((cat, index) => {
  categoryColor[cat] = defaultColors[index % defaultColors.length];
});

/* ─── Animation Variants ─── */
const sectionHeader = {
  hidden: { opacity: 0, y: 50, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] },
  },
};

const categoryTitle = {
  hidden: { opacity: 0, x: -30, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] },
  },
};

const skillCard = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 220, damping: 18 },
  },
};

export const Skills: React.FC = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="skills" ref={ref} className="py-20 sm:py-32 bg-dark-900 relative overflow-hidden">
      {/* Animated glow */}
      <motion.div
        animate={{ x: [0, -20, 0], y: [0, 15, 0] }}
        transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
        className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={sectionHeader}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-center mb-16"
        >
          <p className="font-orbitron text-primary-600 text-sm tracking-[0.3em] mb-3">02. SKILLS</p>
          <h2 className="font-orbitron text-3xl md:text-4xl lg:text-5xl font-black text-slate-900">
            Tech <span className="bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">Arsenal</span>
          </h2>
        </motion.div>

        {categories.map((cat, catIdx) => (
          <motion.div
            key={cat}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: catIdx * 0.15 } } }}
            className="mb-12"
          >
            <motion.h3
              variants={categoryTitle}
              className="font-orbitron text-sm tracking-widest mb-6 flex items-center gap-3"
              style={{ color: categoryColor[cat] }}
            >
              <motion.span
                initial={{ width: 0 }}
                animate={inView ? { width: 32 } : { width: 0 }}
                transition={{ delay: catIdx * 0.15, duration: 0.5 }}
                className="h-px inline-block"
                style={{ background: categoryColor[cat] }}
              />
              {cat.toUpperCase()}
            </motion.h3>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {skills.filter((s) => s.category === cat).map((skill) => (
                <motion.div
                  key={skill.name}
                  variants={skillCard}
                  whileHover={{
                    scale: 1.04,
                    y: -6,
                    boxShadow: `0 16px 40px ${categoryColor[cat]}20`,
                    borderColor: categoryColor[cat],
                    transition: { type: 'spring', stiffness: 400, damping: 12 },
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="group bg-white border border-gray-200 hover:border-primary-400 rounded-xl p-4 transition-colors duration-300 cursor-default"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <motion.span
                        whileHover={{ rotate: [0, -10, 10, -5, 0], transition: { duration: 0.5 } }}
                        className="text-xl"
                      >
                        {skill.icon}
                      </motion.span>
                      <span className="font-inter text-slate-800 text-sm font-bold">{skill.name}</span>
                    </div>
                    <span className="font-orbitron text-xs font-bold" style={{ color: categoryColor[cat] }}>
                      {skill.level}%
                    </span>
                  </div>
                  {/* Animated progress bar */}
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
                      transition={{
                        delay: catIdx * 0.15 + 0.4,
                        duration: 1.2,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="h-full rounded-full shadow-sm relative overflow-hidden"
                      style={{ background: `linear-gradient(90deg, ${categoryColor[cat]}, ${categoryColor[cat]}dd)` }}
                    >
                      {/* Shimmer effect */}
                      <motion.div
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut', delay: catIdx * 0.3 + 1 }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        style={{ width: '50%' }}
                      />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
