import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Group, Matrix4, InstancedMesh, BoxGeometry, MeshBasicMaterial } from 'three';
import { useInput } from '../hooks/useInput';
import type { GameState, Project } from '../types';
import { obstaclesList } from './ObstaclesState';
import { VehicleModel } from './VehicleModel';

// ─── Engine Audio Synthesizer ─────────────────────────────────────────────
const useEngineAudio = (speedRef: React.MutableRefObject<number>, enabled: boolean) => {
  const startRoar = useRef<HTMLAudioElement | null>(null);
  const bmwEngine = useRef<HTMLAudioElement | null>(null);
  const hasPlayedRoar = useRef(false);

  React.useEffect(() => {
    if (!startRoar.current) {
      startRoar.current = new Audio('/audio/dragon-studio-car-engine-roaring-376881.mp3');
      startRoar.current.volume = 0.6;
    }
    if (!bmwEngine.current) {
      bmwEngine.current = new Audio('/audio/mizanstock-bmw-xm-car-sound-2023-165995.mp3');
      bmwEngine.current.loop = true;
      bmwEngine.current.volume = 0.0; // Start quiet, fades in via useFrame
      // Preserve pitch is important for some browsers, but we want the pitch to change with speed!
      if ('preservesPitch' in bmwEngine.current) {
        (bmwEngine.current as HTMLAudioElement & { preservesPitch?: boolean }).preservesPitch = false;
      }
    }

    if (!enabled) {
      bmwEngine.current?.pause();
      return;
    }

    // Play start roar exactly once when audio becomes enabled
    if (!hasPlayedRoar.current && startRoar.current) {
      hasPlayedRoar.current = true;
      startRoar.current.play().catch(() => {});
    }

    // Start the looping BMW engine sound
    if (bmwEngine.current) {
      bmwEngine.current.play().catch(() => {});
    }

    return () => {
      bmwEngine.current?.pause();
    };
  }, [enabled]);

  useFrame(() => {
    if (enabled && bmwEngine.current) {
      const absSpeed = Math.abs(speedRef.current);
      
      // Simulate 4 gears using playbackRate (pitch)
      const maxSpeed = 22.0; 
      const gearSize = maxSpeed / 4; 
      const gear = Math.min(3, Math.floor(absSpeed / gearSize));
      const speedInGear = absSpeed - (gear * gearSize);
      
      // Idle pitch = ~0.8. Revs up to ~1.6, drops back down on shift
      const targetRate = 0.8 + (speedInGear / gearSize) * 0.8 + (gear * 0.15); 
      
      // Smoothly interpolate the playback rate (pitch)
      bmwEngine.current.playbackRate += (targetRate - bmwEngine.current.playbackRate) * 0.15;
      
      // Volume gets louder as speed increases
      const targetVolume = 0.2 + Math.min(absSpeed / 40, 0.5);
      bmwEngine.current.volume += (targetVolume - bmwEngine.current.volume) * 0.1;
    }
  });
};

