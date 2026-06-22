import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Send, CheckCircle, Mail, MapPin } from 'lucide-react';
import { personal } from '../../data/personalInfo';

export const Contact: React.FC = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Required';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Valid email required';
    if (message.trim().length < 10) e.message = 'Min 10 characters';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStatus('sending');
    await new Promise((r) => setTimeout(r, 1500));
    setStatus('sent');
  };

  const socials = [
    { label: 'LinkedIn', href: personal.linkedin, color: '#0077B5', emoji: '💼' },
    { label: 'GitHub', href: personal.github, color: '#ffffff', emoji: '⌨️' },
    { label: 'Twitter', href: personal.twitter, color: '#1DA1F2', emoji: '🐦' },
    { label: 'Email', href: `mailto:${personal.email}`, color: '#6366f1', emoji: '✉️' },
  ];

  return (
    <section id="contact" ref={ref} className="py-32 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-primary-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <p className="font-orbitron text-primary-600 text-sm tracking-[0.3em] mb-3">06. CONTACT</p>
          <h2 className="font-orbitron text-4xl md:text-5xl font-black text-slate-900 mb-4">
            Get In <span className="bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">Touch</span>
          </h2>
          <p className="font-inter text-slate-600 max-w-lg mx-auto">
            Have a project in mind? Let's build something amazing together.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Info column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3 font-inter text-slate-605">
                <Mail size={18} className="text-primary-600 shrink-0" />
                <a href={`mailto:${personal.email}`} className="hover:text-primary-600 transition-colors font-semibold text-slate-700">{personal.email}</a>
              </div>
              <div className="flex items-center gap-3 font-inter text-slate-600">
                <MapPin size={18} className="text-primary-600 shrink-0" />
                <span>{personal.location}</span>
              </div>
            </div>

            <div>
              <p className="font-orbitron text-xs tracking-widest text-slate-500 mb-4 font-semibold">FIND ME ON</p>
              <div className="grid grid-cols-2 gap-3">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    id={`social-${s.label.toLowerCase()}`}
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-white hover:bg-primary-50/10 hover:border-primary-300 transition-all duration-300 group shadow-sm"
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform inline-block">{s.emoji}</span>
                    <span className="font-inter text-sm text-slate-600 group-hover:text-primary-600 transition-colors">{s.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Availability card */}
            <div className="p-5 rounded-xl border border-green-200 bg-green-50/50">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="font-orbitron text-xs text-green-700 tracking-wider font-bold">OPEN TO WORK</span>
              </div>
              <p className="font-inter text-sm text-slate-600">
                Currently available for freelance projects, contract work, and full-time opportunities.
              </p>
            </div>
          </motion.div>

          {/* Form column */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            {status === 'sent' ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <CheckCircle size={64} className="text-green-500 mb-4" />
                <h3 className="font-orbitron text-xl text-slate-900 font-bold mb-2">Message Sent!</h3>
                <p className="font-inter text-slate-600">I'll get back to you as soon as possible.</p>
              </div>
            ) : (
              <form id="contact-form" onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Name */}
                <div>
                  <label htmlFor="contact-name" className="font-orbitron text-xs tracking-widest text-slate-500 block mb-2 font-bold">YOUR NAME</label>
                  <input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })); }}
                    placeholder="Alex Mercer"
                    className={`w-full bg-white border rounded-xl px-4 py-3 font-inter text-slate-800 placeholder-gray-400 outline-none transition-all focus:bg-primary-50/10 ${errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'}`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1 font-inter">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="contact-email" className="font-orbitron text-xs tracking-widest text-slate-500 block mb-2 font-bold">EMAIL ADDRESS</label>
                  <input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })); }}
                    placeholder="alex@example.com"
                    className={`w-full bg-white border rounded-xl px-4 py-3 font-inter text-slate-800 placeholder-gray-400 outline-none transition-all focus:bg-primary-50/10 ${errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'}`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1 font-inter">{errors.email}</p>}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="contact-message" className="font-orbitron text-xs tracking-widest text-slate-500 block mb-2 font-bold">MESSAGE</label>
                  <textarea
                    id="contact-message"
                    value={message}
                    onChange={(e) => { setMessage(e.target.value); setErrors((p) => ({ ...p, message: '' })); }}
                    placeholder="Tell me about your project..."
                    rows={5}
                    className={`w-full bg-white border rounded-xl px-4 py-3 font-inter text-slate-800 placeholder-gray-400 outline-none transition-all focus:bg-primary-50/10 resize-none ${errors.message ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'}`}
                  />
                  {errors.message && <p className="text-red-500 text-xs mt-1 font-inter">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  id="contact-submit"
                  disabled={status === 'sending'}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-orbitron text-sm tracking-widest font-bold text-white disabled:opacity-60 transition-all hover:brightness-110 hover:shadow-lg hover:shadow-primary-500/20 hover:-translate-y-0.5 cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
                >
                  {status === 'sending' ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> SENDING...</>
                  ) : (
                    <><Send size={16} /> SEND MESSAGE</>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
