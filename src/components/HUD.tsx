import React, { useRef, useEffect, useCallback } from 'react';
import type { GameState } from '../types';
import { carGlobalPosition, carGlobalAngle, ZONES, PROJECT_BILLBOARDS } from './Car';
import { useStore } from '../store/useStore';
import './HUD.css';

interface HUDProps {
  gameState: GameState;
  totalProjects: number;
}

// Map world coordinates to minimap canvas coordinates
const worldToMap = (wx: number, wz: number, canvasSize: number) => {
  const mapScale = canvasSize / 64; // world is ~64 units wide
  const cx = (wx + 32) * mapScale;
  const cy = (wz + 32) * mapScale;
  return { cx, cy };
};

export const HUD: React.FC<HUDProps> = ({ gameState, totalProjects }) => {
  const minimapRef = useRef<HTMLCanvasElement>(null);
  const compassRef = useRef<HTMLSpanElement>(null);
  const animRef = useRef<number>(0);
  const timeOfDay = useStore((s) => s.timeOfDay);

  const drawMinimap = useCallback(() => {
    // Update compass
    if (compassRef.current) {
      let angleDeg = Math.round((carGlobalAngle.value * 180) / Math.PI) % 360;
      if (angleDeg < 0) angleDeg += 360;
      
      let heading = 'N';
      if (angleDeg >= 337.5 || angleDeg < 22.5) heading = 'N';
      else if (angleDeg >= 22.5 && angleDeg < 67.5) heading = 'NE';
      else if (angleDeg >= 67.5 && angleDeg < 112.5) heading = 'E';
      else if (angleDeg >= 112.5 && angleDeg < 157.5) heading = 'SE';
      else if (angleDeg >= 157.5 && angleDeg < 202.5) heading = 'S';
      else if (angleDeg >= 202.5 && angleDeg < 247.5) heading = 'SW';
      else if (angleDeg >= 247.5 && angleDeg < 292.5) heading = 'W';
      else if (angleDeg >= 292.5 && angleDeg < 337.5) heading = 'NW';
      
      compassRef.current.innerText = `${heading} · ${angleDeg}°`;
    }
    const canvas = minimapRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    ctx.clearRect(0, 0, size, size);

    // Background
    ctx.fillStyle = 'rgba(4, 4, 15, 0.85)';
    ctx.fillRect(0, 0, size, size);

    // Grid lines
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.1)';
    ctx.lineWidth = 0.5;
    const step = size / 8;
    for (let i = 0; i <= 8; i++) {
      ctx.beginPath();
      ctx.moveTo(i * step, 0);
      ctx.lineTo(i * step, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * step);
      ctx.lineTo(size, i * step);
      ctx.stroke();
    }

    // Draw zone markers
    const zones = [
      { key: 'welcome', label: 'W', color: '#00f0ff', x: ZONES.welcome.x, z: ZONES.welcome.z, r: ZONES.welcome.radius },
      { key: 'projects', label: 'P', color: '#00f0ff', x: ZONES.projects.x, z: ZONES.projects.z, r: ZONES.projects.radius },
      { key: 'skills', label: 'S', color: '#ffff00', x: ZONES.skills.x, z: ZONES.skills.z, r: ZONES.skills.radius },
      { key: 'resume', label: 'R', color: '#39ff14', x: ZONES.resume.x, z: ZONES.resume.z, r: ZONES.resume.radius },
      { key: 'contact', label: 'C', color: '#ff007f', x: ZONES.contact.x, z: ZONES.contact.z, r: ZONES.contact.radius },
    ];

    zones.forEach(({ color, x, z, r, label }) => {
      const { cx, cy } = worldToMap(x, z, size);
      const pr = (r / 64) * size;
      ctx.beginPath();
      ctx.arc(cx, cy, pr, 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.4;
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.fillStyle = color;
      ctx.font = 'bold 7px Orbitron, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, cx, cy);
    });

    // Project billboard dots
    PROJECT_BILLBOARDS.forEach((bb) => {
      const { cx, cy } = worldToMap(bb.x, bb.z, size);
      ctx.beginPath();
      ctx.arc(cx, cy, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#00f0ff';
      ctx.fill();
    });

    // Map boundary
    const { cx: bx1, cy: by1 } = worldToMap(-30, -30, size);
    const { cx: bx2, cy: by2 } = worldToMap(30, 30, size);
    ctx.strokeStyle = 'rgba(255, 0, 127, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(bx1, by1, bx2 - bx1, by2 - by1);

    // Car position & heading arrow
    const { cx: carX, cy: carZ } = worldToMap(carGlobalPosition.x, carGlobalPosition.z, size);
    const angle = carGlobalAngle.value;

    // Glow effect under car
    const gradient = ctx.createRadialGradient(carX, carZ, 0, carX, carZ, 6);
    gradient.addColorStop(0, 'rgba(0, 240, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(0, 240, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(carX, carZ, 6, 0, Math.PI * 2);
    ctx.fill();

    // Car triangle
    ctx.save();
    ctx.translate(carX, carZ);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, -5);
    ctx.lineTo(-3, 3);
    ctx.lineTo(3, 3);
    ctx.closePath();
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.restore();

    animRef.current = requestAnimationFrame(drawMinimap);
  }, []);

  useEffect(() => {
    animRef.current = requestAnimationFrame(drawMinimap);
    return () => cancelAnimationFrame(animRef.current);
  }, [drawMinimap]);

  const speedPercent = Math.min(100, gameState.speed);
  const driftPercent = Math.min(100, gameState.drift);

  return (
    <div className="hud-overlay" id="hud-overlay">
      {/* Top Left: Zone Banner */}
      {gameState.currentZone && (
        <div className="zone-banner" id="zone-banner">
          <span className="zone-label">
            {gameState.currentZone === 'projects' && gameState.activeProjectZoneId
              ? '[ DRIVE IN · PRESS ENTER ]'
              : gameState.currentZone === 'contact'
              ? '[ PRESS ENTER · TO CONNECT ]'
              : gameState.currentZone === 'resume'
              ? '[ DOWNLOADING RESUME... ]'
              : `[ ${gameState.currentZone.toUpperCase()} ZONE ]`}
          </span>
        </div>
      )}

      {/* Bottom Left: Speedometer + Drift */}
      <div className="hud-bottom-left" id="hud-speed-panel">
        <div className="speed-display">
          <div className="speed-arc-container">
            <svg viewBox="0 0 100 60" width="110" height="66">
              {/* Background arc */}
              <path d="M 10 55 A 40 40 0 0 1 90 55" fill="none" stroke="rgba(0,240,255,0.15)" strokeWidth="4" />
              {/* Speed arc */}
              <path
                d="M 10 55 A 40 40 0 0 1 90 55"
                fill="none"
                stroke="#00f0ff"
                strokeWidth="4"
                strokeDasharray={`${(speedPercent / 100) * 125.6} 125.6`}
                style={{ filter: 'drop-shadow(0 0 4px #00f0ff)' }}
              />
              {/* Needle dot */}
              <circle cx="50" cy="55" r="3" fill="#00f0ff" />
            </svg>
          </div>
          <div className="speed-value">
            <span id="speed-number">{gameState.speed}</span>
            <span className="speed-unit">KPH</span>
          </div>
        </div>

        {/* Drift meter */}
        {gameState.drift > 5 && (
          <div className="drift-meter" id="drift-meter">
            <span className="drift-label">DRIFT</span>
            <div className="drift-bar-track">
              <div
                className="drift-bar-fill"
                style={{ width: `${driftPercent}%` }}
              />
            </div>
            <span className="drift-value">{Math.round(gameState.drift)}%</span>
          </div>
        )}
      </div>

      {/* Bottom Right: Minimap */}
      <div className="hud-minimap" id="hud-minimap">
        <div className="w-full flex justify-between items-center px-1 mb-1">
          <span className="minimap-title">MAP</span>
          <span ref={compassRef} className="font-orbitron font-bold text-[8px] text-[#00f0ff] tracking-wider">N · 0°</span>
        </div>
        <canvas ref={minimapRef} width={150} height={150} className="minimap-canvas" />
        <div className="minimap-legend">
          <span style={{ color: '#00f0ff' }}>P</span>=Projects&nbsp;
          <span style={{ color: '#ffff00' }}>S</span>=Skills&nbsp;
          <span style={{ color: '#39ff14' }}>R</span>=Resume&nbsp;
          <span style={{ color: '#ff007f' }}>C</span>=Contact
        </div>
      </div>

      {/* Top Right: Achievement Panel */}
      <div className="hud-achievements" id="hud-achievements">
        <div className="flex justify-between items-center border-b border-[#ff007f]/25 pb-1.5 mb-1.5">
          <span className="achievement-title border-none pb-0 mb-0">PROGRESS</span>
          <span className="text-[9px] font-orbitron tracking-widest text-[#00f0ff] font-bold">
            {timeOfDay >= 0.25 && timeOfDay <= 0.75 ? '☀️ DAY' : '🌙 NIGHT'}
          </span>
        </div>
        <div className="achievement-item">
          <span className="ach-icon" style={{ color: '#00f0ff' }}>◈</span>
          <span className="ach-label">Projects</span>
          <span className={`ach-value ${gameState.visitedProjects.length === totalProjects ? 'complete' : ''}`}>
            {gameState.visitedProjects.length}/{totalProjects}
          </span>
        </div>
        <div className="achievement-item">
          <span className="ach-icon" style={{ color: '#39ff14' }}>◈</span>
          <span className="ach-label">Resume</span>
          <span className={`ach-value ${gameState.downloadedResume ? 'complete' : ''}`}>
            {gameState.downloadedResume ? 'SAVED' : '—'}
          </span>
        </div>
        <div className="achievement-item">
          <span className="ach-icon" style={{ color: '#ff007f' }}>◈</span>
          <span className="ach-label">Contact</span>
          <span className={`ach-value ${gameState.submittedContact ? 'complete' : ''}`}>
            {gameState.submittedContact ? 'SENT' : '—'}
          </span>
        </div>
      </div>

      {/* Bottom Center: Controls Guide */}
      <div className="hud-controls" id="hud-controls">
        <span><kbd>W/A/S/D</kbd> Drive</span>
        <span><kbd>SPACE</kbd> Drift</span>
        <span><kbd>ENTER</kbd> Interact</span>
      </div>

      {/* Mobile Touch Controls */}
      <MobileTouchControls />
    </div>
  );
};

// Mobile touch virtual joystick overlay
import { inputState } from '../hooks/useInput';

const MobileTouchControls: React.FC = () => {
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (!isTouchDevice) return null;

  const setKey = (key: keyof typeof inputState, val: boolean) => {
    inputState[key] = val;
  };

  return (
    <div className="mobile-controls" id="mobile-controls">
      <div className="mobile-dpad">
        <button
          className="dpad-btn dpad-up"
          onTouchStart={() => setKey('forward', true)}
          onTouchEnd={() => setKey('forward', false)}
          aria-label="Drive Forward"
        >▲</button>
        <button
          className="dpad-btn dpad-left"
          onTouchStart={() => setKey('left', true)}
          onTouchEnd={() => setKey('left', false)}
          aria-label="Turn Left"
        >◀</button>
        <button
          className="dpad-btn dpad-down"
          onTouchStart={() => setKey('backward', true)}
          onTouchEnd={() => setKey('backward', false)}
          aria-label="Drive Backward"
        >▼</button>
        <button
          className="dpad-btn dpad-right"
          onTouchStart={() => setKey('right', true)}
          onTouchEnd={() => setKey('right', false)}
          aria-label="Turn Right"
        >▶</button>
      </div>
      <div className="mobile-actions">
        <button
          className="mobile-action-btn drift-btn"
          onTouchStart={() => setKey('handbrake', true)}
          onTouchEnd={() => setKey('handbrake', false)}
          aria-label="Drift"
        >DRIFT</button>
        <button
          className="mobile-action-btn interact-btn"
          onTouchStart={() => { setKey('interact', true); setTimeout(() => setKey('interact', false), 200); }}
          aria-label="Interact"
        >ENTER</button>
      </div>
    </div>
  );
};
