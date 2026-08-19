import React, { useState } from 'react';
import { Lock, Mail, User, X, Sparkles, LogIn, ArrowRight, Briefcase, Eye, EyeOff } from 'lucide-react';
import { AuthService } from '../services/authService';
import { useStore } from '../store/useStore';
import './AuthModal.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetFeatureLabel?: string;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  targetFeatureLabel = 'Developer Tools',
  onSuccess,
}) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [jobTitle, setJobTitle] = useState('Full-Stack Developer');
  const setUser = useStore((s) => s.setUser);

  if (!isOpen) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    let loggedInUser;
    if (isRegisterMode) {
      loggedInUser = AuthService.registerAccount(name, email, password, jobTitle);
    } else {
      loggedInUser = AuthService.loginWithCredentials(email, password);
    }

    setUser(loggedInUser);
    onClose();
    if (onSuccess) onSuccess();
  };

  const handleQuickDemoLogin = () => {
    const demoUser = AuthService.registerAccount('Alex Developer', 'alex.dev@portfolio.com', 'demo123', 'Senior Full-Stack Engineer');
    setUser(demoUser);
    onClose();
    if (onSuccess) onSuccess();
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal-card">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 mx-auto flex items-center justify-center mb-3">
            <Lock size={22} />
          </div>
          <h2 className="text-xl font-bold text-white font-orbitron">
            {isRegisterMode ? 'Create Developer Account' : 'Sign In to Account'}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Access <span className="text-indigo-400 font-semibold">{targetFeatureLabel}</span>, save your notes, and track your engineering rank!
          </p>
        </div>

        {/* Auth Mode Tabs */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setIsRegisterMode(false)}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${!isRegisterMode ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsRegisterMode(true)}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${isRegisterMode ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            Register Account
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
          {isRegisterMode && (
            <>
              <div className="auth-field-wrapper">
                <label className="auth-field-label">Full Name:</label>
                <div className="auth-input-group">
                  <span className="auth-input-icon"><User size={16} /></span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajat Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="auth-input"
                  />
                </div>
              </div>

              <div className="auth-field-wrapper">
                <label className="auth-field-label">Target Job Title:</label>
                <div className="auth-input-group">
                  <span className="auth-input-icon"><Briefcase size={16} /></span>
                  <input
                    type="text"
                    placeholder="e.g. Senior Full-Stack Engineer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="auth-input"
                  />
                </div>
              </div>
            </>
          )}

          <div className="auth-field-wrapper">
            <label className="auth-field-label">Email Address:</label>
            <div className="auth-input-group">
              <span className="auth-input-icon"><Mail size={16} /></span>
              <input
                type="email"
                required
                placeholder="candidate@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
              />
            </div>
          </div>

          <div className="auth-field-wrapper">
            <label className="auth-field-label">Password:</label>
            <div className="auth-input-group">
              <span className="auth-input-icon"><Lock size={16} /></span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="auth-password-toggle"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-submit-btn cursor-pointer mt-1">
            <LogIn size={16} /> {isRegisterMode ? 'Register & Continue' : 'Sign In & Continue'}
          </button>
        </form>

        <div className="relative my-1 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800" /></div>
          <span className="relative bg-[#111622] px-3 text-[10px] text-slate-500 font-mono uppercase">or 1-click access</span>
        </div>

        <button
          onClick={handleQuickDemoLogin}
          className="w-full py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold font-orbitron transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles size={14} className="text-yellow-400" /> Quick Demo Login <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
