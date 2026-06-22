import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { skills } from '../../data/personalInfo';

const categories = ['Frontend', '3D / WebGL', 'Backend', 'Tools'];

const categoryColor: Record<string, string> = {
  'Frontend': '#7c3aed', // Purple
  '3D / WebGL': '#4f46e5', // Indigo
  'Backend': '#8b5cf6', // Violet
  'Tools': '#059669', // Emerald
};

export const Skills: React.FC = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="skills" ref={ref} className="py-32 bg-dark-900 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="font-orbitron text-primary-600 text-sm tracking-[0.3em] mb-3">02. SKILLS</p>
          <h2 className="font-orbitron text-4xl md:text-5xl font-black text-slate-900">
            Tech <span className="bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">Arsenal</span>
          </h2>
        </motion.div>

        {categories.map((cat, catIdx) => (
          <div key={cat} className="mb-12">
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: catIdx * 0.1, duration: 0.5 }}
              className="font-orbitron text-sm tracking-widest mb-6 flex items-center gap-3"
              style={{ color: categoryColor[cat] }}
            >
              <span className="w-8 h-px" style={{ background: categoryColor[cat] }} />
              {cat.toUpperCase()}
            </motion.h3>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.filter((s) => s.category === cat).map((skill, i) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: catIdx * 0.1 + i * 0.05, duration: 0.5 }}
                  className="group bg-white border border-gray-200 hover:border-primary-300 rounded-xl p-4 transition-all duration-300 hover:bg-primary-50/10 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{skill.icon}</span>
                      <span className="font-inter text-slate-800 text-sm font-semibold">{skill.name}</span>
                    </div>
                    <span className="font-orbitron text-xs" style={{ color: categoryColor[cat] }}>
                      {skill.level}%
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
                      transition={{ delay: catIdx * 0.1 + i * 0.05 + 0.3, duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${categoryColor[cat]}, ${categoryColor[cat]}88)` }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
