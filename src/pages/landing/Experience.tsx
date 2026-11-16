import React, { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Briefcase, Calendar } from 'lucide-react';
import { experience } from '../../data/personalInfo';

export const Experience: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-60px' });

  // Scrubbed Glowing Red Line that draws down on scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start center', 'end center'],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative min-h-screen py-24 sm:py-32 bg-[#050505] overflow-hidden select-none border-t border-white/[0.04]"
    >
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-0 w-80 h-80 rounded-full bg-[#E62429]/05 blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-[1px] w-6 bg-[#E62429]" />
            <span className="font-mono text-xs font-semibold tracking-[0.25em] text-[#E62429] uppercase">
              03 // CAREER TRAJECTORY
            </span>
            <span className="h-[1px] w-6 bg-[#E62429]" />
          </div>

          <h2 className="font-orbitron text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            PROFESSIONAL <span className="text-[#E62429]">EXPERIENCE</span>
          </h2>
          <p className="mt-3 max-w-xl mx-auto text-xs sm:text-sm font-mono text-neutral-400">
            Consultant delivery for international SaaS platforms, enterprise portals, and high-throughput systems.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Base Track */}
          <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-[2px] bg-neutral-900" />

          {/* Scrubbed Red Timeline */}
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-4 sm:left-6 top-0 w-[2px] bg-gradient-to-b from-[#8B0000] via-[#E62429] to-[#FF2D2D] shadow-[0_0_10px_#FF2D2D] origin-top"
          />

          {/* Experience List */}
          <div className="space-y-12">
            {experience.map((exp, idx) => (
              <div key={exp.id || idx} className="relative pl-12 sm:pl-16">
                {/* Timeline Node */}
                <div className="absolute left-4 sm:left-6 -translate-x-1/2 top-1.5 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-[#050505] border-2 border-[#E62429] shadow-[0_0_12px_#FF2D2D]">
                  <div className="h-2 w-2 rounded-full bg-[#FF2D2D]" />
                </div>

                {/* Experience Content Card */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.2 + idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-xl bg-[#0D0D0D] p-6 sm:p-7 border border-white/10 shadow-xl"
                >
                  {/* Role & Company Header */}
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono text-[#FF2D2D] uppercase font-semibold">
                        <Briefcase className="h-3.5 w-3.5" />
                        <span>{exp.company}</span>
                        <span className="text-neutral-500">•</span>
                        <span className="text-neutral-400 font-normal">{exp.status}</span>
                      </div>
                      <h3 className="mt-1 font-orbitron text-xl sm:text-2xl font-black text-white">
                        {exp.role}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 rounded-md bg-[#050505] border border-white/10 px-3 py-1 font-mono text-xs text-neutral-300">
                      <Calendar className="h-3.5 w-3.5 text-[#E62429]" />
                      <span>{exp.period}</span>
                    </div>
                  </div>

                  <p className="text-sm font-inter text-neutral-300 mb-4 leading-relaxed">
                    {exp.description}
                  </p>

                  {/* Outcome Bullets with [METRIC] */}
                  <div className="space-y-2.5">
                    {exp.highlights?.map((hl, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-300 leading-relaxed font-inter">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E62429]" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>

                  {/* Stack Chips */}
                  <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap gap-1.5">
                    {exp.tech?.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-white/10 bg-[#050505] px-2.5 py-1 font-mono text-[11px] text-neutral-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
