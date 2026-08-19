import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Download, FileText } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { personal } from '../../data/personalInfo';

/* ─── Animation Variants ─── */
const sectionHeader = {
  hidden: { opacity: 0, y: 50, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60, rotateY: 6 },
  visible: {
    opacity: 1,
    x: 0,
    rotateY: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

const slideInRight = {
  hidden: { opacity: 0, x: 60, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

export const ResumeSection: React.FC = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const openResumeBuilder = useStore((s) => s.openResumeBuilder);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = personal.resume;
    link.download = 'Rajat_Ambedkar_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="resume" ref={ref} className="py-20 sm:py-32 bg-dark-800 relative overflow-hidden">
      {/* Animated glow */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.03, 0.07, 0.03] }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
        className="absolute inset-0 bg-gradient-radial from-violet-500/5 via-transparent to-transparent pointer-events-none"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={sectionHeader}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-center mb-16"
        >
          <p className="font-orbitron text-primary-600 text-sm tracking-[0.3em] mb-3">05. RESUME</p>
          <h2 className="font-orbitron text-3xl md:text-4xl lg:text-5xl font-black text-slate-900">
            Download <span className="bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">Resume</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-8 items-center">
          {/* Resume preview card — 3D float from left */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="relative cursor-pointer"
          >
            {/* Breathing glow border */}
            <motion.div
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute -inset-px rounded-2xl bg-gradient-to-r from-primary-500/10 to-violet-500/10 blur-sm"
            />
            <motion.div
              whileHover={{
                scale: 1.04,
                y: -8,
                rotateY: 4,
                rotateX: -2,
                boxShadow: '0 24px 60px rgba(124,58,237,0.2)',
                transition: { type: 'spring', stiffness: 250, damping: 15 },
              }}
              className="relative bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg"
              style={{ transformStyle: 'preserve-3d', perspective: '800px' }}
            >
              {/* Doc header */}
              <div className="p-6 border-b border-gray-150 flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                >
                  <FileText size={20} className="text-primary-600" />
                </motion.div>
                <div>
                  <div className="font-orbitron text-sm text-slate-900 font-bold">{personal.name}</div>
                  <div className="font-inter text-xs text-slate-500">{personal.title} · Resume</div>
                </div>
              </div>
              {/* Mock resume content — staggered bars */}
              <div className="p-6 space-y-4">
                {['Experience', 'Projects', 'Skills', 'Education'].map((section, i) => (
                  <motion.div
                    key={section}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.5 + i * 0.12, duration: 0.5 }}
                  >
                    <div
                      className="font-orbitron text-xs mb-2"
                      style={{ color: ['#7c3aed', '#8b5cf6', '#4f46e5', '#059669'][i] }}
                    >
                      {section.toUpperCase()}
                    </div>
                    <div className="space-y-1">
                      {[...Array(3)].map((_, j) => (
                        <motion.div
                          key={j}
                          initial={{ width: 0 }}
                          animate={inView ? { width: `${85 - j * 15}%` } : { width: 0 }}
                          transition={{ delay: 0.6 + i * 0.12 + j * 0.06, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                          className="h-2 rounded-full bg-gray-100"
                          style={{ opacity: 1 - j * 0.2 }}
                        />
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Text + download — slide in from right */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="space-y-6"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="font-inter text-slate-700 text-lg leading-relaxed"
            >
              My full resume details my experience, projects, technical skills, and educational background — everything a recruiter or client needs to make a decision.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="font-inter text-slate-650 leading-relaxed"
            >
              You can also explore the interactive 3D portfolio world to see my work in a completely unique way — drive to the Resume Zone and pick it up right from a glowing pedestal!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.06, y: -4, boxShadow: '0 14px 40px rgba(124,58,237,0.35)' }}
                whileTap={{ scale: 0.97 }}
                id="resume-download-btn"
                onClick={handleDownload}
                className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-orbitron text-sm tracking-widest font-bold text-white transition-all cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
              >
                <Download size={16} />
                DOWNLOAD PDF
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.06, y: -4, boxShadow: '0 14px 40px rgba(16,185,129,0.2)' }}
                whileTap={{ scale: 0.97 }}
                id="resume-create-builder-btn"
                onClick={openResumeBuilder}
                className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-orbitron text-sm tracking-widest font-bold text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all cursor-pointer"
              >
                <FileText size={16} />
                BUILD FREE RESUME
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-3 font-inter text-sm text-slate-400"
            >
              <motion.span
                initial={{ width: 0 }}
                animate={inView ? { width: 16 } : { width: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="h-px bg-gray-250 inline-block"
              />
              Or find it in the 3D game — Resume Zone, northwest area of the map
              <motion.span
                initial={{ width: 0 }}
                animate={inView ? { width: 16 } : { width: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="h-px bg-gray-250 inline-block"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
