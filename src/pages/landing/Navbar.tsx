import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Gamepad2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { personal } from '../../data/personalInfo';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Resume', href: '#resume' },
  { label: 'Contact', href: '#contact' },
];

export const Navbar: React.FC = () => {
  const launchGame = useStore((s) => s.launchGame);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          scrolled
            ? 'bg-dark-900/90 backdrop-blur-xl border-b border-white/5 shadow-xl shadow-black/20'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="font-orbitron text-lg font-black"
            >
              <span className="bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">
                {personal.firstName}
              </span>
              <span className="text-gray-600 text-sm ml-1">.dev</span>
            </button>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  className="font-inter text-sm text-gray-600 hover:text-primary-600 px-3 py-2 rounded-lg hover:bg-primary-50 transition-all duration-200"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Right side: Play button + mobile menu */}
            <div className="flex items-center gap-3">
              <button
                id="nav-play-game-btn"
                onClick={launchGame}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg font-orbitron text-xs tracking-wider font-bold text-white transition-all hover:brightness-110"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 12px rgba(124,58,237,0.2)' }}
              >
                <Gamepad2 size={14} />
                PLAY GAME
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-all"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-16 left-0 right-0 z-[99] bg-white/95 backdrop-blur-xl border-b border-gray-200 p-4 flex flex-col gap-2 md:hidden"
          >
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="font-inter text-gray-700 hover:text-primary-600 text-left px-4 py-3 rounded-xl hover:bg-primary-50 transition-all"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => { setMobileOpen(false); launchGame(); }}
              className="flex items-center justify-center gap-2 mt-2 py-3 rounded-xl font-orbitron text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
            >
              <Gamepad2 size={16} /> PLAY PORTFOLIO GAME
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
