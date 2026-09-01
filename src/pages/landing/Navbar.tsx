import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Gamepad2, FileText, LogOut, UserCheck, User, Code2, Briefcase, FolderGit2, Mail } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { AuthService } from '../../services/authService';
import { UserProfileDrawer } from '../../components/UserProfileDrawer';
import { personal } from '../../data/personalInfo';

const navSections = [
  { label: 'About', href: '#about', icon: User },
  { label: 'Skills', href: '#skills', icon: Code2 },
  { label: 'Experience', href: '#experience', icon: Briefcase },
  { label: 'Projects', href: '#projects', icon: FolderGit2 },
  { label: 'Resume', href: '#resume', icon: FileText },
  { label: 'Contact', href: '#contact', icon: Mail },
];

export const Navbar: React.FC = () => {
  const user = useStore((s) => s.user);
  const setUser = useStore((s) => s.setUser);
  const setShowAuthModal = useStore((s) => s.setShowAuthModal);
  const launchGame = useStore((s) => s.launchGame);

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('about');

  useEffect(() => {
    const sectionIds = ['about', 'skills', 'experience', 'projects', 'resume', 'contact'];
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const scrollPosition = window.scrollY + 180;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl border-b border-gray-250 shadow-md shadow-slate-900/5'
            : 'bg-white/90 backdrop-blur-md border-b border-gray-200/80'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="font-orbitron text-lg font-black flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent font-bold">
                {personal.firstName}
              </span>
              <span className="text-slate-500 text-sm font-bold">.dev</span>
            </button>

            {/* Desktop Navigation Links — Spanning the Header */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              {navSections.map((sec) => {
                const IconComp = sec.icon;
                const isActive = activeSection === sec.href.replace('#', '');
                return (
                  <button
                    key={sec.label}
                    onClick={() => scrollTo(sec.href)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-orbitron font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-violet-50 text-violet-700 shadow-sm border border-violet-200/80'
                        : 'text-slate-650 hover:text-violet-700 hover:bg-violet-50/50'
                    }`}
                  >
                    <IconComp size={14} className={isActive ? 'text-violet-600' : 'text-slate-400'} />
                    <span>{sec.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Right side: User Badge + Action Buttons + Mobile Toggle */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Candidate Account Status Badge */}
              {user && user.isLoggedIn ? (
                <div
                  onClick={() => setShowProfileDrawer(true)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-violet-200 bg-violet-50/80 hover:bg-violet-100/80 text-xs font-semibold text-slate-900 cursor-pointer shadow-sm transition-all hover:scale-[1.02]"
                  title="Click to view & edit Profile & Rank"
                >
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-bold text-slate-900 max-w-[80px] sm:max-w-[120px] truncate">{user.name}</span>
                  <span className="hidden sm:inline-block text-[9px] font-mono px-2 py-0.5 rounded-md bg-violet-100 text-violet-700 font-bold border border-violet-200">
                    {user.rankTitle}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const loggedOut = AuthService.logout();
                      setUser(loggedOut);
                    }}
                    className="p-1 hover:text-red-600 text-slate-400 transition-colors ml-0.5 cursor-pointer"
                    title="Log Out Account"
                  >
                    <LogOut size={13} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-xs font-semibold text-slate-800 transition-all cursor-pointer shadow-sm"
                >
                  <UserCheck size={13} className="text-emerald-600" />
                  <span>Sign In</span>
                </button>
              )}

              <UserProfileDrawer
                isOpen={showProfileDrawer}
                onClose={() => setShowProfileDrawer(false)}
              />

              <button
                id="nav-play-game-btn"
                onClick={launchGame}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg font-orbitron text-xs tracking-wider font-bold text-white transition-all hover:brightness-110"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 12px rgba(124,58,237,0.25)' }}
              >
                <Gamepad2 size={14} />
                PLAY GAME
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 text-slate-700 hover:text-slate-900 rounded-lg bg-gray-100 border border-gray-200 hover:bg-gray-200 transition-all"
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
            className="fixed top-16 left-0 right-0 z-[99] bg-white/98 backdrop-blur-xl border-b border-gray-200 p-4 flex flex-col gap-2 md:hidden shadow-xl"
          >
            {/* Candidate Mobile Status Card */}
            {user && user.isLoggedIn && (
              <div className="p-3 mb-2 rounded-xl bg-violet-50/80 border border-violet-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">{user.name}</div>
                    <div className="text-[10px] text-violet-700 font-mono font-semibold">{user.rankTitle} · Candidate</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const loggedOut = AuthService.logout();
                    setUser(loggedOut);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-red-50 text-red-600 border border-red-200 text-xs font-semibold"
                >
                  Log Out
                </button>
              </div>
            )}

            {navSections.map((sec, idx) => {
              const IconComp = sec.icon;
              return (
                <motion.button
                  key={sec.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.06, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ x: 6, backgroundColor: 'rgba(124,58,237,0.08)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => scrollTo(sec.href)}
                  className="flex items-center gap-3 font-orbitron font-semibold text-slate-800 hover:text-violet-700 text-left px-4 py-3 rounded-xl transition-colors text-xs"
                >
                  <IconComp size={16} className="text-violet-600" />
                  <span>{sec.label}</span>
                </motion.button>
              );
            })}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navSections.length * 0.06, duration: 0.4 }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setMobileOpen(false); launchGame(); }}
              className="flex items-center justify-center gap-2 mt-2 py-3 rounded-xl font-orbitron text-sm font-bold text-white shadow-md"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
            >
              <Gamepad2 size={16} /> PLAY PORTFOLIO GAME
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
