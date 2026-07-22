import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { useStore } from '../store/useStore';

interface CategoryCardProps {
  title: string;
  subtitle?: string;
  icon: string;
  imageSrc: string;
  slug: string;
  index: number;
  gradient: string;
  accentColor?: string;
  badge?: string;
  onClick?: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  subtitle,
  icon,
  imageSrc,
  slug,
  index,
  gradient,
  accentColor = '#8b5cf6',
  badge,
  onClick,
}) => {
  const setShowcasePage = useStore((s) => s.setShowcasePage);
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    // 3D tilt on mouse move
    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = el.getBoundingClientRect();
      const x = (e.clientX - left - width / 2) / (width / 2);
      const y = (e.clientY - top - height / 2) / (height / 2);

      gsap.to(el, {
        rotateX: -y * 10,
        rotateY: x * 10,
        duration: 0.4,
        ease: 'power2.out',
        transformPerspective: 800,
      });

      if (glowRef.current) {
        gsap.to(glowRef.current, {
          x: x * 40,
          y: y * 40,
          opacity: 0.7,
          duration: 0.3,
        });
      }

      if (borderRef.current) {
        const angle = Math.atan2(y, x) * (180 / Math.PI);
        borderRef.current.style.background = `conic-gradient(from ${angle}deg, transparent 30%, ${accentColor} 60%, transparent 90%)`;
      }
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.4)',
      });
      if (glowRef.current) {
        gsap.to(glowRef.current, { opacity: 0, duration: 0.3 });
      }
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [accentColor]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="relative group"
      style={{ perspective: '1000px' }}
    >
      <div
        ref={cardRef}
        onClick={onClick || (() => setShowcasePage(slug))}
        className="relative rounded-3xl overflow-hidden cursor-pointer h-[400px] md:h-[460px] border border-white/10 bg-[#0a0a0f] transition-all duration-500 hover:border-white/30"
        style={{ transformStyle: 'preserve-3d' }}
        data-cursor-label="EXPLORE"
      >
        {/* Animated accent border on hover */}
        <div
          ref={borderRef}
          className="absolute -inset-[1px] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none"
        />

        {/* Card inner */}
        <div className="absolute inset-[1px] rounded-3xl overflow-hidden z-10">
          {/* Background image with zoom */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
            style={{ backgroundImage: `url(${imageSrc})` }}
          />

          {/* Gradient overlay */}
          <div
            className="absolute inset-0 transition-opacity duration-500"
            style={{ background: gradient }}
          />

          {/* Glass blur */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] group-hover:backdrop-blur-0 transition-all duration-500" />

          {/* Glowing accent orb */}
          <div
            ref={glowRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full opacity-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${accentColor}40 0%, transparent 70%)`,
              filter: 'blur(35px)',
            }}
          />

          {/* Content */}
          <div className="relative z-20 h-full flex flex-col justify-between p-6 md:p-8">
            {/* Top row: Badge & Icon */}
            <div className="flex justify-between items-start">
              {badge && (
                <span
                  className="px-3.5 py-1.5 rounded-full font-orbitron text-[10px] tracking-[0.2em] font-bold text-white border backdrop-blur-md shadow-lg"
                  style={{
                    backgroundColor: `${accentColor}25`,
                    borderColor: `${accentColor}60`,
                    color: '#ffffff',
                  }}
                >
                  {badge}
                </span>
              )}
              <motion.div
                className="text-4xl md:text-5xl drop-shadow-xl"
                whileHover={{ scale: 1.2, rotate: 8 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {icon}
              </motion.div>
            </div>

            {/* Bottom row: Title, Subtitle, Explore button */}
            <div>
              <h3 className="text-2xl md:text-3xl font-orbitron font-black text-white mb-1.5 tracking-tight group-hover:translate-x-1 transition-transform duration-300">
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs font-inter text-white/70 mb-5 font-light tracking-wide">
                  {subtitle}
                </p>
              )}

              {/* Explore Button */}
              <motion.div
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-orbitron font-bold tracking-widest text-white shadow-xl transition-all duration-300"
                style={{
                  backgroundColor: `${accentColor}35`,
                  borderColor: `${accentColor}80`,
                  borderWidth: '1px',
                  backdropFilter: 'blur(12px)',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>ENTER EXPERIENCE</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryCard;
