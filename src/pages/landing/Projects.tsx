import React, { useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ExternalLink, Code2, ChevronRight } from 'lucide-react';
import projectsData from '../../data/projects.json';

type Project = (typeof projectsData)[0];

const ProjectCard: React.FC<{ project: Project; index: number; inView: boolean; onClick: () => void }> = ({
  project, index, inView, onClick,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={inView ? { opacity: 1, y: 0 } : {}}
    transition={{ delay: index * 0.08, duration: 0.6 }}
    className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-primary-300 hover:shadow-md transition-all duration-500 cursor-pointer flex flex-col shadow-sm"
    style={{ '--accent': project.color } as React.CSSProperties}
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
        <ChevronRight
          size={20}
          className="text-slate-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all duration-300 shrink-0 mt-1"
        />
      </div>

      {/* Description */}
      <p className="font-inter text-slate-650 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
        {project.description}
      </p>

      {/* Tech tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tech.slice(0, 4).map((t) => (
          <span key={t} className="font-orbitron text-xs bg-gray-50 border border-gray-150 rounded-md px-2 py-0.5 text-slate-500">
            {t}
          </span>
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
    className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: 20 }}
      transition={{ type: 'spring', damping: 25 }}
      className="bg-white border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      style={{ borderColor: `${project.color}50`, borderTopWidth: '3px', borderTopColor: project.color }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <span className="font-orbitron text-xs tracking-widest mb-2 inline-block font-bold" style={{ color: project.color }}>
              {project.category}
            </span>
            <h2 className="font-orbitron text-2xl font-black text-slate-900">{project.name}</h2>
            <p className="font-inter text-slate-500 mt-1">{project.tagline}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-3xl leading-none p-1 transition-colors" aria-label="Close">×</button>
        </div>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tech.map((t) => (
            <span key={t} className="font-orbitron text-xs px-3 py-1 rounded-full border" style={{ borderColor: `${project.color}40`, color: project.color, background: `${project.color}10` }}>
              {t}
            </span>
          ))}
        </div>

        <p className="font-inter text-slate-700 leading-relaxed mb-6">{project.description}</p>

        {/* Features */}
        <h3 className="font-orbitron text-xs tracking-widest text-slate-500 mb-3 font-semibold">KEY FEATURES</h3>
        <ul className="space-y-2 mb-6">
          {project.features.map((f, i) => (
            <li key={i} className="flex items-start gap-2 font-inter text-sm text-slate-600">
              <span style={{ color: project.color }} className="mt-0.5 shrink-0">◆</span> {f}
            </li>
          ))}
        </ul>

        {/* Role */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
          <h3 className="font-orbitron text-xs tracking-widest text-slate-500 mb-2 font-semibold">MY ROLE</h3>
          <p className="font-inter text-sm text-slate-700">{project.role}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {project.liveDemo && (
            <a href={project.liveDemo} target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-orbitron text-xs tracking-widest text-white font-bold transition-all hover:brightness-110"
              style={{ background: project.color }}>
              <ExternalLink size={14} /> LIVE SITE
            </a>
          )}
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-orbitron text-xs tracking-widest border transition-all hover:bg-gray-50"
              style={{ borderColor: `${project.color}50`, color: project.color }}>
              <Code2 size={14} /> GITHUB
            </a>
          )}
        </div>
      </div>
    </motion.div>
  </motion.div>
);

export const Projects: React.FC = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <section id="projects" ref={ref} className="py-32 bg-dark-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="font-orbitron text-primary-600 text-sm tracking-[0.3em] mb-3">04. PROJECTS</p>
          <h2 className="font-orbitron text-4xl md:text-5xl font-black text-slate-900 mb-4">
            Featured <span className="bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">Work</span>
          </h2>
          <p className="font-inter text-slate-650 max-w-xl mx-auto">
            8 real-world projects across healthcare, EdTech, FinTech, AI, and social platforms — click any card for details, or explore them in the 3D world!
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {projectsData.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              inView={inView}
              onClick={() => setSelected(project)}
            />
          ))}
        </div>

        {/* Game CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-16 p-8 rounded-2xl border border-primary-200 bg-primary-50/50"
        >
          <p className="font-orbitron text-slate-900 text-lg font-bold mb-2">Want a more immersive experience?</p>
          <p className="font-inter text-slate-600 mb-6">Drive to each project's dedicated building in the 3D portfolio world!</p>
          <button
            onClick={() => document.getElementById('hero-play-game-btn')?.click()}
            className="px-8 py-3 rounded-xl font-orbitron text-sm tracking-widest text-white font-bold"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}
          >
            ▶ LAUNCH 3D WORLD
          </button>
        </motion.div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && <ProjectDetailModal project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
};