// ─── Tire Smoke ────────────────────────────────────────────────────────────
const TireSmoke: React.FC<{ isDrifting: boolean; physicsRef: React.MutableRefObject<CarPhysicsState> }> = ({
  isDrifting, physicsRef,
}) => {
  const particleCount = 40;
  const meshRef = useRef<InstancedMesh>(null);
  const particles = useRef<{ pos: Vector3; vel: Vector3; life: number; maxLife: number; scale: number }[] | null>(null);
  if (particles.current === null) {
    particles.current = Array.from({ length: particleCount }).map(() => ({
      pos: new Vector3(0, -100, 0),
      vel: new Vector3(0, 0, 0),
      life: 0,
      // eslint-disable-next-line react-hooks/purity
      maxLife: 0.5 + Math.random() * 0.5,
      scale: 0.1,
    }));
  }

  const { geo, mat } = React.useMemo(() => ({
    geo: new BoxGeometry(0.5, 0.5, 0.5),
    mat: new MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.4 }),
  }), []);

  useFrame((_s, delta) => {
    if (!meshRef.current) return;
    const dt = Math.min(delta, 0.1);
    const matrix = new Matrix4();

    particles.current!.forEach((p, i) => {
      if (isDrifting && p.life <= 0 && Math.random() < 0.3) {
        const carPos = { x: physicsRef.current.posX, z: physicsRef.current.posZ };
        const carAngle = physicsRef.current.angle;
        const back = -1.2, side = (Math.random() > 0.5 ? 1 : -1) * 0.8;
        p.pos.set(
          carPos.x + Math.sin(carAngle) * back + Math.cos(carAngle) * side,
          0.1,
          carPos.z + Math.cos(carAngle) * back - Math.sin(carAngle) * side
        );
        p.vel.set((Math.random() - 0.5) * 2, 1 + Math.random() * 2, (Math.random() - 0.5) * 2);
        p.life = p.maxLife;
        p.scale = 0.2 + Math.random() * 0.3;
      }
      if (p.life > 0) {
        p.life -= dt;
        p.pos.addScaledVector(p.vel, dt);
        p.scale += dt * 2;
        matrix.makeTranslation(p.pos.x, p.pos.y, p.pos.z);
        matrix.scale(new Vector3(p.scale, p.scale, p.scale));
        matrix.multiply(new Matrix4().makeRotationY(p.life * 10));
        meshRef.current!.setMatrixAt(i, matrix);
      } else {
        matrix.makeTranslation(0, -100, 0);
        meshRef.current!.setMatrixAt(i, matrix);
      }
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={meshRef} args={[geo, mat, particleCount]} />;
};

import { 
  carGlobalPosition, 
  carGlobalAngle, 
  ZONES, 
  PROJECT_BILLBOARDS, 
  skillCubesList
} from './CarState';
import type { CarPhysicsState, CarVisualState } from './CarState';

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

  React.useEffect(() => {
    hornAudio.current = new Audio('/audio/floraphonic-car-horn-2-189856.mp3');
    hornAudio.current.volume = 0.7;
  }, []);

  const [isDrifting, setIsDrifting] = React.useState(false);



  // ── Physics state (all mutable refs — no React state for perf) ──
  const physics = useRef<CarPhysicsState>({
    posX: 0,
    posZ: 13,
    posY: 0,        // Height above ground (for jump support)
    velY: 0,        // Vertical velocity
    speed: 0,
    angle: Math.PI,
    vx: 0,
    vz: 0,
    driftScore: 0,
    steeringAngle: 0,
  });

  // Smooth visual state (interpolated, not physics)
  const visual = useRef<CarVisualState>({
    wheelRot: 0,
    wheelieAngle: 0,   // X-axis pitch for wheelie (radians)
    camX: 0,
    camY: 5,
    camZ: 18,
  });

  // ── Physics constants (tuned for fun + responsiveness) ──
  const ACCEL          = 18.0; // Faster start
  const DECEL          = 10.0;
  const MAX_SPEED      = 22.0;
  const MAX_REV_SPEED  = -8.0;
  const FRICTION       = 3.0;
  const BRAKE_FORCE    = 35.0;
  const MAX_STEERING   = 0.6;  // Tighter turning radius
  const STEER_SPEED    = 5.0;  // Quicker steering response
  const STEER_RETURN   = 12.0; // Snappier return to center
  const MAP_LIMIT      = 22.0;

  let frameCounter = 0;

  // Helper for framerate-independent lerp
  const damp = (rate: number, dt: number) => 1 - Math.exp(-rate * dt);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.08); // cap at 80ms to avoid physics jumps
    const p = physics.current;
    const v = visual.current;
    if (!carRef.current) return;

    // ── 0. HORN AUDIO ────────────────────────────────────────────────────
    if (inputs.horn && !wasHornPressed.current) {
      wasHornPressed.current = true;
      if (hornAudio.current && gameState.audioPlaying) {
        hornAudio.current.currentTime = 0;
        hornAudio.current.play().catch(() => {});
      }
    } else if (!inputs.horn && wasHornPressed.current) {
      wasHornPressed.current = false;
    }

    // ── 1. STEERING ──────────────────────────────────────────────────────
    let targetSteer = 0;
    if (inputs.left)  targetSteer =  MAX_STEERING;
    if (inputs.right) targetSteer = -MAX_STEERING;

    const speedFactor = Math.min(1.2, 0.3 + Math.abs(p.speed) / 10);
    if (targetSteer !== 0) {
      p.steeringAngle += targetSteer * STEER_SPEED * dt * speedFactor;
      p.steeringAngle = Math.max(-MAX_STEERING, Math.min(MAX_STEERING, p.steeringAngle));
    } else {
      // Smooth return to center
      const returnRate = STEER_RETURN * dt;
      if (Math.abs(p.steeringAngle) < returnRate) {
        p.steeringAngle = 0;
      } else {
        p.steeringAngle -= Math.sign(p.steeringAngle) * returnRate;
      }
    }

    // ── 2. ACCELERATION & BRAKING ────────────────────────────────────────
    if (inputs.handbrake) {
      // Handbrake: quick deceleration (drift trigger)
      p.speed = p.speed > 0
        ? Math.max(0, p.speed - BRAKE_FORCE * dt)
        : Math.min(0, p.speed + BRAKE_FORCE * dt);
    } else if (inputs.forward) {
      p.speed = Math.min(MAX_SPEED, p.speed + ACCEL * dt);
    } else if (inputs.backward) {
      if (p.speed > 0.5) {
        p.speed = Math.max(0, p.speed - (DECEL + BRAKE_FORCE * 0.6) * dt);
      } else {
        p.speed = Math.max(MAX_REV_SPEED, p.speed - DECEL * dt);
      }
    } else {
      // Natural friction / coasting
      const friction = FRICTION * dt;
      if (Math.abs(p.speed) < friction) {
        p.speed = 0;
      } else {
        p.speed -= Math.sign(p.speed) * friction;
      }
    }

    // ── 3. DRIFT DETECTION ───────────────────────────────────────────────
    const currentIsDrifting =
      inputs.handbrake && Math.abs(p.speed) > 5 && Math.abs(p.steeringAngle) > 0.1;
    if (currentIsDrifting !== isDrifting) setIsDrifting(currentIsDrifting);

    // ── 4. TURNING ───────────────────────────────────────────────────────
    const turnFactor = p.speed > 0 ? 1 : p.speed < 0 ? -1 : 0;
    const steerIntensity = currentIsDrifting ? 1.5 : 1.0;
    p.angle += p.steeringAngle * turnFactor * (Math.abs(p.speed) / 12) * steerIntensity * dt;

    // ── 5. VELOCITY VECTOR ───────────────────────────────────────────────
    const targetVx = Math.sin(p.angle);
    const targetVz = Math.cos(p.angle);
    // Lower grip when drifting → more slide, higher grip = tight turns
    // Use clamped interpolation to prevent Euler overshoots (jitter)
    const gripRate = currentIsDrifting ? 3.0 : 25.0;
    const gripT = damp(gripRate, dt);
    p.vx += (targetVx * p.speed - p.vx) * gripT;
    p.vz += (targetVz * p.speed - p.vz) * gripT;

    // ── 6. POSITION ──────────────────────────────────────────────────────
    p.posX += p.vx * dt;
    p.posZ += p.vz * dt;

    // Simple vertical (Y) physics for future ramp support
    if (p.posY > 0 || p.velY !== 0) {
      p.velY -= 20 * dt; // gravity
      p.posY += p.velY * dt;
      if (p.posY <= 0) {
        p.posY = 0;
        p.velY = 0;
      }
    }

    // ── 7. MAP BOUNDARY ──────────────────────────────────────────────────
    if (p.posX >  MAP_LIMIT) { p.posX =  MAP_LIMIT; p.vx = -p.vx * 0.3; p.speed *= -0.2; }
    if (p.posX < -MAP_LIMIT) { p.posX = -MAP_LIMIT; p.vx = -p.vx * 0.3; p.speed *= -0.2; }
    if (p.posZ >  MAP_LIMIT) { p.posZ =  MAP_LIMIT; p.vz = -p.vz * 0.3; p.speed *= -0.2; }
    if (p.posZ < -MAP_LIMIT) { p.posZ = -MAP_LIMIT; p.vz = -p.vz * 0.3; p.speed *= -0.2; }

    // ── 8. STATIC OBSTACLE COLLISIONS ────────────────────────────────────
    const carRadius = 1.1;
    obstaclesList.forEach((obs) => {
      const dx = p.posX - obs.x;
      const dz = p.posZ - obs.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      const minDist = carRadius + obs.radius;
      if (dist < minDist && dist > 0.001) {
        const overlap = minDist - dist;
        const nx = dx / dist, nz = dz / dist;
        p.posX += nx * overlap;
        p.posZ += nz * overlap;
        const normalVel = p.vx * nx + p.vz * nz;
        if (normalVel < 0) {
          p.vx -= nx * normalVel * 1.2;
          p.vz -= nz * normalVel * 1.2;
          p.speed = -p.speed * 0.25;
        }
      }
    });

    // ── 9. SKILL CUBE COLLISIONS ─────────────────────────────────────────
    skillCubesList.forEach((cube) => {
      const dx = p.posX - cube.pos.x;
      const dz = p.posZ - cube.pos.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      const minDist = carRadius + cube.size * 0.7;
      if (dist < minDist && dist > 0.001) {
        const overlap = minDist - dist;
        const nx = dx / dist, nz = dz / dist;
        const pushForce = Math.max(3, Math.abs(p.speed) * 1.1);
        cube.vel.x = -nx * pushForce;
        cube.vel.z = -nz * pushForce;
        cube.vel.y = Math.max(2, Math.abs(p.speed) * 0.5);
        cube.rotVel.x = (Math.random() - 0.5) * 8;
        cube.rotVel.y = (Math.random() - 0.5) * 8;
        cube.rotVel.z = (Math.random() - 0.5) * 8;
        p.posX += nx * overlap * 0.5;
        p.posZ += nz * overlap * 0.5;
        p.speed *= 0.6;
      }
    });

    // ── 10. MESH UPDATE ──────────────────────────────────────────────────
    carRef.current.position.set(p.posX, p.posY, p.posZ);
    carRef.current.rotation.y = p.angle;

    carGlobalPosition.set(p.posX, p.posY, p.posZ);
    carGlobalAngle.value = p.angle;

    // ── 11. WHEEL ROTATION (visual) ──────────────────────────────────────
    v.wheelRot += p.speed * 2.5 * dt;

    // ── 12. WHEELIE VISUAL PITCH ─────────────────────────────────────────
    // Wheelie: nose-up when W held + Shift (or wheelie button), fades out when released
    const wantWheelieUp = (inputs.wheelie || inputs.forward) && inputs.wheelie;
    const targetWheelieAngle = wantWheelieUp && p.speed > 2 ? -0.28 : 0; // negative = nose up
    v.wheelieAngle += (targetWheelieAngle - v.wheelieAngle) * 6 * dt;

    // ── 13. SMOOTH CAMERA ────────────────────────────────────────────────
    // Speed-dependent follow distance + height
    const followDist = 5.5 + Math.abs(p.speed) * 0.08;
    const followHeight = 2.4 + (inputs.wheelie ? 0.8 : 0) + p.posY * 0.5;

    const camTargetX = p.posX - Math.sin(p.angle) * followDist;
    const camTargetZ = p.posZ - Math.cos(p.angle) * followDist;
    const camTargetY = followHeight;

    // Dynamic lerp: faster at high speed, slower when parked, using framerate independent damp
    const lerpRateXZ = 3.0 + Math.abs(p.speed) * 0.3;
    const lerpRateY  = 2.0; // slow Y follow to prevent bouncing

    const cam = state.camera.position;
    cam.x += (camTargetX - cam.x) * damp(lerpRateXZ, dt);
    cam.z += (camTargetZ - cam.z) * damp(lerpRateXZ, dt);
    cam.y += (camTargetY - cam.y) * damp(lerpRateY, dt);

    const lookAt = new Vector3(
      p.posX + Math.sin(p.angle) * 1.5,
      p.posY + 0.5,
      p.posZ + Math.cos(p.angle) * 1.5
    );
    state.camera.lookAt(lookAt);

    // ── 14. ZONE CHECKS (throttled) ──────────────────────────────────────
    frameCounter++;
    if (frameCounter % 4 !== 0) return;

    let detectedZone: GameState['currentZone'] = null;
    let activeProjZone: string | null = null;

    for (const [zoneKey, zoneVal] of Object.entries(ZONES)) {
      const dx = p.posX - zoneVal.x;
      const dz = p.posZ - zoneVal.z;
      if (Math.sqrt(dx * dx + dz * dz) < zoneVal.radius) {
        detectedZone = zoneKey as GameState['currentZone'];
        break;
      }
    }

    if (detectedZone === 'projects') {
      for (const proj of PROJECT_BILLBOARDS) {
        const dx = p.posX - proj.x;
        const dz = p.posZ - proj.z;
        if (Math.sqrt(dx * dx + dz * dz) < proj.radius) {
          activeProjZone = proj.id;
          break;
        }
      }
    }

    let downloaded = gameState.downloadedResume;
    if (detectedZone === 'resume' && !gameState.downloadedResume) {
      downloaded = true;
      const link = document.createElement('a');
      link.href = '/cv/RajatAmbedkar_CV.docx';
      link.download = 'RajatAmbedkar_CV.docx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      import('canvas-confetti').then((m) => m.default({ particleCount: 100, spread: 70, origin: { y: 0.6 } }));
    }

    let currentDriftMeter = 0;
    if (isDrifting) {
      p.driftScore = Math.min(100, p.driftScore + dt * 45);
      currentDriftMeter = p.driftScore;
    } else {
      p.driftScore = Math.max(0, p.driftScore - dt * 60);
      currentDriftMeter = p.driftScore;
    }

    speedRef.current = p.speed;

    setGameState((prev) => {
      let newActiveProject = prev.activeProject;
      let newShowContact = prev.showContact;
      const visited = [...prev.visitedProjects];

      if (inputs.interact) {
        if (activeProjZone) {
          const project = projects.find((pr) => pr.id === activeProjZone);
          if (project) {
            newActiveProject = project;
            if (!visited.includes(activeProjZone)) visited.push(activeProjZone);
          }
        } else if (detectedZone === 'contact') {
          newShowContact = true;
        }
      }

      if (
        prev.currentZone === detectedZone &&
        prev.activeProjectZoneId === activeProjZone &&
        prev.downloadedResume === downloaded &&
        prev.activeProject === newActiveProject &&
        prev.showContact === newShowContact &&
        prev.speed === Math.round(Math.abs(p.speed) * 3) &&
        Math.abs(prev.drift - currentDriftMeter) < 5
      ) return prev;

      return {
        ...prev,
        currentZone: detectedZone,
        activeProjectZoneId: activeProjZone,
        downloadedResume: downloaded,
        activeProject: newActiveProject,
        showContact: newShowContact,
        visitedProjects: visited,
        speed: Math.round(Math.abs(p.speed) * 3),
        drift: Math.round(currentDriftMeter),
      };
    });
  });

  return (
    <>
      <group ref={carRef} position={[0, 0, 13]} scale={[1, 1, 1]}>
        <React.Suspense fallback={<FallbackCar />}>
          <VehicleModel
            physicsRef={physics}
            visualRef={visual}
          />
        </React.Suspense>

        {/* Headlights */}
        <spotLight
          position={[0.4, 0.6, 1.2]}
          angle={0.4}
          penumbra={0.5}
          intensity={25}
          distance={18}
          color="#ffffff"
          castShadow={false}
        />
        <spotLight
          position={[-0.4, 0.6, 1.2]}
          angle={0.4}
          penumbra={0.5}
          intensity={25}
          distance={18}
          color="#ffffff"
          castShadow={false}
        />

        {/* Tail glow */}
        <pointLight
          position={[0, 0.4, -1.5]}
          color={inputs.backward || inputs.handbrake ? '#ef4444' : '#7c3aed'}
          intensity={inputs.backward || inputs.handbrake ? 3 : 1.2}
          distance={4}
        />
      </group>

      <TireSmoke
        isDrifting={isDrifting}
        physicsRef={physics}
      />
    </>
  );
};

// ─── Fallback while GLB loads ───────────────────────────────────────────────
const FallbackCar: React.FC = () => (
  <group>
    {/* Simple white box car as placeholder */}
    <mesh position={[0, 0.4, 0]} castShadow>
      <boxGeometry args={[1.4, 0.5, 2.8]} />
      <meshStandardMaterial color="#f3f4f6" roughness={0.2} metalness={0.3} />
    </mesh>
    <mesh position={[0, 0.85, -0.15]} castShadow>
      <boxGeometry args={[1.0, 0.4, 1.3]} />
      <meshStandardMaterial color="#a855f7" emissive="#7c3aed" emissiveIntensity={0.6} transparent opacity={0.7} />
    </mesh>
    {/* Wheels */}
    {[[-0.85, 0.25, 0.9], [0.85, 0.25, 0.9], [-0.85, 0.25, -0.9], [0.85, 0.25, -0.9]].map((pos, i) => (
      <mesh key={i} position={pos as [number, number, number]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.3, 12]} />
        <meshStandardMaterial color="#1f2937" roughness={0.8} />
      </mesh>
    ))}
  </group>
);
