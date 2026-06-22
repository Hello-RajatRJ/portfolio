import React from 'react';
import { Gamepad2, Heart } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { personal } from '../../data/personalInfo';

export const Footer: React.FC = () => {
  const launchGame = useStore((s) => s.launchGame);

  return (
    <footer className="bg-dark-900 border-t border-gray-200 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Logo + tagline */}
          <div className="text-center md:text-left">
            <div className="font-orbitron text-xl font-black bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent mb-1">
              {personal.firstName}.dev
            </div>
            <p className="font-inter text-sm text-slate-500">{personal.tagline}</p>
          </div>

          {/* Center: Play Game */}
          <button
            onClick={launchGame}
            id="footer-play-btn"
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-orbitron text-xs tracking-widest font-bold text-white transition-all hover:brightness-110 hover:shadow-lg hover:shadow-primary-500/20 cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
          >
            <Gamepad2 size={16} />
            PLAY 3D PORTFOLIO
          </button>

          {/* Right: Credits */}
          <div className="font-inter text-sm text-slate-500 flex items-center gap-1.5">
            Built with <Heart size={12} className="text-red-500 mx-0.5" /> using React & Three.js
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-250 text-center font-inter text-xs text-slate-400">
          © {new Date().getFullYear()} {personal.name} · All rights reserved
        </div>
      </div>
    </footer>
  );
};
