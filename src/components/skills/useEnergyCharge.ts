import { useEffect, useState } from 'react';

export interface EnergyChargeState {
  percent: number;
  isCharging: boolean;
  isCharged: boolean;
}

export function useEnergyCharge(
  targetLevel: number,
  active: boolean,
  delayMs: number,
  replayKey: number,
  reducedMotion: boolean
): EnergyChargeState {
  const [state, setState] = useState<EnergyChargeState>(() => ({
    percent: reducedMotion ? targetLevel : 0,
    isCharging: false,
    isCharged: reducedMotion,
  }));

  useEffect(() => {
    if (!active) return;

    if (reducedMotion) {
      const id = requestAnimationFrame(() => {
        setState({ percent: targetLevel, isCharging: false, isCharged: true });
      });
      return () => cancelAnimationFrame(id);
    }

    let rafId = 0;
    let cancelled = false;
    const duration = 1150;

    const resetId = requestAnimationFrame(() => {
      if (!cancelled) {
        setState({ percent: 0, isCharging: false, isCharged: false });
      }
    });

    const timeoutId = window.setTimeout(() => {
      if (cancelled) return;
      const startTime = performance.now();

      const step = (now: number) => {
        if (cancelled) return;
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.round(eased * targetLevel);

        if (progress < 1) {
          setState({ percent: currentVal, isCharging: true, isCharged: false });
          rafId = requestAnimationFrame(step);
        } else {
          setState({ percent: targetLevel, isCharging: false, isCharged: true });
        }
      };

      rafId = requestAnimationFrame(step);
    }, delayMs);

    return () => {
      cancelled = true;
      cancelAnimationFrame(resetId);
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
    };
  }, [active, targetLevel, delayMs, replayKey, reducedMotion]);

  return state;
}

