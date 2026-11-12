import React, { useRef, useEffect, useCallback, useState, Suspense, lazy } from 'react';
import type { GameState, GameMode, Project } from '../types';
import { carGlobalPosition, carGlobalAngle, fuelSyncRequest, resetSkillCubes, tourJumpRequest, ZONES } from './CarState';
import { PROJECT_LOCATIONS } from '../data/projectLocations';
import { resetBowlingPins } from './world/GameModesManager';
import { AI_DEPARTMENTS, AI_DEPARTMENT_MAP } from '../data/aiFactoryData';
import { PortfolioDrawer } from './PortfolioDrawer';
import {
  Volume2,
  VolumeX,
  HelpCircle,
  Folder,
  Flag,
  Target,
  Sparkles,
  Compass,
  X,
  RotateCcw,
  Fuel,
  Cpu,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from 'lucide-react';
import './HUD.css';

const AIFactoryModal = lazy(() => import('./AIFactoryModal'));

const CAR_OPTIONS = [
  {
    id: 'charger' as const,
    name: 'Dodge Charger R/T',
    subtitle: '1969 Supercharged HEMI V8',
    badge: '900 HP · PRO-MOD',
    desc: 'Dominic Toretto inspired muscle icon featuring a custom blown 426 HEMI V8, reinforced chromoly chassis, and extreme straight-line acceleration.',
    topSpeed: 98,
    accel: 95,
    handling: 88,
    nitro: 96,
    hp: '900 HP',
    zeroToHundred: '3.1s',
    topSpeedKmh: '340 km/h',
    drivetrain: 'RWD · Supercharged V8',
    weight: '1,650 kg',
  },
  {
    id: 'mustang' as const,
    name: 'Mustang GT Coupe',
    subtitle: '5.0L High-Output Racing Spec',
    badge: '520 HP · GT SPORT',
    desc: 'High-downforce aero chassis with signature tri-bar LED lighting, tuned magnetic ride damping, and active wheelie pop under nitro boost.',
    topSpeed: 92,
    accel: 90,
    handling: 94,
    nitro: 92,
    hp: '520 HP',
    zeroToHundred: '3.6s',
    topSpeedKmh: '310 km/h',
    drivetrain: 'RWD · 5.0L V8 NA',
    weight: '1,580 kg',
  },
  {
    id: 'cyberpunk' as const,
    name: 'Cyberpunk Night Runner',
    subtitle: 'Dual-Motor Electric Prototype',
    badge: '780 HP · CYBER EV',
    desc: 'Futuristic stealth chassis engineered with dual permanent-magnet motors, active aero wings, and low-slung carbon ground-effect diffuser.',
    topSpeed: 95,
    accel: 92,
    handling: 96,
    nitro: 90,
    hp: '780 HP',
    zeroToHundred: '2.6s',
    topSpeedKmh: '330 km/h',
    drivetrain: 'AWD · Dual Electric',
    weight: '1,720 kg',
  },
  {
    id: 'beetle' as const,
    name: 'Neon Beetle Racer',
    subtitle: 'Lightweight Boxer-4 Turbo',
    badge: '380 HP · TURBO SPEC',
    desc: 'Featherweight agility build tuned for razor-sharp turn-in, planted high-grip handling, and rapid spool-up out of tight city corners.',
    topSpeed: 86,
    accel: 94,
    handling: 98,
    nitro: 88,
    hp: '380 HP',
    zeroToHundred: '4.1s',
    topSpeedKmh: '275 km/h',
    drivetrain: 'RWD · Turbo Boxer-4',
    weight: '1,040 kg',
  },
];

interface HUDProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  projects: Project[];
  totalProjects: number;
}

