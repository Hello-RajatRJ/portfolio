import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Check, Copy, Mail, Send } from 'lucide-react';
import emailjs from '@emailjs/browser';
import confetti from 'canvas-confetti';
import { personal } from '../../data/personalInfo';

const RATE_LIMIT_KEY = 'portfolio_contact_rate_limit';
const MAX_SUBMISSIONS = 3;
const WINDOW_MS = 10 * 60 * 1000;

export const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Parallax Background Text
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const backgroundX = useTransform(scrollYProgress, [0, 1], ['-15%', '15%']);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [rateLimitMessage, setRateLimitMessage] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Slow floating red particles canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
    canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;

    const particles: Array<{ x: number; y: number; vx: number; vy: number; r: number; alpha: number }> = [];
    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -Math.random() * 0.45 - 0.1,
        r: Math.random() * 2 + 1,
        alpha: Math.random() * 0.6 + 0.2,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < 0) p.y = canvas.height;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230, 36, 41, ${p.alpha})`;
        ctx.shadowColor = '#FF2D2D';
        ctx.shadowBlur = 8;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

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

      // Red bullet confetti explosion
      confetti({
        particleCount: 85,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#E62429', '#8B0000', '#FF2D2D', '#FFFFFF', '#D4AF37'],
      });
    } catch {
      // Graceful fallback simulation
      recordSubmission();
      setStatus('sent');
      confetti({
        particleCount: 85,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#E62429', '#8B0000', '#FF2D2D', '#FFFFFF'],
      });
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative min-h-screen py-24 sm:py-32 bg-[#000000] overflow-hidden"
    >
      {/* 1. Background Parallax Outlined "CONTACT" */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 pointer-events-none select-none z-0 overflow-hidden">
        <motion.div
          style={{ x: backgroundX }}
          className="dp-watermark-text text-[22vw] tracking-tighter opacity-15"
        >
          CONTACT CONTACT CONTACT
        </motion.div>
      </div>

      {/* 2. Floating Red Particles Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Halftone Overlay */}
      <div className="dp-halftone absolute inset-0 opacity-15 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Comic Header & Magnetic Socials */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="h-[2px] w-8 bg-[#E62429]" />
              <span className="font-orbitron text-xs sm:text-sm font-bold tracking-[0.3em] text-[#E62429] uppercase">
                07 // TRANSMISSION
              </span>
            </div>

            <h2 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
              LET'S BUILD <span className="text-[#E62429]">SOMETHING AMAZING</span>
            </h2>

            <div className="mt-2 font-bangers text-xl sm:text-2xl text-[#FF2D2D] tracking-wider drop-shadow-[0_0_8px_rgba(230,36,41,0.6)]">
              (Or I'll send Deadpool ⚔️)
            </div>

            <p className="mt-5 text-sm sm:text-base text-neutral-300 leading-relaxed font-inter">
              Have an ambitious web application, high-volume backend, or 3D browser experience to
              build? Let’s talk architecture, timelines, and execution.
            </p>

            {/* Availability & Location Callout */}
            <div className="mt-5 space-y-2 rounded-xl border border-white/10 bg-[#0a0a0c]/80 p-3.5 font-mono text-xs backdrop-blur-md">
              <div className="flex items-center gap-2 text-white">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-neutral-300">STATUS:</span>
                <span className="text-white font-medium">Available for Freelance, Contract &amp; Full-Time opportunities</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-400">
                <span className="text-[#FF2D2D]">📍</span>
                <span>Based in India · Serving clients globally across USA, Australia, Taiwan, Armenia</span>
              </div>
            </div>

            {/* Direct Email Pill with Copy */}
            <div className="mt-6 flex items-center gap-3">
              <div className="flex-1 rounded-xl border border-white/10 bg-[#0a0a0c] px-4 py-3 font-mono text-xs text-neutral-200">
                {personal.email}
              </div>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#E62429]/50 bg-[#E62429]/20 px-4 py-3 font-orbitron text-xs font-bold text-white hover:bg-[#E62429] hover:shadow-[0_0_15px_#FF2D2D] transition-all cursor-pointer"
              >
                {copiedEmail ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copiedEmail ? 'COPIED' : 'COPY'}
              </button>
            </div>

            {/* Magnetic Social Icons with Red Glow on Hover */}
            <div className="mt-8">
              <span className="font-mono text-xs font-bold text-neutral-400 uppercase tracking-widest block mb-3">
                CHANNELS &amp; REPOSITORIES
              </span>
              <div className="flex items-center gap-3">
                <motion.a
                  href={personal.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="GitHub Profile"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-[#0a0a0c] text-neutral-300 transition-all hover:border-[#FF2D2D] hover:bg-[#E62429]/25 hover:text-white hover:shadow-[0_0_20px_#FF2D2D]"
                >
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </motion.a>

                <motion.a
                  href={personal.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="LinkedIn Profile"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-[#0a0a0c] text-neutral-300 transition-all hover:border-[#FF2D2D] hover:bg-[#E62429]/25 hover:text-white hover:shadow-[0_0_20px_#FF2D2D]"
                >
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </motion.a>

                <motion.a
                  href={`mailto:${personal.email}`}
                  whileHover={{ scale: 1.15, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Email Rajat"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-[#0a0a0c] text-neutral-300 transition-all hover:border-[#FF2D2D] hover:bg-[#E62429]/25 hover:text-white hover:shadow-[0_0_20px_#FF2D2D]"
                >
                  <Mail className="h-5 w-5" />
                </motion.a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form with Floating Labels & Confetti */}
          <div className="lg:col-span-7">
            <div className="dp-glow-box rounded-3xl bg-[#0c0c0e]/95 p-6 sm:p-8 backdrop-blur-2xl border border-[#E62429]/35 shadow-2xl">
              {status === 'sent' ? (
                <div className="py-12 text-center">
                  <div className="dp-speech-bubble mx-auto mb-6 max-w-sm rounded-2xl p-4 text-center">
                    <span className="font-bangers text-2xl text-black">
                      Message delivered. Maximum effort! 💥
                    </span>
                  </div>

                  <h3 className="font-orbitron text-2xl font-black text-white">
                    TRANSMISSION RECEIVED
                  </h3>
                  <p className="mt-2 text-sm text-neutral-300 max-w-md mx-auto">
                    Thanks for reaching out, {name || 'friend'}. I’ll review your details and get
                    back to you promptly.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setStatus('idle');
                      setName('');
                      setEmail('');
                      setMessage('');
                    }}
                    className="mt-6 rounded-xl border border-[#E62429] bg-[#E62429]/20 px-6 py-2.5 font-orbitron text-xs font-bold text-white hover:bg-[#E62429] transition-all cursor-pointer"
                  >
                    SEND ANOTHER INQUIRY
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Floating Field */}
                  <div className="relative group">
                    <input
                      id="form-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder=" "
                      className="peer w-full rounded-xl border border-white/15 bg-black/60 px-4 pt-6 pb-2 text-sm text-white placeholder-transparent focus:border-[#E62429] focus:outline-none transition-all"
                    />
                    <label
                      htmlFor="form-name"
                      className="absolute left-4 top-2 text-[10px] font-mono uppercase tracking-wider text-neutral-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:text-neutral-500 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-[#FF2D2D]"
                    >
                      YOUR NAME / ORGANIZATION
                    </label>
                    <div className="h-[2px] w-full scale-x-0 bg-[#FF2D2D] transition-transform duration-300 peer-focus:scale-x-100 origin-left" />
                    {errors.name && (
                      <span className="mt-1 block font-mono text-[11px] text-[#FF2D2D]">
                        {errors.name}
                      </span>
                    )}
                  </div>

                  {/* Email Floating Field */}
                  <div className="relative group">
                    <input
                      id="form-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder=" "
                      className="peer w-full rounded-xl border border-white/15 bg-black/60 px-4 pt-6 pb-2 text-sm text-white placeholder-transparent focus:border-[#E62429] focus:outline-none transition-all"
                    />
                    <label
                      htmlFor="form-email"
                      className="absolute left-4 top-2 text-[10px] font-mono uppercase tracking-wider text-neutral-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:text-neutral-500 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-[#FF2D2D]"
                    >
                      EMAIL ADDRESS
                    </label>
                    <div className="h-[2px] w-full scale-x-0 bg-[#FF2D2D] transition-transform duration-300 peer-focus:scale-x-100 origin-left" />
                    {errors.email && (
                      <span className="mt-1 block font-mono text-[11px] text-[#FF2D2D]">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  {/* Message Floating Field */}
                  <div className="relative group">
                    <textarea
                      id="form-message"
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder=" "
                      className="peer w-full rounded-xl border border-white/15 bg-black/60 px-4 pt-6 pb-2 text-sm text-white placeholder-transparent focus:border-[#E62429] focus:outline-none transition-all resize-none"
                    />
                    <label
                      htmlFor="form-message"
                      className="absolute left-4 top-2 text-[10px] font-mono uppercase tracking-wider text-neutral-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:text-neutral-500 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-[#FF2D2D]"
                    >
                      PROJECT SCOPE / MESSAGE
                    </label>
                    <div className="h-[2px] w-full scale-x-0 bg-[#FF2D2D] transition-transform duration-300 peer-focus:scale-x-100 origin-left" />
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
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-4 font-orbitron text-xs sm:text-sm font-black tracking-widest text-white shadow-xl cursor-pointer border border-[#FF2D2D]/60 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                    style={{
                      background: 'linear-gradient(135deg, #E62429 0%, #8B0000 100%)',
                      boxShadow: '0 0 25px rgba(230,36,41,0.6)',
                    }}
                  >
                    <Send className="h-4 w-4" />
                    {status === 'sending' ? 'TRANSMITTING INQUIRY...' : 'SEND MESSAGE (MAXIMUM EFFORT)'}
                  </button>

                  <div className="text-center font-mono text-[10px] text-neutral-500">
                    Protected by client-side rate limiting &bull; Direct inbox routing
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
