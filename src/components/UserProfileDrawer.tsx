import React, { useState } from 'react';
import { X, User, Briefcase, Award, Save, LogOut, RefreshCw, Check, Sparkles } from 'lucide-react';
import { AuthService } from '../services/authService';
import { useStore } from '../store/useStore';
import './UserProfileDrawer.css';

interface UserProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileDrawer: React.FC<UserProfileDrawerProps> = ({ isOpen, onClose }) => {
  const user = useStore((s) => s.user);
  const setUser = useStore((s) => s.setUser);
  const setShowAuthModal = useStore((s) => s.setShowAuthModal);

  const [name, setName] = useState(user?.name || '');
  const [jobTitle, setJobTitle] = useState(user?.jobTitle || '');
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen || !user) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = AuthService.updateUserProfile(name, jobTitle);
    setUser(updated);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleLogout = () => {
    const loggedOut = AuthService.logout();
    setUser(loggedOut);
    onClose();
  };

  const handleSwitchAccount = () => {
    onClose();
    setShowAuthModal(true);
  };

  // XP Progress Calculation
  const nextLevelXP = 1000 * Math.max(1, user.rankLevel);
  const xpPercentage = Math.min(100, Math.round((user.xp / nextLevelXP) * 100));

  return (
    <div className="profile-drawer-overlay">
      <div className="profile-drawer-card">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 font-orbitron font-bold text-white text-sm">
            <Award size={18} className="text-yellow-400" />
            <span>Candidate Profile & Rank</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* User Badge Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/30 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">{user.name}</h3>
            <p className="text-xs text-slate-400 font-mono">{user.email || 'Registered Candidate'}</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-semibold">
              Level {user.rankLevel}: {user.rankTitle}
            </span>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-300 flex items-center gap-1">
              <Sparkles size={14} className="text-yellow-400" /> Total Engineering XP:
            </span>
            <span className="font-mono text-indigo-400">{user.xp} XP</span>
          </div>
          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500" style={{ width: `${xpPercentage}%` }} />
          </div>
          <div className="text-[10px] text-slate-500 text-right font-mono">
            {user.xp} / {nextLevelXP} XP to Next Rank
          </div>
        </div>

        {/* Edit Profile Form */}
        <form onSubmit={handleSaveProfile} className="flex flex-col gap-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Edit Profile Details:</h4>

          <div>
            <label className="text-[11px] text-slate-400 font-semibold mb-1 block">Full Name:</label>
            <div className="auth-input-group">
              <span className="auth-input-icon"><User size={16} /></span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="auth-input"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 font-semibold mb-1 block">Target Job Title:</label>
            <div className="auth-input-group">
              <span className="auth-input-icon"><Briefcase size={16} /></span>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="auth-input"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md mt-1"
          >
            {savedNotice ? <Check size={14} className="text-emerald-400" /> : <Save size={14} />}
            {savedNotice ? 'Profile Saved!' : 'Save Profile Changes'}
          </button>
        </form>

        {/* Account Management Actions */}
        <div className="mt-auto pt-4 border-t border-slate-800 flex flex-col gap-2">
          <button
            onClick={handleSwitchAccount}
            className="w-full py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw size={14} /> Switch Account / Sign In Different User
          </button>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 rounded-xl border border-red-500/30 bg-red-950/30 text-red-400 hover:bg-red-900/50 font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut size={14} /> Log Out Account
          </button>
        </div>
      </div>
    </div>
  );
};
