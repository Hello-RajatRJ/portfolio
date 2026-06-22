import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Download, FileText } from 'lucide-react';
import { personal } from '../../data/personalInfo';

export const ResumeSection: React.FC = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = personal.resume;
    link.download = 'Rajat_Ambedkar_Resume.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="resume" ref={ref} className="py-32 bg-dark-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-violet-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="font-orbitron text-primary-600 text-sm tracking-[0.3em] mb-3">05. RESUME</p>
          <h2 className="font-orbitron text-4xl md:text-5xl font-black text-slate-900">
            Download <span className="bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">Resume</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Resume preview card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="relative"
          >
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-primary-500/10 to-violet-500/10 blur-sm" />
            <div className="relative bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
              {/* Doc header */}
              <div className="p-6 border-b border-gray-150 flex items-center gap-3">
                <FileText size={20} className="text-primary-600" />
                <div>
                  <div className="font-orbitron text-sm text-slate-900 font-bold">{personal.name}</div>
                  <div className="font-inter text-xs text-slate-500">{personal.title} · Resume</div>
                </div>
              </div>
              {/* Mock resume content */}
              <div className="p-6 space-y-4">
                {['Experience', 'Projects', 'Skills', 'Education'].map((section, i) => (
                  <div key={section}>
                    <div
                      className="font-orbitron text-xs mb-2"
                      style={{ color: ['#7c3aed', '#8b5cf6', '#4f46e5', '#059669'][i] }}
                    >
                      {section.toUpperCase()}
                    </div>
                    <div className="space-y-1">
                      {[...Array(3)].map((_, j) => (
                        <div
                          key={j}
                          className="h-2 rounded-full bg-gray-100"
                          style={{ width: `${85 - j * 15}%`, opacity: 1 - j * 0.2 }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Text + download */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="space-y-6"
          >
            <p className="font-inter text-slate-700 text-lg leading-relaxed">
              My full resume details my experience, projects, technical skills, and educational background — everything a recruiter or client needs to make a decision.
            </p>
            <p className="font-inter text-slate-650 leading-relaxed">
              You can also explore the interactive 3D portfolio world to see my work in a completely unique way — drive to the Resume Zone and pick it up right from a glowing pedestal!
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                id="resume-download-btn"
                onClick={handleDownload}
                className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-orbitron text-sm tracking-widest font-bold text-white transition-all hover:brightness-110 hover:shadow-xl hover:shadow-primary-500/20 hover:-translate-y-0.5 cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
              >
                <Download size={16} />
                DOWNLOAD PDF
              </button>
            </div>

            <div className="flex items-center gap-3 font-inter text-sm text-slate-400">
              <span className="w-4 h-px bg-gray-250" />
              Or find it in the 3D game — Resume Zone, northwest area of the map
              <span className="w-4 h-px bg-gray-250" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
