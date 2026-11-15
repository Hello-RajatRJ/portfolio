import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, CheckCircle2, Download, ExternalLink, FileText, GraduationCap, Sparkles } from 'lucide-react';
import { personal } from '../../data/personalInfo';
import { useStore } from '../../store/useStore';

const EDUCATION_ITEMS = [
  {
    degree: 'Master of Computer Applications (MCA)',
    institution: 'Chandigarh Group of Colleges (CGC Jhanjeri)',
    period: '2020 – 2022',
    description: 'Specialized in Advanced Web Architecture, Distributed Systems, and Object-Oriented Engineering.',
  },
  {
    degree: 'Bachelor of Computer Applications (BCA)',
    institution: 'Punjab Technical University',
    period: '2017 – 2020',
    description: 'Foundation in Data Structures, Relational Database Systems, C++, and Modern Web Development.',
  },
];

const CERTIFICATIONS = [
  {
    name: 'Advanced React & Concurrent State Architecture',
    issuer: 'Meta Verified Professional',
    year: '2023',
    badge: 'FRONTEND',
  },
  {
    name: 'Node.js Enterprise Application Engineering',
    issuer: 'Linux Foundation / OpenJS',
    year: '2023',
    badge: 'BACKEND',
  },
  {
    name: 'Three.js & Shaders Journey',
    issuer: 'Bruno Simon WebGL Academy',
    year: '2024',
    badge: '3D WEBGL',
  },
  {
    name: 'PostgreSQL Query Optimization & Database Design',
    issuer: 'Enterprise DB Specialization',
    year: '2024',
    badge: 'DATABASE',
  },
];

