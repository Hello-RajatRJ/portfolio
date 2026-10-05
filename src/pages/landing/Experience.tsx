import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { experience } from '../../data/personalInfo';

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

const cardSlideLeft = {
  hidden: { opacity: 0, x: -80, rotateY: 5 },
  visible: {
    opacity: 1,
    x: 0,
    rotateY: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] },
  },
};

const cardSlideRight = {
  hidden: { opacity: 0, x: 80, rotateY: -5 },
  visible: {
    opacity: 1,
    x: 0,
    rotateY: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] },
  },
};

export const Experience: React.FC = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  // Map experience colors to red shades
  const redShades = ['#dc2626', '#ef4444', '#b91c1c', '#f87171', '#991b1b'];
  const getRedColor = (index: number) => redShades[index % redShades.length];

  return (
    <section id="experience" ref={ref} className="py-20 sm:py-32 bg-dark-800 relative overflow-hidden">
      {/* Animated glow */}
      <motion.div
        animate={{ x: [0, 20, 0], scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
        className="absolute bottom-0 left-0 w-80 h-80 bg-red-600/5 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={sectionHeader}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-center mb-16"
        >
          <p className="font-orbitron text-red-500 text-sm tracking-[0.3em] mb-3">03. EXPERIENCE</p>
          <h2 className="font-orbitron text-3xl md:text-4xl lg:text-5xl font-black text-white">
            Work <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">History</span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line — draw down animation */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-red-600/50 via-red-500/30 to-transparent origin-top"
            style={{ transform: 'translateX(-50%)' }}
          />

          {experience.map((exp, i) => {
            const accentColor = getRedColor(i);
            return (
              <motion.div
                key={exp.id}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                variants={i % 2 === 0 ? cardSlideLeft : cardSlideRight}
                transition={{ delay: i * 0.25 + 0.3 }}
                className={`relative flex flex-col md:flex-row gap-4 md:gap-8 mb-10 md:mb-16 ${
                  i % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Content card */}
                <div className="flex-1 md:max-w-[calc(50%-2rem)]">
                  <motion.div
                    whileHover={{
                      scale: 1.03,
                      y: -6,
                      boxShadow: `0 20px 50px ${accentColor}20`,
                      borderColor: accentColor,
                      transition: { type: 'spring', stiffness: 300, damping: 15 },
                    }}
                    className="bg-neutral-950 border border-neutral-800 hover:border-red-700 rounded-2xl p-6 transition-colors duration-300 shadow-sm group cursor-default"
                    style={{ '--accent': accentColor } as React.CSSProperties}
                  >
                    {/* Role & period */}
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="font-orbitron text-white font-bold text-lg">{exp.role}</h3>
                        <p className="font-inter text-sm mt-0.5" style={{ color: accentColor }}>{exp.company}</p>
                      </div>
                      <span className="font-orbitron text-xs text-neutral-500 border border-neutral-700 rounded-full px-3 py-1 bg-neutral-900">
                        {exp.period}
                      </span>
                    </div>

                    <p className="font-inter text-neutral-400 text-sm leading-relaxed mb-4">{exp.description}</p>

                    {/* Highlights — staggered reveal */}
                    <motion.ul
                      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: i * 0.2 + 0.5 } } }}
                      initial="hidden"
                      animate={inView ? 'visible' : 'hidden'}
                      className="space-y-2 mb-4"
                    >
                      {exp.highlights.map((h, hi) => (
                        <motion.li
                          key={hi}
                          variants={{
                            hidden: { opacity: 0, x: -15 },
                            visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
                          }}
                          className="flex items-start gap-2 font-inter text-sm text-neutral-400"
                        >
                          <span className="mt-1 shrink-0" style={{ color: accentColor }}>◆</span>
                          {h}
                        </motion.li>
                      ))}
                    </motion.ul>

                    {/* Tech tags — stagger pop */}
                    <motion.div
                      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04, delayChildren: i * 0.2 + 0.7 } } }}
                      initial="hidden"
                      animate={inView ? 'visible' : 'hidden'}
                      className="flex flex-wrap gap-2"
                    >
                      {exp.tech.map((t) => (
                        <motion.span
                          key={t}
                          variants={{
                            hidden: { opacity: 0, scale: 0.7 },
                            visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 350, damping: 15 } },
                          }}
                          whileHover={{ scale: 1.1, y: -2 }}
                          className="font-orbitron text-xs px-2 py-0.5 rounded-md border"
                          style={{ borderColor: `${accentColor}40`, color: accentColor, background: `${accentColor}10` }}
                        >
                          {t}
                        </motion.span>
                      ))}
                    </motion.div>
                  </motion.div>
                </div>

                {/* Timeline dot (desktop) — pulsing glow */}
                <div className="hidden md:flex items-start justify-center w-16 shrink-0">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={inView ? { scale: 1 } : {}}
                    transition={{ delay: i * 0.25 + 0.4, type: 'spring', stiffness: 300, damping: 12 }}
                    className="w-4 h-4 rounded-full mt-6 border-2 border-black pulse-glow-node"
                    style={{ background: accentColor, boxShadow: `0 0 16px ${accentColor}` }}
                  />
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block flex-1" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
