import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { experience } from '../../data/personalInfo';

export const Experience: React.FC = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="experience" ref={ref} className="py-20 sm:py-32 bg-dark-800 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="font-orbitron text-primary-600 text-sm tracking-[0.3em] mb-3">03. EXPERIENCE</p>
          <h2 className="font-orbitron text-3xl md:text-4xl lg:text-5xl font-black text-slate-900">
            Work <span className="bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">History</span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary-500/50 via-violet-500/50 to-transparent origin-top"
            style={{ transform: 'translateX(-50%)' }}
          />

          {experience.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.2 + 0.3, duration: 0.7 }}
              className={`relative flex flex-col md:flex-row gap-4 md:gap-8 mb-10 md:mb-16 ${
                i % 2 === 0 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Content card */}
              <div className="flex-1 md:max-w-[calc(50%-2rem)]">
                <div
                  className="bg-white border border-gray-200 hover:border-primary-300 rounded-2xl p-6 transition-all duration-300 hover:bg-primary-50/5 shadow-sm group cursor-default"
                  style={{ '--accent': exp.color } as React.CSSProperties}
                >
                  {/* Role & period */}
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-orbitron text-slate-900 font-bold text-lg">{exp.role}</h3>
                      <p className="font-inter text-sm mt-0.5" style={{ color: exp.color }}>{exp.company}</p>
                    </div>
                    <span className="font-orbitron text-xs text-slate-500 border border-gray-200 rounded-full px-3 py-1 bg-gray-50">
                      {exp.period}
                    </span>
                  </div>

                  <p className="font-inter text-slate-600 text-sm leading-relaxed mb-4">{exp.description}</p>

                  {/* Highlights */}
                  <ul className="space-y-2 mb-4">
                    {exp.highlights.map((h, hi) => (
                      <li key={hi} className="flex items-start gap-2 font-inter text-sm text-slate-600">
                        <span className="mt-1 shrink-0" style={{ color: exp.color }}>◆</span>
                        {h}
                      </li>
                    ))}
                  </ul>

                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-2">
                    {exp.tech.map((t) => (
                      <span
                        key={t}
                        className="font-orbitron text-xs px-2 py-0.5 rounded-md border"
                        style={{ borderColor: `${exp.color}40`, color: exp.color, background: `${exp.color}10` }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Timeline dot (desktop) */}
              <div className="hidden md:flex items-start justify-center w-16 shrink-0">
                <div
                  className="w-4 h-4 rounded-full mt-6 border-2 border-white"
                  style={{ background: exp.color, boxShadow: `0 0 12px ${exp.color}` }}
                />
              </div>

              {/* Spacer for alternating layout */}
              <div className="hidden md:block flex-1" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
