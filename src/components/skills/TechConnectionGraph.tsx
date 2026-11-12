import React from 'react';
import { motion } from 'framer-motion';
import { findTechMeta, type TechMetadata } from '../../data/techRegistry';
import { TechFallbackIcon } from './TechFallbackIcon';

interface TechConnectionGraphProps {
  chain: string[];
  activeTechId: string;
  onSelectTech: (meta: TechMetadata) => void;
}

export const TechConnectionGraph: React.FC<TechConnectionGraphProps> = ({
  chain,
  activeTechId,
  onSelectTech,
}) => {
  return (
    <div className="p-3.5 rounded-xl bg-white/[0.025] border border-white/[0.12]">
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="font-orbitron text-[11px] tracking-[0.18em] text-[#FF3038] uppercase font-bold">
          TECHNOLOGY CONNECTIONS
        </span>
        <span className="font-inter text-[11px] text-[#A0A0A0]">Click node to inspect</span>
      </div>

      <div className="flex flex-wrap items-center gap-y-2.5 gap-x-1">
        {chain.map((nodeName, idx) => {
          const meta = findTechMeta(nodeName);
          const isCurrent = meta.id === activeTechId && meta.name === nodeName;

          return (
            <React.Fragment key={`${nodeName}-${idx}`}>
              <motion.button
                type="button"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.08 + idx * 0.06, duration: 0.35 }}
                onClick={() => onSelectTech(meta)}
                className={`group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-inter transition-all ${
                  isCurrent
                    ? 'bg-[#FF3038]/15 border-[#FF3038] text-white shadow-[0_0_16px_rgba(255,48,56,0.3)]'
                    : 'bg-black/60 border-white/15 text-[#E5E5E5] hover:border-[#FF3038]/80 hover:bg-[#FF3038]/10 hover:text-white'
                }`}
              >
                <span className="w-4 h-4 shrink-0">
                  <TechFallbackIcon tech={meta} />
                </span>
                <span className="font-semibold whitespace-nowrap">{nodeName}</span>
              </motion.button>

              {idx < chain.length - 1 && (
                <div className="flex items-center px-0.5 shrink-0" aria-hidden="true">
                  <svg width="26" height="14" viewBox="0 0 26 14" fill="none">
                    <path
                      d="M1 7 H21"
                      stroke="rgba(255,48,56,0.28)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <motion.path
                      d="M1 7 H21"
                      stroke="#FF3038"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeDasharray="6 14"
                      animate={{ strokeDashoffset: [20, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.15,
                        ease: 'linear',
                        delay: idx * 0.15,
                      }}
                    />
                    <path
                      d="M18 3.5 L23.5 7 L18 10.5"
                      stroke="#FF3038"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