export const HUD: React.FC<HUDProps> = ({
  gameState,
  setGameState,
  projects,
}) => {
  const minimapRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const wayfinderArrowRef = useRef<SVGSVGElement>(null);
  const wayfinderDistRef = useRef<HTMLSpanElement>(null);
  const wayfinderCueRef = useRef<HTMLSpanElement>(null);
  const wayfinderTargetRef = useRef(AI_DEPARTMENTS[0]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showControlsHint, setShowControlsHint] = useState(false);
  const [stageListExpanded, setStageListExpanded] = useState(true);
  const [carToast, setCarToast] = useState<string | null>(null);

  // Precision Race Timer simulation (active in Racing mode)
  const [timerSeconds, setTimerSeconds] = useState(0);

  const handleSelectCar = useCallback(
    (carId: (typeof CAR_OPTIONS)[number]['id']) => {
      fuelSyncRequest.targetFuel = 100;
      setGameState((prev) => ({
        ...prev,
        selectedCar: carId,
        fuel: 100,
        isRefueling: false,
        showGarageModal: false,
      }));
      const car = CAR_OPTIONS.find((c) => c.id === carId);
      if (car) {
        setCarToast(`${car.name.toUpperCase()} ACTIVATED · FULL TANK (100%)`);
        setTimeout(() => setCarToast(null), 2200);
      }
    },
    [setGameState]
  );

  const handleFuelUp = useCallback(() => {
    fuelSyncRequest.targetFuel = 100;
    setGameState((s) => ({
      ...s,
      fuel: 100,
      isRefueling: false,
    }));
    setCarToast('FUELED UP TO 100% · READY TO DRIVE!');
    setTimeout(() => setCarToast(null), 2200);
  }, [setGameState]);

  const handleResetBowling = useCallback(() => {
    resetBowlingPins();
    setGameState((s) => ({
      ...s,
      bowlingPinsDown: 0,
      bowlingScoreText: 'PINS RESET · READY TO BOWL!',
    }));
    setTimeout(() => {
      setGameState((s) =>
        s.bowlingScoreText === 'PINS RESET · READY TO BOWL!'
          ? { ...s, bowlingScoreText: null }
          : s
      );
    }, 2000);
  }, [setGameState]);

  const handleResetSkills = useCallback(() => {
    resetSkillCubes();
    setGameState((s) => ({
      ...s,
      skillsDisplaced: false,
      stuntMessage: 'CORE TECHNICAL ARSENAL RESET!',
    }));
    setTimeout(() => {
      setGameState((s) =>
        s.stuntMessage === 'CORE TECHNICAL ARSENAL RESET!'
          ? { ...s, stuntMessage: null }
          : s
      );
    }, 2000);
  }, [setGameState]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Digit1') handleSelectCar('charger');
      else if (e.code === 'Digit2') handleSelectCar('mustang');
      else if (e.code === 'Digit3') handleSelectCar('cyberpunk');
      else if (e.code === 'Digit4') handleSelectCar('beetle');
      else if (e.code === 'KeyG') {
        setGameState((s) => ({ ...s, showGarageModal: !s.showGarageModal }));
      } else if (e.code === 'Escape' || e.key === 'Escape') {
        setGameState((s) => ({
          ...s,
          showGarageModal: false,
          activeFactoryDeptId: null,
          activeProject: null,
          showContact: false,
        }));
        setShowControlsHint(false);
        setShowDrawer(false);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [handleSelectCar, setGameState]);

  useEffect(() => {
    let interval: number | undefined;
    if (gameState.gameMode === 'racing') {
      interval = window.setInterval(() => {
        setTimerSeconds((prev) => prev + 0.05);
      }, 50);
    } else {
      setTimerSeconds(0);
    }
    return () => clearInterval(interval);
  }, [gameState.gameMode]);

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    const wholeSecs = Math.floor(remainder);
    const millis = Math.floor((remainder - wholeSecs) * 100);
    return `${String(mins).padStart(2, '0')}:${String(wholeSecs).padStart(2, '0')}.${String(millis).padStart(2, '0')}`;
  };

  // ── Circular Radar Minimap Renderer (throttled ~30fps to prevent main-thread churn) ──
  const lastMinimapTsRef = useRef(0);
  const drawMinimap = useCallback(function draw(ts: number = 0) {
    if (ts - lastMinimapTsRef.current < 33) {
      animRef.current = requestAnimationFrame(draw);
      return;
    }
    lastMinimapTsRef.current = ts;

    const canvas = minimapRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const inFactoryZone = carGlobalPosition.x > 46;
    const focusX = inFactoryZone ? Math.max(70, Math.min(205, carGlobalPosition.x)) : 0;
    const focusZ = inFactoryZone ? Math.max(-42, Math.min(42, carGlobalPosition.z)) : 0;
    const scale = inFactoryZone ? size / 138 : size / 94;

    ctx.clearRect(0, 0, size, size);

    // Clip to radar circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, center - 2, 0, Math.PI * 2);
    ctx.clip();

    // Deep radar background (crimson tint inside AI Factory)
    ctx.fillStyle = inFactoryZone ? 'rgba(18, 8, 12, 0.95)' : 'rgba(8, 12, 22, 0.94)';
    ctx.fillRect(0, 0, size, size);

    // Radar concentric range rings
    ctx.strokeStyle = inFactoryZone ? 'rgba(239, 68, 68, 0.22)' : 'rgba(56, 189, 248, 0.22)';
    ctx.lineWidth = 1;
    [0.35, 0.7, 0.95].forEach((frac) => {
      ctx.beginPath();
      ctx.arc(center, center, center * frac, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Precision Crosshairs
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)';
    ctx.beginPath();
    ctx.moveTo(center, 4);
    ctx.lineTo(center, size - 4);
    ctx.moveTo(4, center);
    ctx.lineTo(size - 4, center);
    ctx.stroke();

    // Helper: Map world coordinate to radar canvas coordinate
    const toRadar = (wx: number, wz: number) => ({
      rx: center + (wx - focusX) * scale,
      ry: center + (wz - focusZ) * scale,
    });

    // Draw Main Road Network Lines (City + Bowling + AI Factory Boulevards)
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.45)';
    ctx.lineWidth = 2.8;
    [
      [0, -42, 0, 42],
      [-28, -42, -28, 42],
      [18, -42, 18, 42],
      [-42, 0, 260, 0],
      [-42, -18.5, 68, -18.5],
      [-42, 19, 42, 19],
      // AI Factory Boulevards
      [96, -46, 256, -46],
      [96, 46, 256, 46],
      [96, -70, 96, 70],
      [122, -55, 122, 55],
      [144, -55, 144, 55],
      [196, -55, 196, 55],
      [224, -68, 224, 68],
    ].forEach(([x1, z1, x2, z2]) => {
      const a = toRadar(x1, z1);
      const b = toRadar(x2, z2);
      ctx.beginPath();
      ctx.moveTo(a.rx, a.ry);
      ctx.lineTo(b.rx, b.ry);
      ctx.stroke();
    });

    // Highlight Glass Observation Tunnel Corridor through LLM Core
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.65)';
    ctx.lineWidth = 3.2;
    const tunA = toRadar(144, 0);
    const tunB = toRadar(196, 0);
    ctx.beginPath();
    ctx.moveTo(tunA.rx, tunA.ry);
    ctx.lineTo(tunB.rx, tunB.ry);
    ctx.stroke();

    // Draw Project District Building beacons (AI-Factory Crimson / Orange aesthetic)
    ctx.fillStyle = '#fb923c';
    for (const loc of Object.values(PROJECT_LOCATIONS)) {
      const p = toRadar(loc.x, loc.z);
      ctx.beginPath();
      ctx.arc(p.rx, p.ry, 2.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw AI Factory Department Beacons (highlighting Stage 01 Start + active Wayfinder target)
    const activeTargetDept = wayfinderTargetRef.current;
    AI_DEPARTMENTS.forEach((dept, idx) => {
      const p = toRadar(dept.checkpointPos[0], dept.checkpointPos[2]);
      const isStart = idx === 0;
      const isTarget = activeTargetDept?.id === dept.id;
      const isCore = dept.id === 'dept-11';
      ctx.fillStyle = isStart || isTarget ? '#facc15' : isCore ? '#fb923c' : '#ef4444';
      ctx.beginPath();
      ctx.arc(p.rx, p.ry, isStart || isTarget ? 4.4 : isCore ? 3.8 : 2.3, 0, Math.PI * 2);
      ctx.fill();

      if ((isStart || isTarget) && inFactoryZone) {
        ctx.strokeStyle = 'rgba(250, 204, 21, 0.9)';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(p.rx, p.ry, 7.2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#090a0f';
        ctx.font = 'bold 6.5px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(dept.code, p.rx, p.ry + 0.5);
      }
    });

    // Guidance dashed line on radar toward next Wayfinder Stage
    if (inFactoryZone && activeTargetDept) {
      const pr = toRadar(carGlobalPosition.x, carGlobalPosition.z);
      const tr = toRadar(activeTargetDept.checkpointPos[0], activeTargetDept.checkpointPos[2]);
      ctx.save();
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.65)';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(pr.rx, pr.ry);
      ctx.lineTo(tr.rx, tr.ry);
      ctx.stroke();
      ctx.restore();
    }

    // Draw Gas Station (F), Garage (G), Bowling (B) & Factory Gate (AI) Landmarks
    const drawLandmarkPin = (wx: number, wz: number, color: string, label: string) => {
      const pos = toRadar(wx, wz);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(pos.rx, pos.ry, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#050814';
      ctx.font = 'bold 7.5px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, pos.rx, pos.ry + 0.5);
    };
    drawLandmarkPin(ZONES.gasStation.x, ZONES.gasStation.z, '#4ade80', 'F');
    drawLandmarkPin(ZONES.garage.x, ZONES.garage.z, '#38bdf8', 'G');
    drawLandmarkPin(65.0, -18.0, '#f59e0b', 'B');
    drawLandmarkPin(94.0, 0, '#ef4444', 'AI');

    // Draw Player Car Chevron Arrow
    const playerR = toRadar(carGlobalPosition.x, carGlobalPosition.z);
    ctx.save();
    ctx.translate(playerR.rx, playerR.ry);
    ctx.rotate(carGlobalAngle.value);

    // Player pulse ring
    ctx.fillStyle = inFactoryZone ? 'rgba(249, 115, 22, 0.35)' : 'rgba(56, 189, 248, 0.35)';
    ctx.beginPath();
    ctx.arc(0, 0, 7, 0, Math.PI * 2);
    ctx.fill();

    // Player sharp chevron arrow
    ctx.fillStyle = inFactoryZone ? '#fb923c' : '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(0, 6);
    ctx.lineTo(-4, -4);
    ctx.lineTo(0, -2);
    ctx.lineTo(4, -4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.restore(); // End radar circle clip

    // Update live Factory Wayfinder compass arrow, distance & turn cue (DOM refs, 0 React re-renders)
    if (activeTargetDept && (wayfinderDistRef.current || wayfinderCueRef.current || wayfinderArrowRef.current)) {
      const dx = activeTargetDept.checkpointPos[0] - carGlobalPosition.x;
      const dz = activeTargetDept.checkpointPos[2] - carGlobalPosition.z;
      const dist = Math.hypot(dx, dz);
      const fx = Math.sin(carGlobalAngle.value);
      const fz = Math.cos(carGlobalAngle.value);
      const forwardDot = dx * fx + dz * fz;
      const rightDot = dx * -fz + dz * fx;
      const relDeg = (Math.atan2(rightDot, forwardDot) * 180) / Math.PI;

      if (wayfinderArrowRef.current) {
        wayfinderArrowRef.current.style.transform = `rotate(${relDeg.toFixed(1)}deg)`;
      }
      if (wayfinderDistRef.current) {
        wayfinderDistRef.current.textContent = `${Math.round(dist)}m`;
      }
      if (wayfinderCueRef.current) {
        if (dist < 8.8) {
          wayfinderCueRef.current.textContent = 'IN ZONE · PRESS [E] TO INSPECT';
        } else if (Math.abs(relDeg) <= 22) {
          wayfinderCueRef.current.textContent = 'DRIVE STRAIGHT ↑';
        } else if (relDeg < -22 && relDeg > -135) {
          wayfinderCueRef.current.textContent = relDeg > -55 ? 'VEER LEFT ↖' : 'TURN LEFT 🡐';
        } else if (relDeg > 22 && relDeg < 135) {
          wayfinderCueRef.current.textContent = relDeg < 55 ? 'VEER RIGHT ↗' : 'TURN RIGHT 🡒';
        } else {
          wayfinderCueRef.current.textContent = 'TURN AROUND ↻';
        }
      }
    }

    animRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    animRef.current = requestAnimationFrame(drawMinimap);
    return () => cancelAnimationFrame(animRef.current);
  }, [drawMinimap]);

  const activeProject = gameState.activeProjectZoneId
    ? projects.find((p) => p.id === gameState.activeProjectZoneId)
    : null;

  const inFactory =
    gameState.gameMode === 'ai-factory' ||
    gameState.currentZone === 'ai-factory' ||
    gameState.tourActive;

  const nearbyDept = gameState.nearbyFactoryDeptId
    ? AI_DEPARTMENT_MAP[gameState.nearbyFactoryDeptId]
    : null;
  const currentTourDept = AI_DEPARTMENTS[gameState.tourStepIndex] || AI_DEPARTMENTS[0];
  const displayDept = nearbyDept || (gameState.tourActive ? currentTourDept : null);
  const progressStep = gameState.tourActive
    ? gameState.tourStepIndex + 1
    : Math.max(gameState.visitedFactoryDepts.length, nearbyDept ? nearbyDept.number : 0);

  const nextUnvisitedIdx = AI_DEPARTMENTS.findIndex(
    (d) => !gameState.visitedFactoryDepts.includes(d.id)
  );
  const wayfinderTargetIdx = gameState.tourActive
    ? gameState.tourStepIndex
    : !gameState.visitedFactoryDepts.includes(AI_DEPARTMENTS[0].id)
      ? 0
      : nextUnvisitedIdx !== -1
        ? nextUnvisitedIdx
        : nearbyDept
          ? nearbyDept.number % AI_DEPARTMENTS.length
          : 0;
  const wayfinderTarget = AI_DEPARTMENTS[wayfinderTargetIdx] || AI_DEPARTMENTS[0];
  wayfinderTargetRef.current = wayfinderTarget;

  const handleSelectMode = (mode: GameMode) => {
    if (mode === 'ai-factory') {
      tourJumpRequest.teleportToFactory = true;
      setGameState((s) => ({
        ...s,
        gameMode: 'ai-factory',
        tourActive: false,
        tourPaused: false,
        activeFactoryDeptId: null,
      }));
      return;
    }
    setGameState((s) => ({
      ...s,
      gameMode: mode,
      tourActive: false,
      tourPaused: false,
      activeFactoryDeptId: null,
    }));
  };

  const handleStartTour = useCallback(() => {
    if (gameState.currentZone !== 'ai-factory') {
      tourJumpRequest.teleportToFactory = true;
    }
    setGameState((s) => ({
      ...s,
      gameMode: 'ai-factory',
      tourActive: true,
      tourPaused: false,
      tourStepIndex: 0,
      activeFactoryDeptId: null,
    }));
  }, [gameState.currentZone, setGameState]);

  const handleJumpToStage = useCallback(
    (stepIdx: number) => {
      const clamped = Math.max(0, Math.min(AI_DEPARTMENTS.length - 1, stepIdx));
      tourJumpRequest.stepIndex = clamped;
      setGameState((s) => ({
        ...s,
        gameMode: 'ai-factory',
        tourActive: true,
        tourPaused: false,
        tourStepIndex: clamped,
        activeFactoryDeptId: null,
      }));
    },
    [setGameState]
  );

  const handleToggleTourPause = useCallback(() => {
    setGameState((s) => ({ ...s, tourPaused: !s.tourPaused }));
  }, [setGameState]);

  const handleExitTour = useCallback(() => {
    setGameState((s) => ({ ...s, tourActive: false, tourPaused: false }));
  }, [setGameState]);

  return (
    <div className="hud-container">
      {/* ── Top Left: Circuit Race Position (Shown only in Racing Mode outside Factory) ── */}
      {gameState.gameMode === 'racing' && !inFactory && (
        <div className="hud-position-panel">
          <span className="hud-pos-header">CIRCUIT POSITION</span>
          <div className="hud-pos-value">
            <span>0{gameState.racePosition}</span>
            <span className="hud-pos-denom">/0{gameState.totalRacers}</span>
          </div>
          <div className="hud-mode-pill">
            <Flag size={12} className="text-cyan-400" />
            <span>RACING</span>
          </div>
        </div>
      )}

      {/* ── Top Left: AI Intelligence Factory Pipeline Rail ── */}
      {inFactory && (
        <aside className="hud-factory-left-rail">
          <div className="hud-factory-rail-header">
            <div className="hud-factory-badge">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]" />
              <span>AI INTELLIGENCE FACTORY</span>
            </div>
            <button
              onClick={() => setStageListExpanded((v) => !v)}
              className="text-zinc-400 hover:text-white cursor-pointer"
              title={stageListExpanded ? 'Collapse Pipeline Rail' : 'Expand Pipeline Rail'}
            >
              {stageListExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
          </div>

          <div className="hud-factory-progress-row">
            <span>AI PIPELINE PROGRESS</span>
            <span className="text-orange-400">{String(progressStep).padStart(2, '0')}/15</span>
          </div>
          <div className="hud-factory-progress-track">
            <div
              className="hud-factory-progress-fill"
              style={{ width: `${Math.max(4, (progressStep / 15) * 100)}%` }}
            />
          </div>

          {/* Live Directional Wayfinder guiding player from Stage 01 through 15 */}
          <div className="hud-factory-wayfinder">
            <div className="hud-wayfinder-top">
              <span className="hud-wayfinder-label">
                {wayfinderTargetIdx === 0 && !gameState.visitedFactoryDepts.includes(AI_DEPARTMENTS[0].id)
                  ? '★ START POINT · STAGE 01'
                  : `NEXT TARGET · STAGE ${wayfinderTarget.code}`}
              </span>
              <span ref={wayfinderDistRef} className="hud-wayfinder-dist">--m</span>
            </div>
            <div className="hud-wayfinder-body">
              <div className="hud-wayfinder-dial" aria-hidden="true">
                <svg
                  ref={wayfinderArrowRef}
                  viewBox="0 0 24 24"
                  className="hud-wayfinder-arrow"
                >
                  <path
                    d="M12 2L19 20L12 16L5 20L12 2Z"
                    fill="#facc15"
                    stroke="#ef4444"
                    strokeWidth="1.4"
                  />
                </svg>
              </div>
              <div className="hud-wayfinder-info">
                <div className="hud-wayfinder-dept">{wayfinderTarget.shortName.toUpperCase()}</div>
                <span ref={wayfinderCueRef} className="hud-wayfinder-cue">
                  TURN LEFT 🡐
                </span>
              </div>
              <button
                onClick={() => handleJumpToStage(wayfinderTargetIdx)}
                className="hud-wayfinder-go"
                title={`Jump straight to Stage ${wayfinderTarget.code}`}
              >
                <span>GO</span>
                <ArrowRight size={11} />
              </button>
            </div>
          </div>

          {!gameState.tourActive ? (
            <button onClick={handleStartTour} className="hud-factory-tour-trigger">
              <Play size={13} />
              <span>START GUIDED TOUR</span>
            </button>
          ) : (
            <button onClick={handleToggleTourPause} className="hud-factory-tour-trigger">
              {gameState.tourPaused ? <Play size={13} /> : <Pause size={13} />}
              <span>{gameState.tourPaused ? 'RESUME GUIDED TOUR' : 'PAUSE GUIDED TOUR'}</span>
            </button>
          )}

          {stageListExpanded && (
            <div className="hud-factory-stage-list">
              {AI_DEPARTMENTS.map((d, idx) => {
                const isActive =
                  (gameState.tourActive && gameState.tourStepIndex === idx) ||
                  gameState.nearbyFactoryDeptId === d.id ||
                  gameState.activeFactoryDeptId === d.id;
                const isVisited = gameState.visitedFactoryDepts.includes(d.id);
                return (
                  <button
                    key={d.id}
                    onClick={() => handleJumpToStage(idx)}
                    className={`hud-factory-stage-pill ${isActive ? 'active' : ''} ${isVisited ? 'visited' : ''}`}
                    title={`${d.code} · ${d.name}`}
                  >
                    <span className="text-orange-400 font-bold">{d.code}</span>
                    <span className="truncate flex-1">{d.shortName}</span>
                    {isVisited && <span className="text-amber-300 text-[10px]">●</span>}
                  </button>
                );
              })}
            </div>
          )}
        </aside>
      )}

      {/* ── Bowling Score & Interactive Reset Bar (Shown in Bowling mode or Bowling Alley zone) ── */}
      {(gameState.gameMode === 'bowling' || gameState.currentZone === 'bowling') && (
        <div className="hud-bowling-panel">
          <Target size={18} className="text-amber-400" />
          <div>
            <div className="hud-zone-title text-amber-300">
              KINETIC BOWLING · {gameState.bowlingPinsDown} / {gameState.totalBowlingPins} PINS
            </div>
            <div className="hud-zone-sub text-xs">
              {gameState.bowlingScoreText || 'DRIVE DOWN BOWLING LANE TO SMASH PINS'}
            </div>
          </div>
          <button onClick={handleResetBowling} className="hud-bowling-reset-btn">
            <RotateCcw size={13} />
            <span>RESET PINS</span>
          </button>
        </div>
      )}

      {/* ── Active Vehicle Selection Notification Toast ── */}
      {carToast && (
        <div className="hud-toast-banner">
          <span className="hud-toast-icon">◆</span>
          <span className="hud-toast-text">{carToast}</span>
        </div>
      )}

      {/* ── Top Right: Lap Counter / AI Factory Telemetry Status ── */}
      <div className="hud-lap-panel">
        <span className="hud-lap-title">
          {inFactory
            ? gameState.tourActive
              ? gameState.tourPaused
                ? 'GUIDED TOUR · PAUSED'
                : 'GUIDED TOUR · ACTIVE'
              : 'FACTORY STATUS · ONLINE'
            : gameState.gameMode === 'racing'
              ? 'CURRENT LAP'
              : gameState.gameMode === 'stunt'
                ? 'STUNT TELEMETRY'
                : 'ELAPSED SESSION'}
        </span>
        <div className="hud-lap-val">
          {inFactory ? (
            <span className="text-orange-400">
              {displayDept ? `DEPT ${displayDept.code}` : 'GATEWAY'}
            </span>
          ) : gameState.gameMode === 'racing' ? (
            <>
              <span>0{gameState.currentLap}</span>
              <span className="hud-pos-denom">/0{gameState.totalLaps}</span>
            </>
          ) : gameState.gameMode === 'stunt' ? (
            <span>{gameState.stuntScore.toLocaleString()} PTS</span>
          ) : (
            <span>01</span>
          )}
        </div>
        <div className="hud-timer-badge">
          <span>
            {inFactory
              ? displayDept
                ? displayDept.shortName.toUpperCase()
                : `${String(gameState.visitedFactoryDepts.length).padStart(2, '0')}/15 INSPECTED`
              : formatTimer(timerSeconds || 32.75)}
          </span>
        </div>
      </div>

      {/* ── Top Center: Persistent Portfolio Hub & Controls ── */}
      <div className="hud-top-nav">
        <button
          onClick={() => setShowDrawer(true)}
          className="hud-action-btn hud-action-primary"
        >
          <Folder size={14} className="text-cyan-400" />
          <span>PORTFOLIO HUB</span>
        </button>
        <button
          onClick={() => setGameState((s) => ({ ...s, showGarageModal: true }))}
          className="hud-action-btn"
          title="Vehicle Configurator"
        >
          <Sparkles size={14} className="text-sky-400" />
          <span>GARAGE [G]</span>
        </button>
        <button
          onClick={() => setShowControlsHint((prev) => !prev)}
          className="hud-action-btn"
          title="Controls Guide"
        >
          <HelpCircle size={14} />
          <span>[H]</span>
        </button>
        <button
          onClick={() => setGameState((s) => ({ ...s, audioPlaying: !s.audioPlaying }))}
          className="hud-action-btn"
          title="Audio Engine"
        >
          {gameState.audioPlaying ? <Volume2 size={14} className="text-emerald-400" /> : <VolumeX size={14} className="text-zinc-500" />}
        </button>
      </div>

      {/* ── AI Intelligence Factory Guided Tour Narration Bar ── */}
      {gameState.tourActive && !gameState.activeFactoryDeptId && (
        <div className="hud-tour-bar">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="px-2 py-0.5 rounded bg-red-600/30 border border-red-500/60 text-[10px] font-mono font-bold text-orange-300 shrink-0">
                STAGE {currentTourDept.code}/15
              </span>
              <span className="text-xs font-['Orbitron'] font-extrabold text-white truncate">
                {currentTourDept.name.toUpperCase()}
              </span>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 shrink-0">
              {gameState.tourPaused ? 'PAUSED' : 'AUTOPILOT ACTIVE'}
            </span>
          </div>
          <p className="text-[11px] font-sans text-zinc-300 leading-snug m-0">
            {currentTourDept.tourSummary}
          </p>
          <div className="hud-tour-controls">
            <button
              onClick={() => handleJumpToStage(Math.max(0, gameState.tourStepIndex - 1))}
              disabled={gameState.tourStepIndex <= 0}
              className="hud-tour-btn disabled:opacity-40"
            >
              <SkipBack size={12} />
              <span>PREV</span>
            </button>
            <button onClick={handleToggleTourPause} className="hud-tour-btn">
              {gameState.tourPaused ? <Play size={12} /> : <Pause size={12} />}
              <span>{gameState.tourPaused ? 'RESUME' : 'PAUSE'}</span>
            </button>
            <button
              onClick={() =>
                setGameState((s) => ({
                  ...s,
                  activeFactoryDeptId: currentTourDept.id,
                }))
              }
              className="hud-tour-btn primary"
            >
              <Cpu size={12} />
              <span>INSPECT 3D MACHINE [E]</span>
            </button>
            <button
              onClick={() =>
                handleJumpToStage(Math.min(AI_DEPARTMENTS.length - 1, gameState.tourStepIndex + 1))
              }
              disabled={gameState.tourStepIndex >= AI_DEPARTMENTS.length - 1}
              className="hud-tour-btn disabled:opacity-40"
            >
              <span>NEXT</span>
              <SkipForward size={12} />
            </button>
            <button onClick={handleExitTour} className="hud-tour-btn ml-auto text-red-300">
              <X size={12} />
              <span>EXIT TOUR</span>
            </button>
          </div>
        </div>
      )}

      {/* ── AI Factory Department Checkpoint Interaction Banner ── */}
      {nearbyDept && !gameState.activeFactoryDeptId && (
        <div
          className="hud-factory-checkpoint-banner"
          onClick={() => setGameState((s) => ({ ...s, activeFactoryDeptId: nearbyDept.id }))}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-orange-400 animate-ping shrink-0" />
          <div>
            <div className="text-[10px] font-mono font-bold tracking-widest text-orange-300">
              CHECKPOINT BAY · DEPT {nearbyDept.code} — {nearbyDept.shortName.toUpperCase()}
            </div>
            <div className="text-xs font-['Orbitron'] font-black text-white tracking-wider">
              PRESS [E] TO EXPLORE THIS PROCESS
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-orange-500 text-[10px] font-['Orbitron'] font-bold text-white">
            OPEN LAB
            <ArrowRight size={12} />
          </span>
        </div>
      )}

      {/* ── Proximity Interactive Banner (when near a project) ── */}
      {activeProject && (
        <div
          className="hud-center-banner"
          onClick={() => setGameState((s) => ({ ...s, activeProject }))}
        >
          <div className="hud-project-prompt">
            <span className="hud-prompt-glyph">◆</span>
            <div>
              <div className="hud-prompt-subtitle">
                CASE STUDY PROXIMITY TELEMETRY
              </div>
              <div className="hud-prompt-title">
                {activeProject.name.toUpperCase()} · [PRESS E TO INSPECT]
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Fuel Station Proximity Interactive Banner ── */}
      {gameState.currentZone === 'gas-station' && (
        <div className="hud-zone-banner hud-zone-fuel">
          <div className="hud-zone-dot animate-pulse bg-emerald-400" />
          <div>
            <div className="hud-zone-title">OCTANE 99 FUEL STATION</div>
            <div className="hud-zone-sub">
              {gameState.isRefueling
                ? `REFUELING TANK & NITRO (${gameState.fuel}%)...`
                : gameState.fuel >= 100
                  ? 'TANK FULL (100%) · READY FOR ROLLOUT'
                  : 'HOLD [E] OR CLICK TO REFUEL VEHICLE'}
            </div>
          </div>
          <button
            onClick={() =>
              setGameState((s) => ({
                ...s,
                isRefueling: s.fuel < 100 ? !s.isRefueling : false,
              }))
            }
            className="hud-zone-btn hud-zone-btn-emerald"
          >
            {gameState.isRefueling ? 'REFUELING...' : gameState.fuel >= 100 ? 'TANK FULL' : 'REFUEL NOW [E]'}
          </button>
        </div>
      )}

      {/* ── Customs Garage Proximity Interactive Banner ── */}
      {gameState.currentZone === 'garage' && !gameState.showGarageModal && (
        <div className="hud-zone-banner hud-zone-garage">
          <div className="hud-zone-dot bg-cyan-400" />
          <div>
            <div className="hud-zone-title">PERFORMANCE MOTORWORKS GARAGE</div>
            <div className="hud-zone-sub">
              PRESS [G] OR CLICK TO CHOOSE YOUR VEHICLE
            </div>
          </div>
          <button
            onClick={() => setGameState((s) => ({ ...s, showGarageModal: true }))}
            className="hud-zone-btn hud-zone-btn-cyan"
          >
            OPEN GARAGE
          </button>
        </div>
      )}

      {/* ── Core Technical Arsenal Proximity & Reset Banner ── */}
      {gameState.currentZone === 'skills' && !gameState.showGarageModal && (
        <div className="hud-zone-banner hud-zone-garage">
          <div className="hud-zone-dot bg-cyan-400" />
          <div>
            <div className="hud-zone-title">CORE TECHNICAL ARSENAL</div>
            <div className="hud-zone-sub">
              {gameState.skillsDisplaced
                ? 'CUBES SCATTERED · CLICK TO RESTACK IN OCTAGON FORMATION'
                : 'SMASH THROUGH THE SKILL CUBES · RESET ANYTIME'}
            </div>
          </div>
          <button
            onClick={handleResetSkills}
            className="hud-zone-btn hud-zone-btn-cyan inline-flex items-center gap-1.5"
          >
            <RotateCcw size={13} />
            RESET ARSENAL
          </button>
        </div>
      )}

      {/* ── Persistent Floating Skill Cubes Reset Chip (when displaced outside zone) ── */}
      {gameState.skillsDisplaced && gameState.currentZone !== 'skills' && !gameState.showGarageModal && (
        <div className="hud-skills-panel">
          <div className="text-[11px] font-bold tracking-wider text-sky-300 font-['Orbitron']">
            TECHNICAL ARSENAL
          </div>
          <button
            onClick={handleResetSkills}
            className="hud-skills-reset-btn"
            title="Reset Core Technical Arsenal Cubes"
          >
            <RotateCcw size={13} />
            RESET ARSENAL
          </button>
        </div>
      )}

      {/* ── Fuel Level Notification: Low Fuel Alert (<20% / <=5%) & Empty Fuel Up Button (0%) ── */}
      {gameState.fuel <= 0 ? (
        <div className="hud-warning-pill animate-pulse">
          <span>
            FUEL COMPLETELY ENDED (0%) AFTER {gameState.milesDriven.toFixed(2)} MI · ENGINE STOPPED
          </span>
          <button onClick={handleFuelUp} className="hud-fuelup-btn">
            <Fuel size={13} />
            <span>FUEL UP</span>
          </button>
        </div>
      ) : gameState.fuel <= 5 ? (
        <div className="hud-warning-pill animate-pulse">
          <span>
            FINAL FUEL WARNING: {gameState.fuel}% REMAINING · TANK ALMOST EMPTY!
          </span>
        </div>
      ) : gameState.fuel <= 20 ? (
        <div className="hud-warning-pill hud-warning-amber">
          <span>
            LOW FUEL ALERT: {gameState.fuel}% LEFT · HEAD TO GREEN [F] OCTANE 99 BAY BEFORE EMPTY
          </span>
        </div>
      ) : null}

      {/* Stunt Airtime / Trick Alert Notification */}
      {gameState.stuntMessage && (
        <div className="hud-stunt-toast">
          {gameState.stuntMessage}
        </div>
      )}

      {/* ── Bottom Left: Circular Radar Minimap ── */}
      <div className="hud-radar-panel">
        <canvas ref={minimapRef} width={140} height={140} className="hud-radar-canvas" />
      </div>

      {/* ── Bottom Right: Tachometer & Speedometer ── */}
      <div className="hud-speedometer-panel">
        <div className="speed-dial-wrap">
          <svg viewBox="0 0 100 65" width="130" height="85">
            {/* Background Arc */}
            <path
              d="M 12 58 A 42 42 0 0 1 88 58"
              fill="none"
              stroke="rgba(148, 163, 184, 0.18)"
              strokeWidth="4"
            />
            {/* Speed Gauge Glow Arc */}
            <path
              d="M 12 58 A 42 42 0 0 1 88 58"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="4"
              strokeDasharray={`${Math.min(130, (gameState.speed / 200) * 130)} 130`}
              style={{ filter: 'drop-shadow(0 0 6px rgba(56, 189, 248, 0.8))' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
            <span className="speed-number-val">{gameState.speed}</span>
            <span className="speed-unit-lbl">KM/H</span>
          </div>
        </div>

        {/* Current Gear */}
        <div className="gear-badge">
          {gameState.gear === -1 ? 'REVERSE' : `DRIVE ${gameState.gear}`}
        </div>

        {/* Nitro Boost Meter */}
        <div className="nitro-wrap">
          <div className="nitro-header">
            <span>NITRO INJECTION</span>
            <span>{gameState.nitroAmount}%</span>
          </div>
          <div className="nitro-track">
            <div className="nitro-fill" style={{ width: `${gameState.nitroAmount}%` }} />
          </div>
        </div>

        {/* Fuel Tank Gauge & Mileage Odometer */}
        <div className="fuel-wrap">
          <div className="fuel-header">
            <span>FUEL · {gameState.milesDriven.toFixed(2)} MI</span>
            <span className={gameState.fuel <= 0 ? 'text-rose-400 font-bold animate-pulse' : gameState.fuel < 20 ? 'text-amber-400 font-bold animate-pulse' : 'text-emerald-400'}>
              {gameState.fuel}%
            </span>
          </div>
          <div className="fuel-track">
            <div
              className={`fuel-fill ${gameState.fuel < 20 ? 'danger' : gameState.isRefueling ? 'refueling' : ''}`}
              style={{ width: `${gameState.fuel}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Bottom Section: 4-Card Mode Selector & Feature Ribbon ── */}
      <div className="hud-bottom-banner-group">
        <div className="hud-three-cards">
          <button
            onClick={() => handleSelectMode('racing')}
            className={`hud-card-item ${gameState.gameMode === 'racing' ? 'active' : ''}`}
          >
            <div className="card-tag">
              <Flag size={13} className="text-cyan-400" />
              <span>CIRCUIT GRAND PRIX</span>
            </div>
            <span className="card-sub">AUTONOMOUS AI RACING & TELEMETRY</span>
          </button>

          <button
            onClick={() => handleSelectMode('stunt')}
            className={`hud-card-item ${gameState.gameMode === 'stunt' ? 'active' : ''}`}
          >
            <div className="card-tag">
              <Sparkles size={13} className="text-sky-400" />
              <span>AERODYNAMIC LOOPS</span>
            </div>
            <span className="card-sub">STUNT RAMPS & HIGH-G AIRTIME</span>
          </button>

          <button
            onClick={() => handleSelectMode('bowling')}
            className={`hud-card-item ${gameState.gameMode === 'bowling' ? 'active' : ''}`}
          >
            <div className="card-tag">
              <Target size={13} className="text-amber-400" />
              <span>KINETIC BOWLING</span>
            </div>
            <span className="card-sub">RIGID-BODY COLLISION PHYSICS</span>
          </button>

          <button
            onClick={() => handleSelectMode('free-roam')}
            className={`hud-card-item ${gameState.gameMode === 'free-roam' ? 'active' : ''}`}
          >
            <div className="card-tag">
              <Compass size={13} className="text-emerald-400" />
              <span>CYBER CITY EXPLORE</span>
            </div>
            <span className="card-sub">REAL 3D ARCHITECTURAL TOWERS</span>
          </button>

          <button
            onClick={() => handleSelectMode('ai-factory')}
            className={`hud-card-item factory-card ${gameState.gameMode === 'ai-factory' || inFactory ? 'active' : ''}`}
          >
            <div className="card-tag">
              <Cpu size={13} className="text-red-400" />
              <span>AI INTELLIGENCE FACTORY</span>
            </div>
            <span className="card-sub">15-STAGE NEURAL PIPELINE &amp; TOUR</span>
          </button>
        </div>

        {/* Feature Ribbon Footer */}
        <div className="hud-feature-ribbon">
          <div className="ribbon-item"><span>RAJAT AMBEDKAR</span></div>
          <div className="ribbon-divider">·</div>
          <div className="ribbon-item"><span className="text-zinc-400">SENIOR FULL-STACK & 3D DEVELOPER</span></div>
          <div className="ribbon-specs">
            <span className="ribbon-chip">THREE.JS 182</span>
            <span className="ribbon-chip">CANNON-ES PBR</span>
            <span className="ribbon-chip">REACT 18</span>
            <span className="ribbon-chip">60 FPS HDR</span>
          </div>
        </div>
      </div>

      {/* Controls Hint Overlay */}
      {showControlsHint && (
        <div className="hud-controls-modal">
          <div className="font-bold text-cyan-400 font-orbitron mb-2 tracking-wider">TELEMETRY & FLIGHT CONTROLS</div>
          <div><b className="text-white">W / Up Arrow</b> : Throttle Acceleration</div>
          <div><b className="text-white">S / Down Arrow</b> : Dynamic Brake / Reverse</div>
          <div><b className="text-white">A / D / Left-Right</b> : Precision Steering</div>
          <div><b className="text-white">Spacebar</b> : Handbrake Stop</div>
          <div><b className="text-white">Shift</b> : Nitro Overdrive & Wheelie</div>
          <div><b className="text-white">1, 2, 3, 4</b> : Hotkey Quick Vehicle Switch</div>
          <div><b className="text-white">G</b> : Performance Motorworks Garage</div>
          <div><b className="text-white">C</b> : Orbit / Chase Camera Perspective</div>
          <div><b className="text-white">E / Enter</b> : Explore AI Factory Dept / Refuel / Case Study</div>
          <div><b className="text-white">R</b> : Recalibrate Vehicle Orientation</div>
        </div>
      )}

      {/* ── CUSTOMS GARAGE VEHICLE SELECTOR MODAL ── */}
      {gameState.showGarageModal && (
        <div className="garage-modal-backdrop" onClick={() => setGameState((s) => ({ ...s, showGarageModal: false }))}>
          <div className="garage-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="garage-header-row">
              <div className="garage-title">
                <span className="text-cyan-400">◆</span>
                <span>MOTORWORKS VEHICLE CONFIGURATOR</span>
              </div>
              <button
                onClick={() => setGameState((s) => ({ ...s, showGarageModal: false }))}
                className="garage-close-btn flex items-center gap-1.5"
              >
                <X size={15} />
                <span>CLOSE [ESC]</span>
              </button>
            </div>

            <div className="text-xs text-slate-400 mb-5 font-mono tracking-wide">
              SELECT YOUR VEHICLE CHASSIS · REAL-TIME CANNON RIGID-BODY AERODYNAMICS & NITRO PROPULSION
            </div>

            <div className="garage-car-grid">
              {CAR_OPTIONS.map((car) => {
                const isCurrent = gameState.selectedCar === car.id;
                return (
                  <div
                    key={car.id}
                    onClick={() => handleSelectCar(car.id)}
                    className={`garage-car-card ${isCurrent ? 'selected' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="car-badge-pill">{car.badge}</span>
                      {isCurrent && <span className="car-active-badge">ACTIVE CHASSIS</span>}
                    </div>

                    <div className="car-title-name">{car.name}</div>
                    <div className="car-subtitle-txt">{car.subtitle}</div>
                    <div className="car-desc-txt">{car.desc}</div>

                    <div className="car-spec-table">
                      <div className="spec-table-item">
                        <span className="spec-table-label">POWER</span>
                        <span className="spec-table-val">{car.hp}</span>
                      </div>
                      <div className="spec-table-item">
                        <span className="spec-table-label">0-100 KM/H</span>
                        <span className="spec-table-val">{car.zeroToHundred}</span>
                      </div>
                      <div className="spec-table-item">
                        <span className="spec-table-label">TOP SPEED</span>
                        <span className="spec-table-val">{car.topSpeedKmh}</span>
                      </div>
                      <div className="spec-table-item">
                        <span className="spec-table-label">WEIGHT</span>
                        <span className="spec-table-val">{car.weight}</span>
                      </div>
                    </div>

                    <div className="car-stat-row">
                      <span>SPEED POTENTIAL</span>
                      <span>{car.topSpeed}%</span>
                    </div>
                    <div className="car-stat-track">
                      <div className="car-stat-bar" style={{ width: `${car.topSpeed}%` }} />
                    </div>

                    <div className="car-stat-row">
                      <span>ACCELERATION</span>
                      <span>{car.accel}%</span>
                    </div>
                    <div className="car-stat-track">
                      <div className="car-stat-bar" style={{ width: `${car.accel}%` }} />
                    </div>

                    <div className="car-stat-row">
                      <span>LATERAL GRIP</span>
                      <span>{car.handling}%</span>
                    </div>
                    <div className="car-stat-track">
                      <div className="car-stat-bar" style={{ width: `${car.handling}%` }} />
                    </div>

                    <div className="car-stat-row">
                      <span>NITRO FLOW</span>
                      <span>{car.nitro}%</span>
                    </div>
                    <div className="car-stat-track">
                      <div className="car-stat-bar" style={{ width: `${car.nitro}%` }} />
                    </div>

                    <button
                      className={`select-car-btn ${isCurrent ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectCar(car.id);
                      }}
                    >
                      {isCurrent ? 'CURRENT SPECIFICATION ACTIVE' : 'DEPLOY THIS CHASSIS ➔'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Persistent Portfolio Slide-out Drawer */}
      <PortfolioDrawer
        isOpen={showDrawer}
        onClose={() => setShowDrawer(false)}
        projects={projects}
        onSelectProject={(p) => {
          setShowDrawer(false);
          setGameState((s) => ({ ...s, activeProject: p }));
        }}
      />

      {/* AI Intelligence Factory 3D Engineering Modal */}
      {gameState.activeFactoryDeptId && (
        <Suspense fallback={null}>
          <AIFactoryModal
            deptId={gameState.activeFactoryDeptId}
            factoryQuery={gameState.factoryQuery}
            factoryOutputFormat={gameState.factoryOutputFormat}
            onSelectDept={(deptId) => setGameState((s) => ({ ...s, activeFactoryDeptId: deptId }))}
            onUpdateQuery={(factoryQuery) => setGameState((s) => ({ ...s, factoryQuery }))}
            onUpdateOutputFormat={(factoryOutputFormat) => setGameState((s) => ({ ...s, factoryOutputFormat }))}
          />
        </Suspense>
      )}
    </div>
  );
};
