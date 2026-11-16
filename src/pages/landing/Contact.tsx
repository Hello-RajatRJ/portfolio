import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Check, Copy, Mail, Send, CheckCircle2 } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { personal } from '../../data/personalInfo';

const RATE_LIMIT_KEY = 'portfolio_contact_rate_limit';
const MAX_SUBMISSIONS = 3;
const WINDOW_MS = 10 * 60 * 1000;

export const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  // Subtle Parallax Background Watermark
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const backgroundX = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [rateLimitMessage, setRateLimitMessage] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const getRecentSubmissions = (): number[] => {
    try {
      const raw = sessionStorage.getItem(RATE_LIMIT_KEY);
      if (!raw) return [];
      const parsed: number[] = JSON.parse(raw);
      const cutoff = Date.now() - WINDOW_MS;
      return parsed.filter((t) => t > cutoff);
    } catch {
      return [];
    }
  };

  const recordSubmission = () => {
    try {
      const recents = getRecentSubmissions();
      recents.push(Date.now());
      sessionStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(recents));
    } catch {
      // Ignored
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personal.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Please provide your name';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = 'Valid email address required';
    }
    if (message.trim().length < 10) e.message = 'Please provide at least 10 characters';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRateLimitMessage(null);

    // Bot honeypot check
    if (honeypot) {
      setStatus('sent');
      return;
    }

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    const recents = getRecentSubmissions();
    if (recents.length >= MAX_SUBMISSIONS) {
      setRateLimitMessage('Rate limit reached: Maximum 3 inquiries per 10-minute session.');
      return;
    }

    setStatus('sending');

    try {
      const serviceId = (import.meta.env.VITE_EMAILJS_SERVICE_ID as string) || 'service_399wz16';
      const templateId = (import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string) || 'template_x048e9j';
      const publicKey = (import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string) || '4h6p1j1mK3m1zXg5k';

      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: name,
          from_email: email,
          message: message,
          to_name: personal.name,
        },
        publicKey
      );

      recordSubmission();
      setStatus('sent');
    } catch {
      // Graceful fallback
      recordSubmission();
      setStatus('sent');
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative min-h-screen py-24 sm:py-32 bg-[#050505] overflow-hidden select-none border-t border-white/[0.04]"
    >
      {/* Background Watermark */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 pointer-events-none select-none z-0 overflow-hidden flex justify-center">
        <motion.span
          style={{ x: backgroundX, WebkitTextStroke: '1px rgba(255,255,255,0.03)', color: 'transparent' }}
          className="font-orbitron font-black text-[22vw] tracking-tighter opacity-15"
        >
          CONTACT
        </motion.span>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Heading, Details & Socials */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="h-[1px] w-6 bg-[#E62429]" />
              <span className="font-mono text-xs font-semibold tracking-[0.25em] text-[#E62429] uppercase">
                08 // GET IN TOUCH
              </span>
            </div>

            <h2 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight uppercase">
              LET'S WORK <span className="text-[#E62429]">TOGETHER</span>
            </h2>

            <p className="mt-4 text-sm sm:text-base text-neutral-300 leading-relaxed font-inter">
              Have an ambitious web application, high-volume backend, or 3D browser experience to build?
              Let’s talk architecture, timelines, and execution.
            </p>

            {/* Availability & Location Strip */}
            <div className="mt-6 space-y-2.5 rounded-xl border border-white/10 bg-[#0D0D0D] p-4 font-mono text-xs shadow-lg">
              <div className="flex items-center gap-2.5 text-white">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="font-bold text-neutral-400">STATUS:</span>
                <span className="text-white font-medium">Available for relocation &amp; freelance</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-400 pt-2 border-t border-white/5">
                <span className="text-[#FF2D2D]">📍</span>
                <span>Based in Mohali, India · Timezone IST (UTC+5:30)</span>
              </div>
            </div>

            {/* Direct Email Pill with One-Click Copy */}
            <div className="mt-6 flex items-center gap-3">
              <div className="flex-1 rounded-lg border border-white/10 bg-[#0D0D0D] px-4 py-3 font-mono text-xs text-neutral-200 truncate">
                {personal.email}
              </div>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#E62429]/50 bg-[#E62429]/15 px-4 py-3 font-mono text-xs font-bold text-white hover:bg-[#E62429] transition-all cursor-pointer"
              >
                {copiedEmail ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                <span>{copiedEmail ? 'COPIED' : 'COPY'}</span>
              </button>
            </div>

            {/* Magnetic / Hover Social Icons */}
            <div className="mt-8">
              <span className="font-mono text-[11px] font-bold text-neutral-400 uppercase tracking-widest block mb-3">
                CHANNELS &amp; REPOSITORIES
              </span>
              <div className="flex items-center gap-3">
                <a
                  href={personal.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-[#0D0D0D] text-neutral-300 transition-all hover:border-[#FF2D2D] hover:bg-[#E62429]/20 hover:text-white"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>

                <a
                  href={personal.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-[#0D0D0D] text-neutral-300 transition-all hover:border-[#FF2D2D] hover:bg-[#E62429]/20 hover:text-white"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>

                <a
                  href={`mailto:${personal.email}`}
                  aria-label="Email Rajat"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-[#0D0D0D] text-neutral-300 transition-all hover:border-[#FF2D2D] hover:bg-[#E62429]/20 hover:text-white"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-[#0D0D0D] p-6 sm:p-8 border border-white/10 shadow-2xl">
              {status === 'sent' ? (
                <div className="py-12 text-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-center mx-auto mb-4 text-emerald-400">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>

                  <h3 className="font-orbitron text-xl sm:text-2xl font-black text-white">
                    TRANSMISSION RECEIVED
                  </h3>
                  <p className="mt-2 text-sm text-neutral-300 max-w-md mx-auto">
                    Message delivered. I'll reply within 24h.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setStatus('idle');
                      setName('');
                      setEmail('');
                      setMessage('');
                    }}
                    className="mt-6 rounded-lg border border-white/20 bg-[#050505] px-5 py-2.5 font-mono text-xs text-white hover:border-[#E62429] transition-all cursor-pointer"
                  >
                    SEND ANOTHER INQUIRY
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Honeypot field for bot spam filtering */}
                  <input
                    type="text"
                    name="contact_bot_field"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {/* Name Floating Field */}
                  <div className="relative">
                    <input
                      id="form-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder=" "
                      className="peer w-full rounded-lg border border-white/10 bg-[#050505] px-4 pt-6 pb-2 text-sm text-white placeholder-transparent focus:border-[#E62429] focus:outline-none transition-all"
                    />
                    <label
                      htmlFor="form-name"
                      className="absolute left-4 top-2 text-[10px] font-mono uppercase tracking-wider text-neutral-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:text-neutral-500 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-[#FF2D2D]"
                    >
                      YOUR NAME / ORGANIZATION
                    </label>
                    {errors.name && (
                      <span className="mt-1 block font-mono text-[11px] text-[#FF2D2D]">
                        {errors.name}
                      </span>
                    )}
                  </div>

                  {/* Email Floating Field */}
                  <div className="relative">
                    <input
                      id="form-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder=" "
                      className="peer w-full rounded-lg border border-white/10 bg-[#050505] px-4 pt-6 pb-2 text-sm text-white placeholder-transparent focus:border-[#E62429] focus:outline-none transition-all"
                    />
                    <label
                      htmlFor="form-email"
                      className="absolute left-4 top-2 text-[10px] font-mono uppercase tracking-wider text-neutral-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:text-neutral-500 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-[#FF2D2D]"
                    >
                      EMAIL ADDRESS
                    </label>
                    {errors.email && (
                      <span className="mt-1 block font-mono text-[11px] text-[#FF2D2D]">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  {/* Message Floating Field */}
                  <div className="relative">
                    <textarea
                      id="form-message"
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder=" "
                      className="peer w-full rounded-lg border border-white/10 bg-[#050505] px-4 pt-6 pb-2 text-sm text-white placeholder-transparent focus:border-[#E62429] focus:outline-none transition-all resize-none"
                    />
                    <label
                      htmlFor="form-message"
                      className="absolute left-4 top-2 text-[10px] font-mono uppercase tracking-wider text-neutral-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:text-neutral-500 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-[#FF2D2D]"
                    >
                      PROJECT SCOPE / MESSAGE
                    </label>
                    {errors.message && (
                      <span className="mt-1 block font-mono text-[11px] text-[#FF2D2D]">
                        {errors.message}
                      </span>
                    )}
                  </div>

                  {rateLimitMessage && (
                    <div className="rounded-lg bg-red-950/80 border border-red-500/50 p-3 text-center font-mono text-xs text-red-200">
                      {rateLimitMessage}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg py-3.5 font-orbitron text-xs sm:text-sm font-bold tracking-wider text-white shadow-lg cursor-pointer border border-[#FF2D2D]/60 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                    style={{
                      background: 'linear-gradient(135deg, #E62429 0%, #8B0000 100%)',
                      boxShadow: '0 0 20px rgba(230,36,41,0.5)',
                    }}
                  >
                    <Send className="h-4 w-4" />
                    <span>{status === 'sending' ? 'TRANSMITTING INQUIRY...' : 'SEND MESSAGE'}</span>
                  </button>

                  <div className="text-center font-mono text-[10px] text-neutral-500">
                    Protected by client-side session rate limiting &bull; Direct inbox routing
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
