import React from 'react';
import type { EnergyChargeState } from './useEnergyCharge';

interface EnergyProgressBarProps {
  targetLevel: number;
  charge: EnergyChargeState;
  isHovered: boolean;
}

export const EnergyProgressBar: React.FC<EnergyProgressBarProps> = ({
  targetLevel,
  charge,
  isHovered,
}) => {
  const activeWidth = charge.isCharging || charge.isCharged ? targetLevel : charge.percent;

  return (
    <div className="space-y-1.5">
      <div
        className="relative h-2.5 rounded-full overflow-visible border border-white/10 bg-white/[0.04]"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={charge.percent}
        aria-label={`Self-assessed proficiency indicator: ${targetLevel}%`}
      >
        {/* Left red energy source emitter */}
        <span
          className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-0.5 w-2 h-2 rounded-full transition-all duration-300 pointer-events-none ${
            charge.isCharging || charge.isCharged
              ? 'bg-[#FF3038] shadow-[0_0_10px_#FF3038]'
              : 'bg-white/20'
          }`}
        />

        {/* Clipping track for gradient fill + flowing energy particles */}
        <div className="relative w-full h-full rounded-full overflow-hidden">
          <div
            className="h-full rounded-full relative overflow-hidden transition-[width] duration-[1150ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              width: `${activeWidth}%`,
              background: 'linear-gradient(90deg, #C91520 0%, #FF3038 76%, #FF6B70 100%)',
              boxShadow: isHovered
                ? '0 0 14px rgba(255, 48, 56, 0.7)'
                : '0 0 8px rgba(201, 21, 32, 0.45)',
            }}
          >
            {/* Moving energy particles & light sweep during charge */}
            <div
              className={`energy-stream-particles ${charge.isCharging ? 'is-charging' : ''}`}
            />
          </div>
        </div>

        {/* Settled endpoint energy capacitor pulse */}
        {(charge.isCharging || charge.isCharged) && activeWidth > 2 && (
          <span
            className="energy-endpoint-node"
            style={{
              left: `${activeWidth}%`,
              opacity: charge.isCharged ? 1 : 0.7,
            }}
          />
        )}
      </div>
    </div>
  );
};

