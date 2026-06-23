import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { personal } from '../../data/personalInfo';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number] } },
};

const codeSnippet = `// Building the future, one commit at a time
const developer = {
  name: "${personal.firstName}",
  passion: "Immersive web experiences",
  currentlyLearning: "WebGPU & AI Agents",
  stack: ["React", "Three.js", "Node.js"],
  coffeePerDay: "∞",
};

const buildGreatThings = async () => {
  while (true) {
    await learn();
    await build();
    await ship();
  }
};`;

export const About: React.FC = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" ref={ref} className="py-32 bg-dark-800 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-center mb-16"
        >
          <p className="font-orbitron text-primary-600 text-sm tracking-[0.3em] mb-3">01. ABOUT ME</p>
          <h2 className="font-orbitron text-3xl md:text-4xl lg:text-5xl font-black text-slate-900">
            Who I <span className="bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">Am</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Text side */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <p className="font-inter text-slate-700 text-lg leading-relaxed">
              {personal.bio}
            </p>
            <p className="font-inter text-slate-600 leading-relaxed">
              When I'm not writing code, I'm exploring the intersection of web technology and game design —
              which is why I built this portfolio as an interactive 3D experience you can actually <em className="text-primary-600 font-semibold not-italic">drive through</em>.
            </p>
            <p className="font-inter text-slate-600 leading-relaxed">
              I've had the privilege of working with clients across <span className="text-slate-850 font-semibold">Australia, Taiwan, the United States, India, and Armenia</span> — 
              delivering everything from healthcare platforms to AI-powered communication tools.
            </p>

            {/* Quick facts */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { label: 'Location', value: personal.location },
                { label: 'Experience', value: `${personal.yearsOfExperience}+ Years` },
                { label: 'Status', value: personal.availableForWork ? '✅ Open to Work' : 'Engaged' },
                { label: 'Focus', value: 'Full-Stack + 3D Web' },
              ].map((fact) => (
                <div key={fact.label} className="bg-white border border-gray-250 rounded-xl p-4 shadow-sm">
                  <div className="font-orbitron text-xs text-slate-500 tracking-widest mb-1">{fact.label.toUpperCase()}</div>
                  <div className="font-inter text-slate-950 font-semibold text-sm">{fact.value}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Code block side */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            {/* Glow border */}
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-primary-500/20 via-violet-500/20 to-indigo-500/20 blur-sm" />
            <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-md">
              {/* Window bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 bg-gray-50">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                <span className="ml-3 font-mono text-xs text-slate-500">developer.ts</span>
              </div>
              {/* Code */}
              <pre className="p-4 sm:p-6 text-xs sm:text-sm font-mono overflow-x-auto">
                <code className="text-slate-800 whitespace-pre">
                  {codeSnippet.split('\n').map((line, i) => (
                    <div key={i} className="flex">
                      <span className="text-slate-400 select-none w-6 mr-4 text-right shrink-0">{i + 1}</span>
                      <span dangerouslySetInnerHTML={{
                        __html: line
                          .replace(/(".*?")/g, '<span style="color:#059669">$1</span>')
                          .replace(/\b(const|async|await|while|true|return)\b/g, '<span style="color:#7c3aed;font-weight:bold">$1</span>')
                          .replace(/\/\/.*/g, '<span style="color:#64748b">$&</span>')
                          .replace(/\b(name|passion|stack|coffeePerDay)\b/g, '<span style="color:#2563eb">$&</span>')
                      }} />
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
