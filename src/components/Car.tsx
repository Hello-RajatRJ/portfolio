import React, { useRef, useEffect, useCallback, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import gsap from 'gsap';
import { useInput } from '../hooks/useInput';
import type { GameState, Project, CameraPerspective } from '../types';
import { obstaclesList } from './ObstaclesState';
import { SportsCarModel } from './car/SportsCarModel';
import { FastAndFuriousCarModel } from './car/FastAndFuriousCarModel';
import { BeetleCarModel } from './car/BeetleCarModel';
import { VehicleModel } from './VehicleModel';
import { TireSmoke, SkidMarks } from './car/CarFX';
import { CanvasErrorBoundary } from './CanvasErrorBoundary';
import {
  carGlobalPosition,
  carGlobalAngle,
  fuelSyncRequest,
  tourJumpRequest,
  ZONES,
  skillCubesList,
  CAR_CONFIG,
} from './CarState';
import type { CarPhysicsState, CarVisualState } from './CarState';
import { checkHotWheelsTrack } from './world/HotWheelsPhysics';
import { PROJECT_LOCATIONS } from '../data/projectLocations';
import { MODE_SPAWNS, resetBowlingPins } from './world/GameModesManager';
import { AI_DEPARTMENTS, AI_FACTORY_BOUNDS } from '../data/aiFactoryData';

// ─── Engine Audio Synthesizer ─────────────────────────────────────────────
const useEngineAudio = (speedRef: React.MutableRefObject<number>, enabled: boolean) => {
  const startRoar = useRef<HTMLAudioElement | null>(null);
  const engineSound = useRef<HTMLAudioElement | null>(null);
  const hasPlayedRoar = useRef(false);

  useEffect(() => {
    if (!startRoar.current) {
      startRoar.current = new Audio('/audio/dragon-studio-car-engine-roaring-376881.mp3');
      startRoar.current.volume = 0.5;
    }
    if (!engineSound.current) {
      engineSound.current = new Audio('/audio/mizanstock-bmw-xm-car-sound-2023-165995.mp3');
      engineSound.current.loop = true;
      engineSound.current.volume = 0.0;
      if ('preservesPitch' in engineSound.current) {
        (engineSound.current as HTMLAudioElement & { preservesPitch?: boolean }).preservesPitch = false;
      }
    }

    if (!enabled) {
      engineSound.current?.pause();
      return;
    }

    if (!hasPlayedRoar.current && startRoar.current) {
      hasPlayedRoar.current = true;
      startRoar.current.play().catch(() => {});
    }

    if (engineSound.current) {
      engineSound.current.play().catch(() => {});
    }

    return () => {
      engineSound.current?.pause();
    };
  }, [enabled]);

  useFrame(() => {
    if (enabled && engineSound.current) {
      const absSpeed = Math.abs(speedRef.current);
      const gearSize = Math.max(1, CAR_CONFIG.maxSpeed / 4);
      const gear = Math.min(3, Math.floor(absSpeed / gearSize));
      const speedInGear = absSpeed - gear * gearSize;

      const targetRate = Math.max(0.7, Math.min(2.5, 0.8 + (speedInGear / gearSize) * 0.85 + gear * 0.15));
      const newRate = engineSound.current.playbackRate + (targetRate - engineSound.current.playbackRate) * 0.15;
      if (Number.isFinite(newRate)) {
        engineSound.current.playbackRate = Math.max(0.5, Math.min(2.5, newRate));
      }

      const targetVolume = Math.max(0.1, Math.min(0.65, 0.15 + Math.min(absSpeed / 30, 0.45)));
      const newVol = engineSound.current.volume + (targetVolume - engineSound.current.volume) * 0.1;
      if (Number.isFinite(newVol)) {
        engineSound.current.volume = Math.max(0, Math.min(1, newVol));
      }
    }
  });
};

// ─── Car Component ─────────────────────────────────────────────────────────
interface CarProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  projects: Project[];
}

