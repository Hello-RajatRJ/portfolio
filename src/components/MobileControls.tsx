import React from 'react';
import { inputState } from '../hooks/useInput';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Zap, RefreshCw, Camera } from 'lucide-react';

interface MobileControlsProps {
  onCameraToggle: () => void;
  onReset: () => void;
}

export const MobileControls: React.FC<MobileControlsProps> = ({ onCameraToggle, onReset }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-30 flex flex-col justify-between p-4 md:hidden select-none">
      {/* Top Mobile Quick Actions */}
      <div className="flex justify-end gap-2 pointer-events-auto">
        <button
          onClick={onCameraToggle}
          className="w-10 h-10 rounded-full bg-red-950/70 border border-red-500/40 text-red-300 flex items-center justify-center active:bg-red-600 active:text-white backdrop-blur shadow-lg"
          title="Change Camera"
        >
          <Camera size={18} />
        </button>
        <button
          onClick={onReset}
          className="w-10 h-10 rounded-full bg-red-950/70 border border-red-500/40 text-red-300 flex items-center justify-center active:bg-red-600 active:text-white backdrop-blur shadow-lg"
          title="Reset Car"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Bottom Driving Controls */}
      <div className="flex items-end justify-between pointer-events-auto pb-4">
        {/* Left: Steering D-Pad */}
        <div className="flex gap-2">
          <button
            onTouchStart={() => { inputState.left = true; }}
            onTouchEnd={() => { inputState.left = false; }}
            onMouseDown={() => { inputState.left = true; }}
            onMouseUp={() => { inputState.left = false; }}
            className="w-14 h-14 rounded-2xl bg-black/60 border-2 border-red-600/50 text-white flex items-center justify-center active:bg-red-600 active:scale-95 transition backdrop-blur shadow-xl"
          >
            <ArrowLeft size={24} />
          </button>
          <button
            onTouchStart={() => { inputState.right = true; }}
            onTouchEnd={() => { inputState.right = false; }}
            onMouseDown={() => { inputState.right = true; }}
            onMouseUp={() => { inputState.right = false; }}
            className="w-14 h-14 rounded-2xl bg-black/60 border-2 border-red-600/50 text-white flex items-center justify-center active:bg-red-600 active:scale-95 transition backdrop-blur shadow-xl"
          >
            <ArrowRight size={24} />
          </button>
        </div>

        {/* Right: Pedals & Nitro */}
        <div className="flex flex-col items-end gap-2">
          {/* Nitro & Handbrake row */}
          <div className="flex gap-2">
            <button
              onTouchStart={() => { inputState.wheelie = true; }}
              onTouchEnd={() => { inputState.wheelie = false; }}
              onMouseDown={() => { inputState.wheelie = true; }}
              onMouseUp={() => { inputState.wheelie = false; }}
              className="px-4 h-11 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 border border-orange-400 text-white font-orbitron font-bold text-xs flex items-center gap-1 active:scale-95 transition shadow-lg shadow-red-900/40"
            >
              <Zap size={14} /> NITRO
            </button>
            <button
              onTouchStart={() => { inputState.handbrake = true; }}
              onTouchEnd={() => { inputState.handbrake = false; }}
              onMouseDown={() => { inputState.handbrake = true; }}
              onMouseUp={() => { inputState.handbrake = false; }}
              className="px-3.5 h-11 rounded-xl bg-zinc-900/80 border border-zinc-700 text-zinc-200 font-orbitron text-xs flex items-center active:bg-red-800 active:text-white transition"
            >
              HANDBRAKE
            </button>
          </div>

          {/* Throttle & Brake Pedals */}
          <div className="flex gap-3">
            <button
              onTouchStart={() => { inputState.backward = true; }}
              onTouchEnd={() => { inputState.backward = false; }}
              onMouseDown={() => { inputState.backward = true; }}
              onMouseUp={() => { inputState.backward = false; }}
              className="w-14 h-16 rounded-2xl bg-black/70 border-2 border-red-700/60 text-red-400 flex flex-col items-center justify-center active:bg-red-700 active:text-white transition shadow-xl"
            >
              <ArrowDown size={22} />
              <span className="text-[9px] font-orbitron font-bold mt-0.5">BRAKE</span>
            </button>
            <button
              onTouchStart={() => { inputState.forward = true; }}
              onTouchEnd={() => { inputState.forward = false; }}
              onMouseDown={() => { inputState.forward = true; }}
              onMouseUp={() => { inputState.forward = false; }}
              className="w-16 h-20 rounded-2xl bg-gradient-to-t from-red-800 to-red-600 border-2 border-red-400 text-white flex flex-col items-center justify-center active:scale-95 transition shadow-2xl shadow-red-700/50"
            >
              <ArrowUp size={28} />
              <span className="text-[10px] font-orbitron font-bold mt-0.5">GAS</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

