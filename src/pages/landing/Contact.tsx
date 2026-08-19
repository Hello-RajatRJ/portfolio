import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Send, CheckCircle, Mail, MapPin } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { personal } from '../../data/personalInfo';

/* ─── Animation Variants ─── */
const sectionHeader = {
  hidden: { opacity: 0, y: 50, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] },
  },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] },
  },
};

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] },
  },
};

const formFieldVariant = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 250, damping: 18 },
  },
};

export const Contact: React.FC = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
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

    try {
      // Setup EmailJS using Vite Environment Variables
      // User must add these to a .env file in the root folder:
      // VITE_EMAILJS_SERVICE_ID=...
      // VITE_EMAILJS_TEMPLATE_ID=...
      // VITE_EMAILJS_PUBLIC_KEY=...
      
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID';
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID';
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';

      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: name,
          from_email: email,
          message: message,
          to_email: personal.email, // This is just for reference in the template if needed
        },
        publicKey
      );
      
      setStatus('sent');
      setName('');
      setEmail('');
      setMessage('');
      
      // Reset form status after 3 seconds
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('EmailJS Error:', error);
      setStatus('idle');
      alert('Failed to send message. Please make sure EmailJS is configured correctly in your .env file.');
    }
  };

  const socials = [
    { label: 'LinkedIn', href: personal.linkedin, color: '#0077B5', emoji: '💼' },
    { label: 'GitHub', href: personal.github, color: '#ffffff', emoji: '⌨️' },
    { label: 'Email', href: `mailto:${personal.email}`, color: '#6366f1', emoji: '✉️' },
  ].filter(s => !!s.href); // Only keep socials that actually have a URL string

  return (
    <section id="contact" ref={ref} className="py-20 sm:py-32 bg-white relative overflow-hidden">
      {/* Animated glow */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.03, 0.07, 0.03] }}
        transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
        className="absolute inset-0 bg-gradient-radial from-primary-500/5 via-transparent to-transparent pointer-events-none"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          variants={sectionHeader}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-center mb-16"
        >
          <p className="font-orbitron text-primary-600 text-sm tracking-[0.3em] mb-3">06. CONTACT</p>
          <h2 className="font-orbitron text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4">
            Get In <span className="bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">Touch</span>
          </h2>
          <p className="font-inter text-slate-600 max-w-lg mx-auto">
            Have a project in mind? Let's build something amazing together.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Info column — slide in from left */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="space-y-8"
          >
            <motion.div
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="space-y-4"
            >
              <motion.div
                variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5 } } }}
                className="flex items-center gap-3 font-inter text-slate-605"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                >
                  <Mail size={18} className="text-primary-600 shrink-0" />
                </motion.div>
                <a href={`mailto:${personal.email}`} className="hover:text-primary-600 transition-colors font-semibold text-slate-700">{personal.email}</a>
              </motion.div>
              <motion.div
                variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5 } } }}
                className="flex items-center gap-3 font-inter text-slate-600"
              >
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                >
                  <MapPin size={18} className="text-primary-600 shrink-0" />
                </motion.div>
                <span>{personal.location}</span>
              </motion.div>
            </motion.div>

            <div>
              <p className="font-orbitron text-xs tracking-widest text-slate-500 mb-4 font-semibold">FIND ME ON</p>
              <motion.div
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                className="grid grid-cols-2 gap-3"
              >
                {socials.map((s) => (
                  <motion.a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={{
                      hidden: { opacity: 0, y: 20, scale: 0.9 },
                      visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 250, damping: 15 } },
                    }}
                    whileHover={{
                      scale: 1.06,
                      y: -5,
                      boxShadow: '0 12px 30px rgba(99,102,241,0.15)',
                      borderColor: 'rgba(99,102,241,0.6)',
                      transition: { type: 'spring', stiffness: 400, damping: 12 },
                    }}
                    whileTap={{ scale: 0.97 }}
                    id={`social-${s.label.toLowerCase()}`}
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-white hover:bg-primary-50/10 transition-colors duration-300 group shadow-sm"
                  >
                    <motion.span
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      className="text-lg inline-block"
                    >
                      {s.emoji}
                    </motion.span>
                    <span className="font-inter text-sm font-semibold text-slate-600 group-hover:text-primary-600 transition-colors">{s.label}</span>
                  </motion.a>
                ))}
              </motion.div>
            </div>

            {/* Availability card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.6 }}
              whileHover={{ scale: 1.02, y: -3, boxShadow: '0 8px 25px rgba(22,163,74,0.1)' }}
              className="p-5 rounded-xl border border-green-200 bg-green-50/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  className="w-2 h-2 rounded-full bg-green-500"
                />
                <span className="font-orbitron text-xs text-green-700 tracking-wider font-bold">OPEN TO WORK</span>
              </div>
              <p className="font-inter text-sm text-slate-600">
                Currently available for freelance projects, contract work, and full-time opportunities.
              </p>
            </motion.div>
          </motion.div>

          {/* Form column — slide in from right */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            {status === 'sent' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                >
                  <CheckCircle size={64} className="text-green-500 mb-4" />
                </motion.div>
                <h3 className="font-orbitron text-xl text-slate-900 font-bold mb-2">Message Sent!</h3>
                <p className="font-inter text-slate-600">I'll get back to you as soon as possible.</p>
              </motion.div>
            ) : (
              <motion.form
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                id="contact-form"
                onSubmit={handleSubmit}
                className="space-y-5"
                noValidate
              >
                {/* Name */}
                <motion.div variants={formFieldVariant}>
                  <label htmlFor="contact-name" className="font-orbitron text-xs tracking-widest text-slate-500 block mb-2 font-bold">YOUR NAME</label>
                  <motion.input
                    whileFocus={{ scale: 1.01, borderColor: 'rgba(99,102,241,0.8)', boxShadow: '0 0 20px rgba(99,102,241,0.15)' }}
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })); }}
                    placeholder="Alex Mercer"
                    className={`w-full bg-white border rounded-xl px-4 py-3 font-inter text-slate-800 placeholder-gray-400 outline-none transition-all ${errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'}`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1 font-inter">{errors.name}</p>}
                </motion.div>

                {/* Email */}
                <motion.div variants={formFieldVariant}>
                  <label htmlFor="contact-email" className="font-orbitron text-xs tracking-widest text-slate-500 block mb-2 font-bold">EMAIL ADDRESS</label>
                  <motion.input
                    whileFocus={{ scale: 1.01, borderColor: 'rgba(99,102,241,0.8)', boxShadow: '0 0 20px rgba(99,102,241,0.15)' }}
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })); }}
                    placeholder="alex@example.com"
                    className={`w-full bg-white border rounded-xl px-4 py-3 font-inter text-slate-800 placeholder-gray-400 outline-none transition-all ${errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'}`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1 font-inter">{errors.email}</p>}
                </motion.div>

                {/* Message */}
                <motion.div variants={formFieldVariant}>
                  <label htmlFor="contact-message" className="font-orbitron text-xs tracking-widest text-slate-500 block mb-2 font-bold">MESSAGE</label>
                  <motion.textarea
                    whileFocus={{ scale: 1.01, borderColor: 'rgba(99,102,241,0.8)', boxShadow: '0 0 20px rgba(99,102,241,0.15)' }}
                    id="contact-message"
                    value={message}
                    onChange={(e) => { setMessage(e.target.value); setErrors((p) => ({ ...p, message: '' })); }}
                    placeholder="Tell me about your project..."
                    rows={5}
                    className={`w-full bg-white border rounded-xl px-4 py-3 font-inter text-slate-800 placeholder-gray-400 outline-none transition-all resize-none ${errors.message ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'}`}
                  />
                  {errors.message && <p className="text-red-500 text-xs mt-1 font-inter">{errors.message}</p>}
                </motion.div>

                <motion.button
                  variants={formFieldVariant}
                  whileHover={{ scale: 1.03, y: -3, boxShadow: '0 12px 35px rgba(124,58,237,0.35)' }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  id="contact-submit"
                  disabled={status === 'sending'}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-orbitron text-sm tracking-widest font-bold text-white disabled:opacity-60 transition-all cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
                >
                  {status === 'sending' ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> SENDING...</>
                  ) : (
                    <><Send size={16} /> SEND MESSAGE</>
                  )}
                </motion.button>
              </motion.form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