export const Car: React.FC<CarProps> = ({ gameState, setGameState, projects }) => {
  const carRef = useRef<Group>(null);
  const inputs = useInput();
  const speedRef = useRef(0);
  useEngineAudio(speedRef, gameState.audioPlaying);

  const hornAudio = useRef<HTMLAudioElement | null>(null);
  const wasHornPressed = useRef(false);
  const wasCameraToggled = useRef(false);
  const prevGameMode = useRef(gameState.gameMode);

  // Stunt & Jump Tracking
  const airTimeRef = useRef(0);
  const jumpDistRef = useRef(0);
  const stuntScoreRef = useRef(0);
  const stuntMsgRef = useRef<string | null>(null);
  const cameraShake = useRef(0);

  // Distance & Miles-based Fuel Tracking
  const fuelRef = useRef(100);
  const milesRef = useRef(0);
  const prevFuelPosRef = useRef<{ x: number; z: number } | null>(null);

  useEffect(() => {
    hornAudio.current = new Audio('/audio/floraphonic-car-horn-2-189856.mp3');
    hornAudio.current.volume = 0.7;
  }, []);

  // ── Physics state ──
  const physics = useRef<CarPhysicsState>({
    posX: 0,
    posZ: -4.0,
    posY: 0.06,
    velY: 0,
    speed: 0,
    angle: 0,
    vx: 0,
    vz: 0,
    steeringAngle: 0,
  });

  // ── Visual state ──
  const visual = useRef<CarVisualState>({
    wheelRot: 0,
    wheelieAngle: 0,
    bodyRoll: 0,
    bodyPitch: 0,
    isBoosting: false,
    isBraking: false,
    camX: 0,
    camY: 2.0,
    camZ: -8.7,
  });

  const isFirstFrame = useRef(true);
  const currentLookAt = useRef({ x: 0, y: 1.0, z: -2.0 });

  const resetCarToSpawn = useCallback((mode: GameState['gameMode'] = prevGameMode.current) => {
    isFirstFrame.current = true;
    const spawn = MODE_SPAWNS[mode] || { x: 0, y: 0.06, z: -4.0, angle: 0 };
    const p = physics.current;
    p.posX = spawn.x;
    p.posY = spawn.y;
    p.posZ = spawn.z;
    p.velY = 0;
    p.speed = 0;
    p.angle = spawn.angle;
    p.vx = 0;
    p.vz = 0;
    p.steeringAngle = 0;

    carGlobalPosition.set(spawn.x, spawn.y, spawn.z);
    carGlobalAngle.value = spawn.angle;
    prevFuelPosRef.current = { x: spawn.x, z: spawn.z };

    currentLookAt.current.x = spawn.x + Math.sin(spawn.angle) * 2.2;
    currentLookAt.current.y = spawn.y + 0.95;
    currentLookAt.current.z = spawn.z + Math.cos(spawn.angle) * 2.2;

    if (carRef.current) {
      carRef.current.position.set(spawn.x, spawn.y, spawn.z);
      carRef.current.rotation.set(0, spawn.angle, 0);
    }

    const v = visual.current;
    v.wheelRot = 0;
    v.wheelieAngle = 0;
    v.bodyRoll = 0;
    v.bodyPitch = 0;
    v.isBoosting = false;
    v.isBraking = false;
  }, []);

  useEffect(() => {
    resetCarToSpawn();
  }, [resetCarToSpawn]);

  // Detect mode changes and reposition car to the dedicated mode starting point
  useEffect(() => {
    if (gameState.gameMode !== prevGameMode.current) {
      prevGameMode.current = gameState.gameMode;
      resetCarToSpawn(gameState.gameMode);
      if (gameState.gameMode === 'bowling') {
        resetBowlingPins();
      }
    }
  }, [gameState.gameMode, resetCarToSpawn]);

  // Refill fuel to 100% whenever player switches vehicles
  useEffect(() => {
    fuelRef.current = 100;
  }, [gameState.selectedCar]);

  // Guided AI Factory Tour state & GSAP cinematic camera rig
  const tourCamRig = useRef({
    followDist: 5.2,
    followHeight: 2.0,
    lookAheadDist: 2.2,
    lookAtHeight: 0.95,
  });
  const tourWaypointIdx = useRef(0);
  const tourDwellTimer = useRef(0);
  const tourParkedRef = useRef(false);

  useEffect(() => {
    tourWaypointIdx.current = 0;
    tourDwellTimer.current = 0;
    tourParkedRef.current = false;

    if (gameState.tourActive) {
      // Smooth GSAP camera sweep when entering/advancing AI Factory tour stages
      gsap.to(tourCamRig.current, {
        followDist: 6.4,
        followHeight: 3.1,
        lookAheadDist: 3.0,
        lookAtHeight: 1.5,
        duration: 1.15,
        ease: 'power3.inOut',
        overwrite: 'auto',
      });

      // If starting tour while far away from the Factory, position cleanly at the Grand Gate entry
      if (physics.current.posX < 84) {
        physics.current.posX = 88.0;
        physics.current.posZ = 0;
        physics.current.posY = 0.06;
        physics.current.speed = 0;
        physics.current.vx = 0;
        physics.current.vz = 0;
        physics.current.angle = Math.PI / 2;
      }
    } else {
      gsap.killTweensOf(tourCamRig.current);
    }
  }, [gameState.tourActive, gameState.tourStepIndex]);

  const frameCounter = useRef(0);
  const damp = (rate: number, dt: number) => 1 - Math.exp(-rate * dt);

  useFrame((state, delta) => {
    const dt = Number.isFinite(delta) ? Math.min(Math.max(delta, 0.001), 0.08) : 0.016;
    const p = physics.current;
    const v = visual.current;
    if (!carRef.current) return;

    // Numerical sanity check
    if (!Number.isFinite(p.posX) || !Number.isFinite(p.posY) || !Number.isFinite(p.posZ) || !Number.isFinite(p.speed)) {
      resetCarToSpawn(gameState.gameMode);
      return;
    }

    // ── EXTERNAL WARP / STAGE JUMP REQUESTS (From HUD / Tour Controls) ──
    if (tourJumpRequest.teleportToFactory) {
      tourJumpRequest.teleportToFactory = false;
      isFirstFrame.current = true;
      p.posX = 82.0;
      p.posY = 0.06;
      p.posZ = 0;
      p.velY = 0;
      p.speed = 0;
      p.angle = Math.PI / 2;
      p.vx = 0;
      p.vz = 0;
      p.steeringAngle = 0;
      carGlobalPosition.set(p.posX, p.posY, p.posZ);
      carGlobalAngle.value = p.angle;
      prevFuelPosRef.current = { x: p.posX, z: p.posZ };
      return;
    }

    if (tourJumpRequest.stepIndex !== null) {
      const targetDept = AI_DEPARTMENTS[tourJumpRequest.stepIndex];
      tourJumpRequest.stepIndex = null;
      if (targetDept) {
        isFirstFrame.current = true;
        const cp = targetDept.checkpointPos;
        p.posX = cp[0];
        p.posY = 0.06;
        p.posZ = cp[2];
        p.velY = 0;
        p.speed = 0;
        p.angle = targetDept.facingAngle;
        p.vx = 0;
        p.vz = 0;
        p.steeringAngle = 0;
        tourWaypointIdx.current = Math.max(0, targetDept.routeWaypoints.length - 1);
        tourParkedRef.current = true;
        tourDwellTimer.current = 0;
        carGlobalPosition.set(p.posX, p.posY, p.posZ);
        carGlobalAngle.value = p.angle;
        prevFuelPosRef.current = { x: p.posX, z: p.posZ };
        return;
      }
    }

    // ── RESPAWN / RESTART CHECK ──
    if (inputs.reset || p.posY < -5.0) {
      if (inputs.reset && fuelRef.current <= 0) {
        fuelRef.current = 25;
        setGameState((s) => ({ ...s, fuel: 25, isRefueling: false }));
      }
      resetCarToSpawn(gameState.gameMode);
      return;
    }

    // ── CAMERA PERSPECTIVE TOGGLE ('C' KEY) ──
    if (inputs.cameraToggle && !wasCameraToggled.current) {
      wasCameraToggled.current = true;
      const modes: CameraPerspective[] = ['tpp', 'tpp-close', 'hood', 'drone'];
      const curIdx = modes.indexOf(gameState.cameraPerspective);
      const nextMode = modes[(curIdx + 1) % modes.length];
      setGameState((s) => ({ ...s, cameraPerspective: nextMode }));
    } else if (!inputs.cameraToggle) {
      wasCameraToggled.current = false;
    }

    // ── HORN ──
    if (inputs.horn && !wasHornPressed.current) {
      wasHornPressed.current = true;
      if (hornAudio.current && gameState.audioPlaying) {
        hornAudio.current.currentTime = 0;
        hornAudio.current.play().catch(() => {});
      }
    } else if (!inputs.horn && wasHornPressed.current) {
      wasHornPressed.current = false;
    }

    // ── RESPONSIVE HANDLING & STEERING (or Guided AI Tour Autopilot) ──
    const manualOverride =
      inputs.forward || inputs.backward || inputs.left || inputs.right || inputs.handbrake;
    const autopilotRunning =
      gameState.tourActive && !gameState.tourPaused && !gameState.activeFactoryDeptId && !manualOverride;

    let autoThrottle = false;
    let autoBrake = false;
    let targetSteer = 0;

    if (autopilotRunning) {
      const tourDept = AI_DEPARTMENTS[gameState.tourStepIndex];
      if (tourDept) {
        const wps = tourDept.routeWaypoints;
        const activeWp = wps[Math.min(tourWaypointIdx.current, wps.length - 1)];
        const isLastWp = tourWaypointIdx.current >= wps.length - 1;
        const dx = activeWp[0] - p.posX;
        const dz = activeWp[1] - p.posZ;
        const dist = Math.hypot(dx, dz);

        if (!isLastWp && dist < 4.5) {
          tourWaypointIdx.current++;
        } else if (isLastWp && dist < 2.8) {
          // Arrived at department inspection pad: park cleanly facing machine
          autoBrake = true;
          const faceDiff = Math.atan2(
            Math.sin(tourDept.facingAngle - p.angle),
            Math.cos(tourDept.facingAngle - p.angle)
          );
          p.angle += faceDiff * damp(6.0, dt);

          if (!tourParkedRef.current) {
            tourParkedRef.current = true;
            tourDwellTimer.current = 0;
            gsap.to(tourCamRig.current, {
              followDist: 7.4,
              followHeight: 3.8,
              lookAheadDist: 5.5,
              lookAtHeight: 2.6,
              duration: 1.2,
              ease: 'power2.out',
              overwrite: 'auto',
            });
          } else {
            tourDwellTimer.current += dt;
            if (tourDwellTimer.current >= 9.0) {
              tourDwellTimer.current = 0;
              setGameState((prev) => {
                if (!prev.tourActive || prev.tourPaused) return prev;
                const nextStep = prev.tourStepIndex + 1;
                if (nextStep >= AI_DEPARTMENTS.length) {
                  return { ...prev, tourActive: false, tourStepIndex: 0 };
                }
                const visited = prev.visitedFactoryDepts.includes(tourDept.id)
                  ? prev.visitedFactoryDepts
                  : [...prev.visitedFactoryDepts, tourDept.id];
                return { ...prev, tourStepIndex: nextStep, visitedFactoryDepts: visited };
              });
            }
          }
        } else {
          // Cruise smoothly toward waypoint
          const desiredAngle = Math.atan2(dx, dz);
          const angleDiff = Math.atan2(
            Math.sin(desiredAngle - p.angle),
            Math.cos(desiredAngle - p.angle)
          );
          targetSteer = Math.max(
            -CAR_CONFIG.maxSteering,
            Math.min(CAR_CONFIG.maxSteering, angleDiff * 1.4)
          );
          p.steeringAngle += (targetSteer - p.steeringAngle) * damp(10.0, dt);
          const cruiseCap = isLastWp && dist < 12 ? 12.0 : 21.0;
          autoThrottle = p.speed < cruiseCap;
          autoBrake = p.speed > cruiseCap + 3.0;
        }
      }
    } else {
      if (inputs.left) targetSteer = CAR_CONFIG.maxSteering;
      if (inputs.right) targetSteer = -CAR_CONFIG.maxSteering;

      const effectiveSpeed = Math.max(CAR_CONFIG.minSteerSpeed, Math.abs(p.speed));
      const speedFactor = Math.min(1.2, 0.65 + effectiveSpeed / 14);

      if (targetSteer !== 0) {
        p.steeringAngle += targetSteer * CAR_CONFIG.steerSpeed * dt * speedFactor;
        p.steeringAngle = Math.max(-CAR_CONFIG.maxSteering, Math.min(CAR_CONFIG.maxSteering, p.steeringAngle));
      } else {
        const returnRate = CAR_CONFIG.steerReturn * dt;
        if (Math.abs(p.steeringAngle) < returnRate) {
          p.steeringAngle = 0;
        } else {
          p.steeringAngle -= Math.sign(p.steeringAngle) * returnRate;
        }
      }
    }

    const effectiveSpeed = Math.max(CAR_CONFIG.minSteerSpeed, Math.abs(p.speed));

    // ── ACCELERATION, BRAKING & NITRO BOOST ──
    if (fuelSyncRequest.targetFuel !== null) {
      fuelRef.current = Math.max(0, Math.min(100, fuelSyncRequest.targetFuel));
      fuelSyncRequest.targetFuel = null;
    }
    const hasFuel = fuelRef.current > 0 || gameState.tourActive;
    const wantBoost = hasFuel && inputs.wheelie && (gameState.nitroAmount > 3 || Math.abs(p.speed) > 0.5);
    v.isBoosting = wantBoost;
    v.isBraking = false;

    // ── WHEELIE POP MECHANIC (Pops front wheels into the air on Shift boost) ──
    let targetWheelie = 0;
    if (wantBoost) {
      // High Hot Wheels wheelie pop on nitro boost!
      targetWheelie = Math.abs(p.speed) < 14 ? 0.36 : 0.24;
    }
    const prevWheelie = v.wheelieAngle;
    v.wheelieAngle += (targetWheelie - v.wheelieAngle) * damp(12.0, dt);
    if (prevWheelie > 0.18 && v.wheelieAngle <= 0.05) {
      // Subtle camera landing bounce when front wheels slam back down
      cameraShake.current = 0.12;
    }

    if (inputs.handbrake || autoBrake) {
      v.isBraking = true;
      p.speed = p.speed > 0
        ? Math.max(0, p.speed - CAR_CONFIG.brakeForce * dt)
        : Math.min(0, p.speed + CAR_CONFIG.brakeForce * dt);
    } else if (inputs.forward || autoThrottle) {
      if (hasFuel) {
        const topSpeed = wantBoost ? CAR_CONFIG.maxBoostSpeed : autoThrottle ? 21.0 : CAR_CONFIG.maxSpeed;
        const accelRate = wantBoost ? CAR_CONFIG.boostAccel : autoThrottle ? 22.0 : CAR_CONFIG.accel;
        p.speed = Math.min(topSpeed, p.speed + accelRate * dt);
      } else {
        const friction = CAR_CONFIG.friction * 1.4 * dt;
        p.speed = p.speed > 0 ? Math.max(0, p.speed - friction) : Math.min(0, p.speed + friction);
      }
    } else if (inputs.backward) {
      v.isBraking = true;
      if (p.speed > 0.5) {
        p.speed = Math.max(0, p.speed - (CAR_CONFIG.decel + CAR_CONFIG.brakeForce * 0.7) * dt);
      } else if (hasFuel) {
        p.speed = Math.max(CAR_CONFIG.maxRevSpeed, p.speed - CAR_CONFIG.accel * 0.85 * dt);
      } else {
        p.speed = Math.min(0, p.speed + CAR_CONFIG.friction * dt);
      }
    } else {
      const friction = CAR_CONFIG.friction * dt;
      if (Math.abs(p.speed) < friction) {
        p.speed = 0;
      } else {
        p.speed -= Math.sign(p.speed) * friction;
      }
    }

    // ── PRECISION CORNERING & ROAD GRIP (No Drifting / Tail Slip) ──
    const turnFactor = p.speed >= -0.1 ? 1 : -1;
    const turnSpeedMod = Math.min(1.35, 0.75 + effectiveSpeed / 10);
    p.angle += p.steeringAngle * turnFactor * turnSpeedMod * dt;

    const targetVx = Math.sin(p.angle);
    const targetVz = Math.cos(p.angle);
    const gripT = damp(CAR_CONFIG.normalGripRate, dt);
    p.vx += (targetVx * p.speed - p.vx) * gripT;
    p.vz += (targetVz * p.speed - p.vz) * gripT;

    // ── MOVEMENT & TRACK ELEVATION / JUMPS ──
    p.posX += p.vx * dt;
    p.posZ += p.vz * dt;

    const hw = checkHotWheelsTrack(p.posX, p.posZ, p.speed, p.posY, p.vx, p.vz, dt);

    if (hw.boostApplied) {
      p.speed = Math.min(CAR_CONFIG.maxBoostSpeed, p.speed + hw.boostSpeed);
      v.isBoosting = true;
      cameraShake.current = 0.22;
      stuntMsgRef.current = '⚡ SLIPSTREAM BOOST! ⚡';
      setGameState((s) => ({ ...s, stuntMessage: '⚡ SLIPSTREAM BOOST! ⚡' }));
      setTimeout(() => {
        setGameState((s) => ({ ...s, stuntMessage: null }));
      }, 1500);
    }

    if (hw.launchVelY > 0 && p.posY <= hw.groundY + 0.3) {
      p.velY = hw.launchVelY;
    }

    const currentGroundY = hw.groundY;
    const inAir = p.posY > currentGroundY + 0.2;

    // Airtime & Stunt detection
    if (inAir) {
      airTimeRef.current += dt;
      jumpDistRef.current += Math.hypot(p.vx, p.vz) * dt;
    } else {
      if (airTimeRef.current > 0.4) {
        // Just landed from high jump
        const points = Math.round(airTimeRef.current * 250 + jumpDistRef.current * 20);
        stuntScoreRef.current += points;
        cameraShake.current = Math.min(0.5, 0.15 + airTimeRef.current * 0.1);
      }
      airTimeRef.current = 0;
      jumpDistRef.current = 0;
    }

    // Smooth, realistic ground contact - prevents jumping on objects or curbs
    if (p.posY > currentGroundY + 0.02 || p.velY > 0) {
      p.velY -= 24 * dt; // Gravity
      p.posY += p.velY * dt;
      if (p.posY <= currentGroundY) {
        p.posY = currentGroundY;
        p.velY = 0;
      }
    } else if (p.posY < currentGroundY) {
      // Smooth climb onto ramps without sudden popping or jumping
      const climbRate = Math.max(8.0, Math.abs(p.speed) * 0.9);
      p.posY = Math.min(currentGroundY, p.posY + climbRate * dt);
      p.velY = 0;
    } else {
      p.posY = currentGroundY;
      p.velY = 0;
    }

    // ── EXPANDED MAP BOUNDARIES (City + Bowling + AI Intelligence Factory) ──
    const bounds = CAR_CONFIG.mapBounds;
    if (p.posX > bounds.maxX) { p.posX = bounds.maxX; p.vx = 0; p.speed *= 0.8; }
    if (p.posX < bounds.minX) { p.posX = bounds.minX; p.vx = 0; p.speed *= 0.8; }
    if (p.posZ > bounds.maxZ) { p.posZ = bounds.maxZ; p.vz = 0; p.speed *= 0.8; }
    if (p.posZ < bounds.minZ) { p.posZ = bounds.minZ; p.vz = 0; p.speed *= 0.8; }

    // ── SOLID OBSTACLE COLLISIONS (Buildings, Trees, Factory Walls & Pillars - Never Pass Through) ──
    const carR = CAR_CONFIG.carRadius;

    obstaclesList.forEach((obs) => {
      // Fast broad-phase reject using each obstacle's half-extents (supports wide factory buildings cleanly)
      const maxHalf = Math.max((obs.width || obs.radius * 2) * 0.5, (obs.depth || obs.radius * 2) * 0.5) + carR + 1.5;
      if (Math.abs(p.posX - obs.x) > maxHalf || Math.abs(p.posZ - obs.z) > maxHalf) return;

      let nx = 0;
      let nz = 0;
      let overlap = 0;

      if (obs.type === 'box') {
        const halfW = (obs.width || 4.0) / 2;
        const halfD = (obs.depth || 4.0) / 2;
        const clampX = Math.max(obs.x - halfW, Math.min(p.posX, obs.x + halfW));
        const clampZ = Math.max(obs.z - halfD, Math.min(p.posZ, obs.z + halfD));
        const dx = p.posX - clampX;
        const dz = p.posZ - clampZ;
        const distSq = dx * dx + dz * dz;

        if (distSq > 0.0001) {
          const dist = Math.sqrt(distSq);
          if (dist < carR) {
            overlap = carR - dist;
            nx = dx / dist;
            nz = dz / dist;
          }
        } else {
          // Car center penetrated inside box - push to closest outer edge
          const leftDist = p.posX - (obs.x - halfW);
          const rightDist = (obs.x + halfW) - p.posX;
          const frontDist = (obs.z + halfD) - p.posZ;
          const backDist = p.posZ - (obs.z - halfD);
          const minDist = Math.min(leftDist, rightDist, frontDist, backDist);

          if (minDist === leftDist) { nx = -1; nz = 0; overlap = leftDist + carR; }
          else if (minDist === rightDist) { nx = 1; nz = 0; overlap = rightDist + carR; }
          else if (minDist === backDist) { nx = 0; nz = -1; overlap = backDist + carR; }
          else { nx = 0; nz = 1; overlap = frontDist + carR; }
        }
      } else {
        // Circular collider (Trees, Streetlight poles, Arch pillars)
        const dx = p.posX - obs.x;
        const dz = p.posZ - obs.z;
        const dist = Math.hypot(dx, dz);
        const minDist = carR + (obs.radius || 0.5);
        if (dist < minDist && dist > 0.0001) {
          overlap = minDist - dist;
          nx = dx / dist;
          nz = dz / dist;
        }
      }

      if (overlap > 0) {
        p.posX += nx * overlap;
        p.posZ += nz * overlap;

        // Tangential sliding physics - prevents sticking or jitter
        const normalVel = p.vx * nx + p.vz * nz;
        if (normalVel < 0) {
          p.vx -= normalVel * nx * 1.1;
          p.vz -= normalVel * nz * 1.1;
          p.speed *= 0.88;
        }
      }
    });

    // Solid floor clamp: car can NEVER sink or go beneath tarmac level (0.06m)
    p.posY = Math.max(0.06, p.posY);

    // ── SKILL CUBES INTERACTION ──
    skillCubesList.forEach((cube) => {
      const dx = p.posX - cube.pos.x;
      const dz = p.posZ - cube.pos.z;
      const dist = Math.hypot(dx, dz);
      if (dist < CAR_CONFIG.carRadius + cube.size * 0.7 && dist > 0.001) {
        const nx = dx / dist;
        const nz = dz / dist;
        const pushForce = Math.max(4.0, Math.abs(p.speed) * 1.3);
        cube.vel.x = -nx * pushForce;
        cube.vel.z = -nz * pushForce;
        cube.vel.y = Math.max(2.5, Math.abs(p.speed) * 0.6);
        p.speed *= 0.75;
      }
    });

    // ── DISTANCE (MILES) & MILES-BASED FUEL CONSUMPTION / REFUELING ──
    if (!prevFuelPosRef.current) {
      prevFuelPosRef.current = { x: p.posX, z: p.posZ };
    }
    const stepDist = Math.hypot(p.posX - prevFuelPosRef.current.x, p.posZ - prevFuelPosRef.current.z);
    prevFuelPosRef.current.x = p.posX;
    prevFuelPosRef.current.z = p.posZ;

    // 65 world units = 1.00 trip mile; 0 distance when parked = 0 fuel burned
    const stepMiles = stepDist > 0.0001 && stepDist < 15 ? stepDist / 65 : 0;
    if (stepMiles > 0) {
      milesRef.current += stepMiles;
    }

    const inFuelZoneNow =
      Math.hypot(p.posX - ZONES.gasStation.x, p.posZ - ZONES.gasStation.z) < ZONES.gasStation.radius;
    const refuelingNow = inFuelZoneNow && (inputs.interact || gameState.isRefueling) && fuelRef.current < 100;

    if (refuelingNow) {
      fuelRef.current = Math.min(100, fuelRef.current + dt * 42);
    } else if (stepMiles > 0) {
      // Drains strictly per mile driven: 4.5% / mi cruise, 7.5% / mi under Shift Nitro boost
      const percentPerMile = wantBoost ? 7.5 : 4.5;
      fuelRef.current = Math.max(0, fuelRef.current - stepMiles * percentPerMile);
    }

    // ── UPDATE 3D TRANSFORM ──
    carRef.current.position.set(p.posX, p.posY, p.posZ);
    carRef.current.rotation.y = p.angle;

    carGlobalPosition.set(p.posX, p.posY, p.posZ);
    carGlobalAngle.value = p.angle;

    // ── SUSPENSION & WEIGHT TRANSFER ──
    const targetRoll = p.steeringAngle * (p.speed / CAR_CONFIG.maxSpeed) * CAR_CONFIG.maxRoll;
    v.bodyRoll += (targetRoll - v.bodyRoll) * damp(CAR_CONFIG.suspensionDamp, dt);

    let targetPitch = 0;
    if (hw.rampPitch !== 0 && !inAir) {
      targetPitch = hw.rampPitch;
    } else if (inAir) {
      targetPitch = -0.15;
    } else if (v.isBraking && p.speed > 2) {
      targetPitch = 0.06;
    } else if (inputs.forward && p.speed > 1) {
      targetPitch = wantBoost ? -0.06 : -0.03;
    }
    v.bodyPitch += (targetPitch - v.bodyPitch) * damp(CAR_CONFIG.suspensionDamp, dt);

    // ── CLASSIC THIRD-PERSON RACING CAMERA (Car framed in lower-center of screen) ──
    let followDist: number;
    let followHeight: number;
    let lookAheadDist: number;
    let lookAtHeight: number;

    if (gameState.tourActive) {
      followDist = tourCamRig.current.followDist;
      followHeight = tourCamRig.current.followHeight;
      lookAheadDist = tourCamRig.current.lookAheadDist;
      lookAtHeight = tourCamRig.current.lookAtHeight;
    } else {
      switch (gameState.cameraPerspective) {
        case 'tpp-close':
          followDist = 3.8;
          followHeight = 1.5;
          lookAheadDist = 2.0;
          lookAtHeight = 0.8;
          break;
        case 'hood':
          followDist = -0.3;
          followHeight = 0.85;
          lookAheadDist = 4.0;
          lookAtHeight = 0.85;
          break;
        case 'drone':
          followDist = 8.8;
          followHeight = 4.4;
          lookAheadDist = 2.8;
          lookAtHeight = 0.6;
          break;
        case 'tpp':
        default:
          // Classic chase camera: car framed in lower-center, road ahead clearly visible
          followDist = 5.2;
          followHeight = 2.0;
          lookAheadDist = 2.2;
          lookAtHeight = 0.95;
          break;
      }
    }

    const camTargetX = p.posX - Math.sin(p.angle) * followDist;
    const camTargetZ = p.posZ - Math.cos(p.angle) * followDist;
    const camTargetY = p.posY + followHeight;

    const lookAtX = p.posX + Math.sin(p.angle) * lookAheadDist;
    const lookAtZ = p.posZ + Math.cos(p.angle) * lookAheadDist;
    const lookAtY = p.posY + lookAtHeight;

    const cam = state.camera.position;

    // Instant snap on first frame / spawn / reset so camera never starts in sky or gets lost
    if (isFirstFrame.current) {
      isFirstFrame.current = false;
      cam.set(camTargetX, camTargetY, camTargetZ);
      currentLookAt.current.x = lookAtX;
      currentLookAt.current.y = lookAtY;
      currentLookAt.current.z = lookAtZ;
    } else {
      // Responsive 10.5 lerp keeps camera tightly tracking car without rubber-banding
      const lerpSpeed = 10.5;
      const camDamp = damp(lerpSpeed, dt);
      cam.x += (camTargetX - cam.x) * camDamp;
      cam.y += (camTargetY - cam.y) * camDamp;
      cam.z += (camTargetZ - cam.z) * camDamp;

      // Synchronously smooth the lookAt target to eliminate angular camera jitter/gittering
      const lookLerpSpeed = 14.0;
      const lookDamp = damp(lookLerpSpeed, dt);
      currentLookAt.current.x += (lookAtX - currentLookAt.current.x) * lookDamp;
      currentLookAt.current.y += (lookAtY - currentLookAt.current.y) * lookDamp;
      currentLookAt.current.z += (lookAtZ - currentLookAt.current.z) * lookDamp;
    }

    // Aim camera at smoothed lookAt point - rock solid 90fps tracking with zero jitter
    state.camera.lookAt(currentLookAt.current.x, currentLookAt.current.y, currentLookAt.current.z);

    // ── THROTTLED STATE & INTERACTION SYNC ──
    frameCounter.current++;
    if (frameCounter.current % 4 !== 0) return;

    // Detect closest project building
    let activeProjZone: string | null = null;
    let detectedZone: GameState['currentZone'] = null;

    for (const [projId, loc] of Object.entries(PROJECT_LOCATIONS)) {
      const d = Math.hypot(p.posX - loc.x, p.posZ - loc.z);
      if (d < 6.5) {
        activeProjZone = projId;
        detectedZone = 'projects';
        break;
      }
    }

    // Check Welcome, Gas Station, Garage, AI Factory Checkpoints & Contact zones
    const isAtGasStation = Math.hypot(p.posX - ZONES.gasStation.x, p.posZ - ZONES.gasStation.z) < ZONES.gasStation.radius;
    const isAtGarage = Math.hypot(p.posX - ZONES.garage.x, p.posZ - ZONES.garage.z) < ZONES.garage.radius;

    let nearbyFactoryDept: string | null = null;
    if (p.posX >= AI_FACTORY_BOUNDS.minX - 6) {
      let bestDist = 8.8;
      for (const dept of AI_DEPARTMENTS) {
        const d = Math.hypot(p.posX - dept.checkpointPos[0], p.posZ - dept.checkpointPos[2]);
        if (d < bestDist) {
          bestDist = d;
          nearbyFactoryDept = dept.id;
        }
      }
    }

    if (!detectedZone) {
      if (p.posX >= AI_FACTORY_BOUNDS.minX - 2) {
        detectedZone = 'ai-factory';
      } else if (Math.hypot(p.posX - ZONES.welcome.x, p.posZ - ZONES.welcome.z) < ZONES.welcome.radius) {
        detectedZone = 'welcome';
      } else if (isAtGasStation) {
        detectedZone = 'gas-station';
      } else if (isAtGarage) {
        detectedZone = 'garage';
      } else if (Math.hypot(p.posX, p.posZ - 24) < 4.5) {
        detectedZone = 'contact';
      } else if (Math.hypot(p.posX - 18, p.posZ) < 10.5) {
        detectedZone = 'skills';
      } else if (Math.hypot(p.posX - 65, p.posZ) < 28) {
        detectedZone = 'bowling';
      }
    }

    // Nitro Regen / Drain
    let nextNitro = gameState.nitroAmount;
    if (wantBoost) {
      nextNitro = Math.max(0, nextNitro - dt * 32);
    } else {
      nextNitro = Math.min(100, nextNitro + dt * 14);
    }

    // Fuel Consumption (synchronized from miles-driven ref) & Refuel State
    const nextFuel = fuelRef.current <= 0 ? 0 : Math.min(100, Math.ceil(fuelRef.current));
    const isRefueling = isAtGasStation && (inputs.interact || gameState.isRefueling) && nextFuel < 100;

    if (isRefueling) {
      nextNitro = Math.min(100, nextNitro + dt * 4 * 50);
    }

    // Calculate current Gear
    const absKmh = Math.round(Math.abs(p.speed) * 3.6);
    let gear = 1;
    if (p.speed < -0.5) gear = -1; // Reverse
    else if (absKmh > 135) gear = 5;
    else if (absKmh > 95) gear = 4;
    else if (absKmh > 60) gear = 3;
    else if (absKmh > 25) gear = 2;

    speedRef.current = p.speed;

    setGameState((prev) => {
      let newActiveProject = prev.activeProject;
      let newShowContact = prev.showContact;
      let newShowGarage = prev.showGarageModal;
      let newActiveFactoryDept = prev.activeFactoryDeptId;
      const visited = [...prev.visitedProjects];
      const visitedFactory = [...prev.visitedFactoryDepts];

      // Handle Garage toggle with 'G' key or interact at Garage
      if (inputs.garage || (isAtGarage && inputs.interact)) {
        newShowGarage = true;
      }

      if (
        inputs.interact &&
        !prev.activeProject &&
        !prev.activeFactoryDeptId &&
        !prev.showGarageModal &&
        !prev.showContact
      ) {
        if (nearbyFactoryDept) {
          newActiveFactoryDept = nearbyFactoryDept;
          inputs.interact = false;
          if (!visitedFactory.includes(nearbyFactoryDept)) visitedFactory.push(nearbyFactoryDept);
        } else if (activeProjZone) {
          const project = projects.find((pr) => pr.id === activeProjZone);
          if (project) {
            newActiveProject = project;
            inputs.interact = false;
            if (!visited.includes(activeProjZone)) visited.push(activeProjZone);
          }
        } else if (detectedZone === 'contact') {
          newShowContact = true;
          inputs.interact = false;
        }
      }

      const roundedFuel = Math.round(nextFuel);
      const roundedNitro = Math.round(nextNitro);
      const roundedMiles = Number(milesRef.current.toFixed(2));
      const skillsDisplaced = skillCubesList.some(
        (cube) => cube.pos.distanceToSquared(cube.initialPos) > 0.12 || cube.vel.lengthSq() > 0.05
      );

      // Bail out if nothing meaningful changed to prevent excessive re-renders
      if (
        prev.speed === absKmh &&
        prev.gear === gear &&
        prev.fuel === roundedFuel &&
        Math.abs(prev.milesDriven - roundedMiles) < 0.01 &&
        prev.isRefueling === isRefueling &&
        prev.skillsDisplaced === skillsDisplaced &&
        prev.showGarageModal === newShowGarage &&
        prev.nearbyFactoryDeptId === nearbyFactoryDept &&
        prev.activeFactoryDeptId === newActiveFactoryDept &&
        Math.abs(prev.nitroAmount - roundedNitro) < 2 &&
        prev.currentZone === detectedZone &&
        prev.activeProjectZoneId === activeProjZone &&
        prev.activeProject === newActiveProject &&
        prev.showContact === newShowContact &&
        prev.stuntScore === stuntScoreRef.current &&
        prev.stuntMessage === stuntMsgRef.current
      ) {
        return prev;
      }

      return {
        ...prev,
        speed: absKmh,
        gear,
        fuel: roundedFuel,
        isRefueling,
        skillsDisplaced,
        showGarageModal: newShowGarage,
        nearbyFactoryDeptId: nearbyFactoryDept,
        activeFactoryDeptId: newActiveFactoryDept,
        visitedFactoryDepts: visitedFactory,
        nitroAmount: roundedNitro,
        currentZone: detectedZone,
        activeProjectZoneId: activeProjZone,
        activeProject: newActiveProject,
        showContact: newShowContact,
        visitedProjects: visited,
        milesDriven: roundedMiles,
        stuntScore: stuntScoreRef.current,
        stuntMessage: stuntMsgRef.current,
      };
    });
  });

  const sportsFallback = <SportsCarModel physicsRef={physics} visualRef={visual} />;

  return (
    <>
      <group ref={carRef} position={[0, 0, 0]}>
        <CanvasErrorBoundary fallback={sportsFallback}>
          <Suspense fallback={sportsFallback}>
            {gameState.selectedCar === 'charger' && (
              <FastAndFuriousCarModel physicsRef={physics} visualRef={visual} />
            )}
            {gameState.selectedCar === 'mustang' && (
              <SportsCarModel physicsRef={physics} visualRef={visual} />
            )}
            {gameState.selectedCar === 'cyberpunk' && (
              <VehicleModel physicsRef={physics} visualRef={visual} />
            )}
            {gameState.selectedCar === 'beetle' && (
              <BeetleCarModel physicsRef={physics} visualRef={visual} />
            )}
          </Suspense>
        </CanvasErrorBoundary>
      </group>

      {/* World Space Tire Effects */}
      <TireSmoke physicsRef={physics} visualRef={visual} />
      <SkidMarks physicsRef={physics} visualRef={visual} />
    </>
  );
};
