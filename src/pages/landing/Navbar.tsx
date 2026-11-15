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

      const scrollPosition = window.scrollY + 220;
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
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          scrolled
            ? 'h-14 bg-black/85 backdrop-blur-xl border-b border-[#E62429]/30 shadow-[0_4px_30px_rgba(0,0,0,0.9)]'
            : 'h-16 bg-transparent border-b border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-full gap-2 sm:gap-6">
            {/* Brand Logo - Deadpool Theme Monogram */}
            <button
              onClick={() => scrollToTarget('#hero')}
              className="flex items-center gap-2.5 cursor-pointer group shrink-0 select-none text-left"
              title="Rajat Ambedkar - Back to top"
            >
              {/* Deadpool Monogram Badge */}
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-black border-2 border-[#E62429] flex items-center justify-center shadow-[0_0_15px_rgba(230,36,41,0.5)] group-hover:border-[#FF2D2D] group-hover:shadow-[0_0_22px_rgba(255,45,45,0.75)] transition-all duration-300">
                <span className="font-orbitron text-sm sm:text-base font-black text-[#E62429] tracking-tighter drop-shadow-[0_0_6px_#FF2D2D] group-hover:scale-105 transition-transform">
                  R<span className="text-white text-[11px]">J</span>
                </span>
                {/* Katana cross accent */}
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#FF2D2D] animate-ping" />
              </div>

              {/* Text mark */}
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 font-orbitron text-sm sm:text-base font-black tracking-wide leading-none">
                  <span className="bg-gradient-to-r from-white via-neutral-200 to-[#E62429] bg-clip-text text-transparent group-hover:drop-shadow-[0_0_8px_rgba(230,36,41,0.6)] transition-all">
                    RAJAT
                  </span>
                  <span className="bg-black text-[#FF2D2D] text-[9px] sm:text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border border-[#E62429]/60 shadow-[0_0_8px_rgba(230,36,41,0.4)]">
                    .DEV
                  </span>
                </div>
                <span className="text-[8px] font-mono text-[#9CA3AF] tracking-widest uppercase mt-0.5 flex items-center gap-1">
                  FULL STACK DEVELOPER
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links (ScrollSpy) */}
            <div className="hidden md:flex items-center justify-center flex-1 mx-2 lg:mx-6 gap-1 lg:gap-2 xl:gap-3">
              {navSections.map((sec) => {
                const IconComp = sec.icon;
                const isActive = activeSection === sec.href.replace('#', '');
                return (
                  <button
                    key={sec.label}
                    onClick={() => handleNavClick(sec.href)}
                    className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-orbitron font-semibold tracking-wider transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'text-white bg-[#E62429]/20 border border-[#E62429]/60 shadow-[0_0_12px_rgba(230,36,41,0.35)]'
                        : 'text-[#9CA3AF] hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <IconComp size={13} className={isActive ? 'text-[#FF2D2D]' : 'text-neutral-500'} />
                    <span>{sec.label}</span>
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-indicator"
                        className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#FF2D2D] shadow-[0_0_8px_#FF2D2D]"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right side: 3D Racing World CTA + Mobile Toggle */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              <button
                id="nav-play-game-btn"
                onClick={launchGame}
                className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-orbitron text-[11px] tracking-wider font-bold text-white transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg border border-[#FF2D2D]/40"
                style={{
                  background: 'linear-gradient(135deg, #E62429 0%, #8B0000 100%)',
                  boxShadow: '0 0 16px rgba(230,36,41,0.5)',
                }}
              >
                <Gamepad2 size={14} className="text-white" />
                3D RACING WORLD
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-1.5 text-neutral-300 hover:text-white rounded-lg bg-neutral-900 border border-neutral-800 transition-all"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-14 left-0 right-0 z-[99] bg-black/95 backdrop-blur-2xl border-b border-[#E62429]/30 p-4 flex flex-col gap-2 md:hidden shadow-2xl"
          >
            {navSections.map((sec) => {
              const IconComp = sec.icon;
              const isActive = activeSection === sec.href.replace('#', '');
              return (
                <button
                  key={sec.label}
                  onClick={() => handleNavClick(sec.href)}
                  className={`flex items-center gap-3 font-orbitron text-xs font-semibold px-4 py-2.5 rounded-xl transition-all text-left ${
                    isActive
                      ? 'bg-[#E62429]/25 text-white border border-[#E62429]/50'
                      : 'text-[#9CA3AF] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <IconComp size={15} className={isActive ? 'text-[#FF2D2D]' : 'text-neutral-500'} />
                  <span>{sec.label}</span>
                </button>
              );
            })}
            <button
              onClick={() => {
                setMobileOpen(false);
                launchGame();
              }}
              className="flex items-center justify-center gap-2 mt-2 py-2.5 rounded-xl font-orbitron text-xs font-bold text-white shadow-lg cursor-pointer border border-[#FF2D2D]/50"
              style={{ background: 'linear-gradient(135deg, #E62429, #8B0000)' }}
            >
              <Gamepad2 size={15} /> ENTER 3D RACING WORLD
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
