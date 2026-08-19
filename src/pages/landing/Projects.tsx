import React, { useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ExternalLink, Code2, ChevronRight, Sparkles } from 'lucide-react';
import projectsData from '../../data/projects.json';

type Project = (typeof projectsData)[0];

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

const cardVariant = {
  hidden: { opacity: 0, y: 40, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 200, damping: 18 },
  },
};

const ProjectCard: React.FC<{ project: Project; index: number; inView: boolean; onClick: () => void }> = ({
  project, index, inView, onClick,
}) => (
  <motion.div
    variants={cardVariant}
    initial="hidden"
    animate={inView ? 'visible' : 'hidden'}
    transition={{ delay: index * 0.06 }}
    whileHover={{
      scale: 1.04,
      y: -8,
      rotateY: 2,
      rotateX: -1,
      boxShadow: `0 24px 60px ${project.color}25`,
      borderColor: project.color,
      transition: { type: 'spring', stiffness: 350, damping: 14 },
    }}
    whileTap={{ scale: 0.98 }}
    className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden transition-colors duration-300 cursor-pointer flex flex-col shadow-sm"
    style={{ '--accent': project.color, transformStyle: 'preserve-3d' } as React.CSSProperties}
    onClick={onClick}
  >
    {/* Top accent bar */}
    <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${project.color}, ${project.color}44)` }} />

    {/* Card content */}
    <div className="p-6 flex flex-col flex-1">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <span
            className="font-orbitron text-xs tracking-widest px-2 py-0.5 rounded-full border mb-2 inline-block"
            style={{ borderColor: `${project.color}40`, color: project.color, background: `${project.color}15` }}
          >
            {project.category}
          </span>
          <h3 className="font-orbitron text-slate-900 font-bold text-xl leading-tight">{project.name}</h3>
          <p className="font-inter text-slate-500 text-sm mt-0.5">{project.tagline}</p>
        </div>
        <motion.div
          animate={{ x: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <ChevronRight
            size={20}
            className="text-slate-400 group-hover:text-primary-600 transition-colors duration-300 shrink-0 mt-1"
          />
        </motion.div>
      </div>

      {/* Description */}
      <p className="font-inter text-slate-650 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
        {project.description}
      </p>

      {/* Tech tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tech.slice(0, 4).map((t) => (
          <motion.span
            key={t}
            whileHover={{ scale: 1.08, y: -2 }}
            className="font-orbitron text-xs bg-gray-50 border border-gray-150 rounded-md px-2 py-0.5 text-slate-500"
          >
            {t}
          </motion.span>
        ))}
        {project.tech.length > 4 && (
          <span className="font-orbitron text-xs text-slate-400">+{project.tech.length - 4}</span>
        )}
      </div>

      {/* Links */}
      <div className="flex items-center gap-3 pt-3 border-t border-gray-150">
        {project.liveDemo && (
          <a
            href={project.liveDemo}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 font-orbitron text-xs hover:opacity-80 transition-opacity"
            style={{ color: project.color }}
          >
            <ExternalLink size={12} /> Live Site
          </a>
        )}
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 font-orbitron text-xs text-slate-500 hover:text-primary-600 transition-colors"
          >
            <Code2 size={12} /> GitHub
          </a>
        )}
        <span className="ml-auto font-orbitron text-xs text-slate-400 group-hover:text-primary-500">View Details →</span>
      </div>
    </div>
  </motion.div>
);

const ProjectDetailModal: React.FC<{ project: Project; onClose: () => void }> = ({ project, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-md"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.85, opacity: 0, y: 30, rotateX: 5 }}
      animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
      exit={{ scale: 0.85, opacity: 0, y: 30, rotateX: 5 }}
      transition={{ type: 'spring', damping: 22, stiffness: 250 }}
      className="bg-white border rounded-2xl max-w-2xl w-full max-h-[92vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl"
      style={{ borderColor: `${project.color}50`, borderTopWidth: '3px', borderTopColor: project.color }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-5 sm:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <span className="font-orbitron text-xs tracking-widest mb-2 inline-block font-bold" style={{ color: project.color }}>
              {project.category}
            </span>
            <h2 className="font-orbitron text-2xl font-black text-slate-900">{project.name}</h2>
            <p className="font-inter text-slate-500 mt-1">{project.tagline}</p>
          </div>
          <motion.button
            whileHover={{ rotate: 90, scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-3xl leading-none p-1 transition-colors"
            aria-label="Close"
          >
            ×
          </motion.button>
        </div>

        {/* Tech tags */}
        <motion.div
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap gap-2 mb-6"
        >
          {project.tech.map((t) => (
            <motion.span
              key={t}
              variants={{
                hidden: { opacity: 0, scale: 0.7 },
                visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300 } },
              }}
              className="font-orbitron text-xs px-3 py-1 rounded-full border"
              style={{ borderColor: `${project.color}40`, color: project.color, background: `${project.color}10` }}
            >
              {t}
            </motion.span>
          ))}
        </motion.div>

        <p className="font-inter text-slate-700 leading-relaxed mb-6">{project.description}</p>

        {/* Features */}
        <h3 className="font-orbitron text-xs tracking-widest text-slate-500 mb-3 font-semibold">KEY FEATURES</h3>
        <motion.ul
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
          initial="hidden"
          animate="visible"
          className="space-y-2 mb-6"
        >
          {project.features.map((f, i) => (
            <motion.li
              key={i}
              variants={{
                hidden: { opacity: 0, x: -10 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
              }}
              className="flex items-start gap-2 font-inter text-sm text-slate-600"
            >
              <span style={{ color: project.color }} className="mt-0.5 shrink-0">◆</span> {f}
            </motion.li>
          ))}
        </motion.ul>

        {/* Role */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6"
        >
          <h3 className="font-orbitron text-xs tracking-widest text-slate-500 mb-2 font-semibold">MY ROLE</h3>
          <p className="font-inter text-sm text-slate-700">{project.role}</p>
        </motion.div>

        {/* Actions */}
        <div className="flex gap-3">
          {project.liveDemo && (
            <motion.a
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              href={project.liveDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-orbitron text-xs tracking-widest text-white font-bold transition-all hover:brightness-110"
              style={{ background: project.color }}
            >
              <ExternalLink size={14} /> LIVE SITE
            </motion.a>
          )}
          {project.github && (
            <motion.a
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-orbitron text-xs tracking-widest border transition-all hover:bg-gray-50"
              style={{ borderColor: `${project.color}50`, color: project.color }}
            >
              <Code2 size={14} /> GITHUB
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  </motion.div>
);

export const Projects: React.FC = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [selected, setSelected] = useState<Project | null>(null);

  // Quadruple projects list for seamless infinite horizontal scroll
  const marqueeProjects = [...projectsData, ...projectsData, ...projectsData, ...projectsData];

  return (
    <section id="projects" ref={ref} className="py-20 sm:py-32 bg-dark-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={sectionHeader}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-center mb-12"
        >
          <p className="font-orbitron text-primary-600 text-sm tracking-[0.3em] mb-3">04. PROJECTS</p>
          <h2 className="font-orbitron text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4">
            Featured <span className="bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">Work</span>
          </h2>
          <p className="font-inter text-slate-650 max-w-xl mx-auto">
            Real-world enterprise solutions across FinTech, AI, Healthcare, EdTech, and 3D web applications — explore the infinite project scroller or select cards below!
          </p>
        </motion.div>

        {/* INFINITE SCROLLER PROJECT MARQUEE */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full overflow-hidden mb-16 py-5 bg-slate-950/80 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-md"
        >
          {/* Gradient Edge Blurs */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-slate-950 via-slate-950/80 to-transparent z-10 pointer-events-none" />
          
          <div className="flex items-center justify-between px-6 mb-4">
            <div className="flex items-center gap-2 text-xs font-orbitron text-primary-400 font-bold uppercase tracking-widest">
              <Sparkles size={14} className="text-amber-400 animate-pulse" />
              <span>INFINITE PROJECT SHOWCASE (HOVER TO PAUSE)</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 hidden sm:inline-block">
              SWIPE / CONTINUOUS AUTO-SCROLL
            </span>
          </div>

          <motion.div
            className="flex gap-5 w-max"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ repeat: Infinity, ease: 'linear', duration: 40 }}
          >
            {marqueeProjects.map((project, idx) => (
              <motion.div
                key={`${project.id}-marquee-${idx}`}
                onClick={() => setSelected(project)}
                whileHover={{
                  scale: 1.04,
                  y: -4,
                  borderColor: `${project.color}80`,
                  boxShadow: `0 12px 30px ${project.color}20`,
                  transition: { type: 'spring', stiffness: 400, damping: 15 },
                }}
                className="w-[300px] sm:w-[340px] shrink-0 p-5 rounded-xl bg-slate-900/90 border border-slate-800 transition-colors duration-300 group cursor-pointer shadow-lg"
              >
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span
                    className="font-orbitron text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded border"
                    style={{ color: project.color, borderColor: `${project.color}40`, backgroundColor: `${project.color}15` }}
                  >
                    {project.category}
                  </span>
                  <span className="font-orbitron text-[10px] text-slate-400 group-hover:text-primary-400 flex items-center gap-1 transition-colors">
                    View <ChevronRight size={12} />
                  </span>
                </div>
                <h4 className="font-orbitron text-slate-100 font-bold text-base group-hover:text-primary-400 transition-colors line-clamp-1">
                  {project.name}
                </h4>
                <p className="font-inter text-slate-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                  {project.tagline}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-3.5 pt-3 border-t border-slate-800/80">
                  {project.tech.slice(0, 3).map((t) => (
                    <span key={t} className="font-orbitron text-[9px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                      {t}
                    </span>
                  ))}
                  {project.tech.length > 3 && (
                    <span className="font-orbitron text-[9px] text-slate-500 font-bold">+{project.tech.length - 3}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Grid View of Projects — staggered */}
        <motion.div
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
        >
          {projectsData.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              inView={inView}
              onClick={() => setSelected(project)}
            />
          ))}
        </motion.div>

        {/* Game CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ delay: 0.8, type: 'spring', stiffness: 200, damping: 20 }}
          whileHover={{ scale: 1.02, y: -3, boxShadow: '0 16px 40px rgba(124,58,237,0.15)' }}
          className="text-center mt-16 p-8 rounded-2xl border border-primary-200 bg-primary-50/50"
        >
          <p className="font-orbitron text-slate-900 text-lg font-bold mb-2">Want a more immersive experience?</p>
          <p className="font-inter text-slate-600 mb-6">Drive to each project's dedicated building in the 3D portfolio world!</p>
          <motion.button
            whileHover={{ scale: 1.06, y: -3, boxShadow: '0 12px 35px rgba(124,58,237,0.4)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => document.getElementById('hero-play-game-btn')?.click()}
            className="px-8 py-3 rounded-xl font-orbitron text-sm tracking-widest text-white font-bold"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}
          >
            ▶ LAUNCH 3D WORLD
          </motion.button>
        </motion.div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && <ProjectDetailModal project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
};