export const ResumeSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-60px' });
  const [isFlipped, setIsFlipped] = useState(false);
  const launchGame = useStore((s) => s.launchGame);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = personal.resume || '/CV_Rajat_Ambedkar.pdf';
    link.download = 'Rajat_Ambedkar_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewOnline = () => {
    window.open(personal.resume || '/CV_Rajat_Ambedkar.pdf', '_blank');
  };

  return (
    <section
      id="resume"
      ref={sectionRef}
      className="relative min-h-screen py-24 sm:py-32 bg-[#050505] overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="dp-halftone absolute inset-0 opacity-15 pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-96 h-96 rounded-full bg-[#E62429]/10 blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-[2px] w-8 bg-[#E62429]" />
            <span className="font-orbitron text-xs sm:text-sm font-bold tracking-[0.3em] text-[#E62429] uppercase">
              06 // DOSSIER & CREDENTIALS
            </span>
            <span className="h-[2px] w-8 bg-[#E62429]" />
          </div>

          <h2 className="font-orbitron text-3xl sm:text-5xl font-black text-white tracking-tight">
            CURRICULUM <span className="text-[#E62429] drop-shadow-[0_0_20px_rgba(230,36,41,0.6)]">VITAE</span>
          </h2>
          <p className="mt-3 max-w-xl mx-auto text-sm sm:text-base font-inter text-neutral-400">
            Comprehensive breakdown of 4+ years commercial experience, engineering milestones, and
            academic foundations.
          </p>
        </div>

        {/* 1. 3D Flipping Glass Resume Card */}
        <div className="max-w-xl mx-auto mb-16">
          <div
            onMouseEnter={() => setIsFlipped(true)}
            onMouseLeave={() => setIsFlipped(false)}
            className="relative h-[320px] w-full [perspective:1200px] cursor-pointer"
          >
            {/* Stamp Animation on Viewport Entry */}
            <motion.div
              initial={{ scale: 2.2, opacity: 0, rotate: -25 }}
              animate={inView ? { scale: 1, opacity: 1, rotate: -12 } : {}}
              transition={{ delay: 0.6, type: 'spring', stiffness: 450, damping: 15 }}
              className="absolute -top-4 -right-4 z-30 pointer-events-none rounded-xl border-2 border-[#E62429] bg-black/90 px-3.5 py-1.5 shadow-[0_0_15px_#FF2D2D]"
            >
              <div className="flex items-center gap-1.5">
                {/* Bullet puncture hole inside stamp */}
                <div className="h-2.5 w-2.5 rounded-full bg-black border border-[#FF2D2D] shadow-inner" />
                <span className="font-bangers text-xs sm:text-sm tracking-wider text-[#FF2D2D]">
                  TOP SECRET // VERIFIED CANDIDATE
                </span>
              </div>
            </motion.div>

            {/* Flipping Card Shell */}
            <div
              className={`relative h-full w-full rounded-2xl transition-transform duration-700 [transform-style:preserve-3d] ${
                isFlipped ? '[transform:rotateY(180deg)]' : ''
              }`}
            >
              {/* FRONT OF CARD */}
              <div className="absolute inset-0 h-full w-full rounded-2xl bg-[#0c0c0e]/95 border border-[#E62429]/40 p-6 sm:p-7 shadow-2xl backdrop-blur-xl [backface-visibility:hidden] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      <FileText className="h-6 w-6 text-[#E62429]" />
                      <div>
                        <h3 className="font-orbitron text-lg font-bold text-white">
                          {personal.name}
                        </h3>
                        <span className="font-mono text-xs text-[#FF2D2D]">Full-Stack Developer</span>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-neutral-400">PDF PREVIEW</span>
                  </div>

                  <p className="font-inter text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    Specialized in high-scale FinTech compliance architectures, healthcare portals,
                    and interactive 3D WebGL experiences with React 19, Node.js, and TypeScript.
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-mono text-neutral-400">
                    <div className="rounded bg-black/60 p-2 border border-white/5">
                      <span className="block text-white font-bold">4+ Years</span> Commercial Exp
                    </div>
                    <div className="rounded bg-black/60 p-2 border border-white/5">
                      <span className="block text-white font-bold">18+ Live</span> Shipped Apps
                    </div>
                  </div>
                </div>

                <div className="text-center font-bangers text-xs tracking-widest text-[#FF2D2D]">
                  🔄 HOVER TO FLIP DOSSIER
                </div>
              </div>

              {/* BACK OF CARD */}
              <div className="absolute inset-0 h-full w-full rounded-2xl bg-[#0a0a0c]/98 border border-[#FF2D2D]/60 p-6 sm:p-7 shadow-[0_0_30px_rgba(230,36,41,0.35)] backdrop-blur-xl [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col justify-between text-left">
                <div>
                  <h4 className="font-orbitron text-sm font-bold text-[#FF2D2D] mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    KEY COMPETENCIES &amp; IMPACT
                  </h4>
                  <ul className="space-y-2 font-mono text-xs text-neutral-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#E62429]" />
                      <span>CereTax Flagship: 60% report query load time reduction</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#E62429]" />
                      <span>EBMCI Taiwan: 40% latency reduction across 12k medical records</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#E62429]" />
                      <span>Knowledger: 5x vector ingestion speedup with zero drops</span>
                    </li>
                  </ul>
                </div>

                <div className="text-center font-bangers text-xs tracking-widest text-neutral-400">
                  READY TO RECRUIT · OPEN TO FULL-TIME &amp; RELOCATION
                </div>
              </div>
            </div>
          </div>

          {/* Action Triggers */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-xl px-7 py-3 font-orbitron text-xs sm:text-sm font-bold tracking-wider text-white transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg border border-[#FF2D2D]/50"
              style={{
                background: 'linear-gradient(135deg, #E62429 0%, #8B0000 100%)',
                boxShadow: '0 0 20px rgba(230,36,41,0.5)',
              }}
            >
              <Download className="h-4 w-4 text-white" />
              DOWNLOAD PDF
            </button>

            <button
              onClick={handleViewOnline}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-black/60 px-6 py-3 font-orbitron text-xs sm:text-sm font-bold tracking-wider text-neutral-200 transition-all hover:border-[#E62429] hover:bg-[#E62429]/15 hover:text-white active:scale-95 cursor-pointer backdrop-blur-md"
            >
              <ExternalLink className="h-4 w-4 text-[#FF2D2D]" />
              VIEW ONLINE
            </button>
          </div>

          {/* 3D Map Northwest Pedestal Callout Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-8 rounded-2xl border border-[#FF2D2D]/40 bg-gradient-to-r from-black/90 via-[#0e0809] to-black/90 p-5 shadow-[0_0_25px_rgba(230,36,41,0.25)] backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3.5 text-left">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#FF2D2D]/60 bg-[#E62429]/15 shadow-[0_0_15px_#FF2D2D]">
                <Sparkles className="h-6 w-6 text-[#FFD700] animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-orbitron text-xs sm:text-sm font-black text-white">
                    3D WORLD PEDESTAL:
                  </span>
                  <span className="rounded bg-[#FFD700]/15 border border-[#FFD700]/40 px-2 py-0.5 font-mono text-[10px] font-bold text-[#FFD700]">
                    NORTHWEST ZONE
                  </span>
                </div>
                <p className="mt-1 font-inter text-xs text-neutral-300">
                  Prefer driving? My full dossier is waiting on an interactive glowing pedestal in the northwest sector of the 3D map.
                </p>
              </div>
            </div>

            <button
              onClick={() => launchGame()}
              className="shrink-0 inline-flex items-center gap-2 rounded-xl border border-[#FF2D2D] bg-[#E62429]/20 px-4 py-2.5 font-orbitron text-xs font-bold text-white hover:bg-[#E62429] hover:shadow-[0_0_15px_#FF2D2D] transition-all cursor-pointer whitespace-nowrap"
            >
              <span>DRIVE TO PEDESTAL</span>
              <span>🏎️</span>
            </button>
          </motion.div>
        </div>

        {/* 2. Education & Certifications List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/10">
          {/* Education */}
          <div>
            <h3 className="font-orbitron text-lg font-bold text-white mb-5 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-[#E62429]" />
              ACADEMIC FOUNDATION
            </h3>
            <div className="space-y-4">
              {EDUCATION_ITEMS.map((item, idx) => (
                <motion.div
                  key={item.degree}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + idx * 0.15, duration: 0.6 }}
                  className="rounded-xl border border-white/10 bg-[#0a0a0c]/80 p-4 transition-all hover:border-[#E62429]/50"
                >
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-orbitron text-sm font-bold text-white">{item.degree}</h4>
                    <span className="font-mono text-[11px] text-[#FF2D2D] whitespace-nowrap">
                      {item.period}
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-xs text-neutral-400">{item.institution}</p>
                  <p className="mt-2 font-inter text-xs text-neutral-300">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <h3 className="font-orbitron text-lg font-bold text-white mb-5 flex items-center gap-2">
              <Award className="h-5 w-5 text-[#FF2D2D]" />
              CERTIFICATIONS &amp; SPECIALIZATIONS
            </h3>
            <div className="space-y-4">
              {CERTIFICATIONS.map((cert, idx) => (
                <motion.div
                  key={cert.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + idx * 0.12, duration: 0.6 }}
                  className="rounded-xl border border-white/10 bg-[#0a0a0c]/80 p-4 transition-all hover:border-[#FF2D2D]/50 flex items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="font-orbitron text-sm font-bold text-white">{cert.name}</h4>
                    <span className="font-mono text-xs text-neutral-400">{cert.issuer}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="rounded bg-[#E62429]/20 border border-[#E62429]/50 px-2 py-0.5 font-mono text-[10px] font-bold text-[#FF2D2D] block mb-1">
                      {cert.badge}
                    </span>
                    <span className="font-mono text-[10px] text-neutral-400">{cert.year}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
