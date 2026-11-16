import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Gamepad2, FileText, User, Code2, Briefcase, FolderGit2, Mail } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { scrollToTarget } from '../../hooks/useLenisScroll';

const navSections = [
  { label: 'About', href: '#about', icon: User },
  { label: 'Skills', href: '#skills', icon: Code2 },
  { label: 'Experience', href: '#experience', icon: Briefcase },
  { label: 'Projects', href: '#projects', icon: FolderGit2 },
  { label: 'Resume', href: '#resume', icon: FileText },
  { label: 'Contact', href: '#contact', icon: Mail },
];

export const Navbar: React.FC = () => {
  const launchGame = useStore((s) => s.launchGame);

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('about');

  useEffect(() => {
    const sectionIds = ['hero', 'about', 'skills', 'experience', 'projects', 'resume', 'contact'];
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const scrollPosition = window.scrollY + 200;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(id === 'hero' ? 'about' : id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    scrollToTarget(href);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-[1000] w-full transition-all duration-300 ${
          scrolled
            ? 'bg-black/95 backdrop-blur-xl border-b border-[#E62429]/40 shadow-xl shadow-black/80 h-16'
            : 'bg-black/80 backdrop-blur-md border-b border-white/10 h-16'
        }`}
      >
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-full gap-2 sm:gap-6">
            {/* Brand Logo - Red & Black Aesthetic */}
            <button
              onClick={() => scrollToTarget('#hero')}
              className="flex items-center gap-2.5 cursor-pointer group shrink-0 select-none text-left"
              title="Rajat Ambedkar - Back to top"
            >
              {/* Monogram Badge */}
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-black border-2 border-[#E62429]/80 flex items-center justify-center shadow-[0_0_18px_rgba(230,36,41,0.45)] group-hover:border-[#FF2D2D] group-hover:shadow-[0_0_24px_rgba(255,45,45,0.7)] transition-all duration-300">
                <div className="absolute inset-0 rounded-xl bg-radial from-[#E62429]/25 via-transparent to-black pointer-events-none" />
                <span className="font-orbitron text-base sm:text-lg font-black text-[#FF2D2D] tracking-tighter drop-shadow-[0_0_8px_rgba(255,45,45,0.85)] group-hover:scale-105 transition-transform duration-300">
                  R<span className="text-white text-xs">J</span>
                </span>
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#FF2D2D] animate-pulse shadow-[0_0_6px_#FF2D2D]" />
              </div>

              {/* Text mark */}
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 font-orbitron text-base sm:text-lg font-black tracking-wide leading-none">
                  <span className="bg-gradient-to-r from-white via-neutral-200 to-[#FF2D2D] bg-clip-text text-transparent group-hover:drop-shadow-[0_0_8px_rgba(230,36,41,0.5)] transition-all">
                    RAJAT
                  </span>
                  <span className="bg-black text-[#FF2D2D] text-[10px] sm:text-xs font-mono font-bold px-1.5 py-0.5 rounded border border-[#E62429]/60 shadow-[0_0_10px_rgba(230,36,41,0.3)]">
                    .DEV
                  </span>
                </div>
                <span className="text-[9px] font-mono text-neutral-400 tracking-widest uppercase mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E62429] inline-block animate-ping" />
                  FULL-STACK DEVELOPER
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links (Center-aligned) */}
            <div className="hidden md:flex items-center justify-center flex-1 mx-2 lg:mx-6 gap-1 lg:gap-3 xl:gap-4">
              {navSections.map((sec) => {
                const IconComp = sec.icon;
                const isActive = activeSection === sec.href.replace('#', '');
                return (
                  <button
                    key={sec.label}
                    onClick={() => handleNavClick(sec.href)}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs lg:text-sm font-orbitron font-semibold tracking-wider transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-[#E62429]/20 text-white font-bold border border-[#E62429] shadow-[0_0_14px_rgba(230,36,41,0.45)]'
                        : 'text-neutral-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <IconComp size={15} className={isActive ? 'text-[#FF2D2D]' : 'text-neutral-400 group-hover:text-[#FF2D2D]'} />
                    <span>{sec.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Right side: 3D Racing World Button + Mobile Toggle */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              <button
                id="nav-play-game-btn"
                onClick={launchGame}
                className="hidden sm:flex items-center gap-2 px-5 py-2 rounded-full font-orbitron text-xs tracking-wider font-bold text-white transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg border border-[#FF2D2D]"
                style={{
                  background: 'linear-gradient(135deg, #E62429 0%, #8B0000 100%)',
                  boxShadow: '0 0 20px rgba(230,36,41,0.6)',
                }}
              >
                <Gamepad2 size={15} />
                3D RACING WORLD
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 text-neutral-300 hover:text-white rounded-lg bg-neutral-900 border border-neutral-800 transition-all"
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
            className="fixed top-16 left-0 right-0 z-[999] bg-black/98 backdrop-blur-2xl border-b border-[#E62429]/30 p-4 flex flex-col gap-2 md:hidden shadow-2xl"
          >
            {navSections.map((sec, idx) => {
              const IconComp = sec.icon;
              const isActive = activeSection === sec.href.replace('#', '');
              return (
                <motion.button
                  key={sec.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.25 }}
                  onClick={() => handleNavClick(sec.href)}
                  className={`flex items-center gap-3 font-orbitron font-semibold text-left px-4 py-3 rounded-xl transition-all text-xs ${
                    isActive
                      ? 'bg-[#E62429]/25 text-white border border-[#E62429]/50 shadow-md'
                      : 'text-neutral-300 hover:text-[#FF2D2D] hover:bg-white/5'
                  }`}
                >
                  <IconComp size={16} className={isActive ? 'text-[#FF2D2D]' : 'text-neutral-500'} />
                  <span>{sec.label}</span>
                </motion.button>
              );
            })}
            <button
              onClick={() => {
                setMobileOpen(false);
                launchGame();
              }}
              className="flex items-center justify-center gap-2 mt-2 py-3 rounded-xl font-orbitron text-xs font-bold text-white shadow-lg cursor-pointer border border-[#FF2D2D]/50"
              style={{ background: 'linear-gradient(135deg, #E62429, #8B0000)' }}
            >
              <Gamepad2 size={16} /> ENTER 3D RACING WORLD
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
