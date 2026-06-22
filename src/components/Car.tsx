import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Group, Mesh, Matrix4, InstancedMesh, BoxGeometry, MeshBasicMaterial } from 'three';
import { useInput } from '../hooks/useInput';
import type { GameState, Project } from '../types';
import { obstaclesList } from './Obstacles';

// Synthesizer for engine sound
const useEngineAudio = (speedRef: React.MutableRefObject<number>, enabled: boolean) => {
  const audioCtx = useRef<AudioContext | null>(null);
  const oscillator = useRef<OscillatorNode | null>(null);
  const gainNode = useRef<GainNode | null>(null);

  React.useEffect(() => {
    if (!enabled) {
      if (audioCtx.current) {
        audioCtx.current.suspend();
      }
      return;
    }

    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      oscillator.current = audioCtx.current.createOscillator();
      gainNode.current = audioCtx.current.createGain();

      oscillator.current.type = 'sawtooth';
      
      // Low pass filter to make it sound more like an engine rumble
      const filter = audioCtx.current.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 400;

      oscillator.current.connect(filter);
      filter.connect(gainNode.current);
      gainNode.current.connect(audioCtx.current.destination);
      
      oscillator.current.start();
      gainNode.current.gain.value = 0.05; // Base volume
    }

    audioCtx.current.resume();

    return () => {
      // Don't destroy on unmount, just suspend to prevent audio context limits
      audioCtx.current?.suspend();
    };
  }, [enabled]);

  useFrame(() => {
    if (enabled && oscillator.current && gainNode.current) {
      const absSpeed = Math.abs(speedRef.current);
      // Pitch goes up with speed (base 60Hz + up to 150Hz based on speed)
      const targetFreq = 60 + (absSpeed * 6);
      oscillator.current.frequency.setTargetAtTime(targetFreq, audioCtx.current!.currentTime, 0.1);
      
      // Volume slightly increases with speed
      const targetVol = 0.05 + Math.min(absSpeed / 400, 0.1);
      gainNode.current.gain.setTargetAtTime(targetVol, audioCtx.current!.currentTime, 0.1);
    }
  });
};

// Tire smoke particle system
const TireSmoke: React.FC<{ isDrifting: boolean; carPos: { x: number, z: number }, carAngle: number }> = ({ isDrifting, carPos, carAngle }) => {
  const particleCount = 40;
  const meshRef = useRef<InstancedMesh>(null);
  
  // State for particles
  const particles = useRef(Array.from({ length: particleCount }).map(() => ({
    pos: new Vector3(0, -100, 0), // Hidden initially
    vel: new Vector3(0, 0, 0),
    life: 0,
    maxLife: 0.5 + Math.random() * 0.5,
    scale: 0.1,
  })));

  const { geo, mat } = React.useMemo(() => ({
    geo: new BoxGeometry(0.5, 0.5, 0.5),
    mat: new MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.5 })
  }), []);

  useFrame((_state, delta) => {
    if (!meshRef.current) return;
    const dt = Math.min(delta, 0.1);
    let matrix = new Matrix4();

    particles.current.forEach((p, i) => {
      // If drifting, spawn new particles
      if (isDrifting && p.life <= 0 && Math.random() < 0.3) {
        // Spawn behind car wheels
        const backOffset = -1.2;
        const sideOffset = (Math.random() > 0.5 ? 1 : -1) * 0.8;
        
        p.pos.set(
          carPos.x + Math.sin(carAngle) * backOffset + Math.cos(carAngle) * sideOffset,
          0.1,
          carPos.z + Math.cos(carAngle) * backOffset - Math.sin(carAngle) * sideOffset
        );
        
        p.vel.set(
          (Math.random() - 0.5) * 2,
          1 + Math.random() * 2, // Upwards
          (Math.random() - 0.5) * 2
        );
        p.life = p.maxLife;
        p.scale = 0.2 + Math.random() * 0.3;
      }

      // Update active particles
      if (p.life > 0) {
        p.life -= dt;
        p.pos.addScaledVector(p.vel, dt);
        p.scale += dt * 2; // Grow over time
        
        matrix.makeTranslation(p.pos.x, p.pos.y, p.pos.z);
        matrix.scale(new Vector3(p.scale, p.scale, p.scale));
        
        // Random rotation
        matrix.multiply(new Matrix4().makeRotationY(p.life * 10));
        
        meshRef.current!.setMatrixAt(i, matrix);
      } else {
        // Hide
        matrix.makeTranslation(0, -100, 0);
        meshRef.current!.setMatrixAt(i, matrix);
      }
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={meshRef} args={[geo, mat, particleCount]} />;
};

// Export global car position for other components (like minimap or skill blocks) to read easily
export const carGlobalPosition = new Vector3(0, 0, 8);
export const carGlobalAngle = { value: 0 };

// Export global skill cubes list so they can be physically simulated and knocked over
export interface SkillCubeState {
  id: string;
  name: string;
  pos: Vector3;
  vel: Vector3;
  rot: Vector3;
  rotVel: Vector3;
  size: number;
}

export const skillCubesList: SkillCubeState[] = [];

// Position config for interactive zones
export const ZONES = {
  welcome: { x: 0, z: 8, radius: 3.5 },
  projects: { x: -8, z: -4, radius: 7.5 },
  skills: { x: 10, z: 0, radius: 4.5 },
  resume: { x: -7, z: 8, radius: 2.5 },
  contact: { x: 7, z: 8, radius: 2.5 },
  minigame: { x: 10, z: -8, radius: 5 },
};

// Sub-positions for specific project buildings across the map (all placed inside projects zone)
export const PROJECT_BILLBOARDS = [
  { id: 'wesell-restaurants', x: -12, z: -8, radius: 2.0 },
  { id: 'ebmci-taiwan', x: -8, z: -8, radius: 2.0 },
  { id: 'knowledger', x: -4, z: -8, radius: 2.0 },
  { id: 'teachercool', x: -12, z: -4, radius: 2.0 },
  { id: 'hye-connect', x: -8, z: -4, radius: 2.0 },
  { id: 'iallo', x: -4, z: -4, radius: 2.0 },
  { id: 'ceretax', x: -12, z: 0, radius: 2.0 },
  { id: 'sarina-clinic', x: -4, z: 0, radius: 2.0 },
];

interface CarProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  projects: Project[];
}

export const Car: React.FC<CarProps> = ({ gameState, setGameState, projects }) => {
  const carRef = useRef<Group>(null);
  const frontLeftWheelRef = useRef<Mesh>(null);
  const frontRightWheelRef = useRef<Mesh>(null);
  const rearLeftWheelRef = useRef<Mesh>(null);
  const rearRightWheelRef = useRef<Mesh>(null);

  const inputs = useInput();
  
  // Track speed for engine audio
  const speedRef = useRef(0);
  useEngineAudio(speedRef, gameState.audioPlaying);

  // Track drift for smoke
  const [isDrifting, setIsDrifting] = React.useState(false);

  // Physics state refs (prevents react re-renders from killing frame rate)
  const physics = useRef({
    posX: 0,
    posZ: 8,
    speed: 0,
    angle: Math.PI, // Face towards the center (north) initially
    vx: 0,
    vz: 0,
    driftScore: 0,
    steeringAngle: 0,
    cameraShake: 0,
  });

  // Settings
  const ACCEL = 13.0;
  const DECEL = 8.0;
  const MAX_SPEED = 18.0;
  const MAX_REVERSE_SPEED = -6.0;
  const FRICTION = 3.0;
  const BRAKE_FORCE = 25.0;
  const MAX_STEERING = 0.55;
  const STEER_SPEED = 4.0;
  const STEER_RETURN = 6.0;
  const MAP_LIMIT = 16.5; // Map boundary size (18x18 absolute size)

  // Sync state variables back to React HUD once in a while (throttle to every 3 frames)
  let frameCounter = 0;

  useFrame((state, delta) => {
    // Limit delta to prevent massive physics jumps on lag spikes
    const dt = Math.min(delta, 0.1);
    const p = physics.current;
    if (!carRef.current) return;

    // 1. STEERING LOGIC
    let targetSteer = 0;
    if (inputs.left) targetSteer = MAX_STEERING;
    if (inputs.right) targetSteer = -MAX_STEERING;

    // Interpolate current steering angle
    if (targetSteer !== 0) {
      // Steer faster at lower speed, stiffen steering at high speeds
      const steerFactor = Math.min(1.2, 0.3 + Math.abs(p.speed) / 8);
      p.steeringAngle += targetSteer * STEER_SPEED * dt * steerFactor;
      p.steeringAngle = Math.max(-MAX_STEERING, Math.min(MAX_STEERING, p.steeringAngle));
    } else {
      // Return to center
      if (p.steeringAngle > 0) {
        p.steeringAngle = Math.max(0, p.steeringAngle - STEER_RETURN * dt);
      } else {
        p.steeringAngle = Math.min(0, p.steeringAngle + STEER_RETURN * dt);
      }
    }

    // 2. ACCELERATION & BRAKING
    if (inputs.handbrake) {
      // Brake/Drift deceleration
      if (p.speed > 0) {
        p.speed = Math.max(0, p.speed - BRAKE_FORCE * dt);
      } else {
        p.speed = Math.min(0, p.speed + BRAKE_FORCE * dt);
      }
    } else if (inputs.forward) {
      // Accelerate forward
      p.speed = Math.min(MAX_SPEED, p.speed + ACCEL * dt);
    } else if (inputs.backward) {
      // Reverse or brake if moving forward
      if (p.speed > 0) {
        p.speed = Math.max(MAX_REVERSE_SPEED, p.speed - (DECEL + BRAKE_FORCE) * dt);
      } else {
        p.speed = Math.max(MAX_REVERSE_SPEED, p.speed - DECEL * dt);
      }
    } else {
      // Passive drag/friction
      if (p.speed > 0) {
        p.speed = Math.max(0, p.speed - FRICTION * dt);
      } else {
        p.speed = Math.min(0, p.speed + FRICTION * dt);
      }
    }

    // 3. DRIFT & TURN RATES
    const currentIsDrifting = inputs.handbrake && Math.abs(p.speed) > 6 && Math.abs(p.steeringAngle) > 0.15;
    if (currentIsDrifting !== isDrifting) setIsDrifting(currentIsDrifting);
    
    // Heading direction
    const turnFactor = p.speed > 0 ? 1 : p.speed < 0 ? -1 : 0;
    
    // In drift state, steering is exaggerated (oversteer)
    const steerIntensity = currentIsDrifting ? 1.6 : 1.0;
    p.angle += p.steeringAngle * turnFactor * (Math.abs(p.speed) / 10) * steerIntensity * dt;

    // Movement direction vector
    const targetVx = Math.sin(p.angle);
    const targetVz = Math.cos(p.angle);

    // Drifting slide factor: if drifting, slide inertia is high. Grip is low.
    const gripFactor = isDrifting ? 1.2 : 7.0; // low grip when drifting
    
    // Interpolate velocity vector towards heading vector
    p.vx += (targetVx * p.speed - p.vx) * gripFactor * dt;
    p.vz += (targetVz * p.speed - p.vz) * gripFactor * dt;

    // 4. POSITION UPDATE
    p.posX += p.vx * dt;
    p.posZ += p.vz * dt;

    // 5. MAP BOUNDARY CLAMPING & BOUNCE
    let hitBoundary = false;
    if (p.posX > MAP_LIMIT) {
      p.posX = MAP_LIMIT;
      p.vx = -p.vx * 0.4;
      hitBoundary = true;
    } else if (p.posX < -MAP_LIMIT) {
      p.posX = -MAP_LIMIT;
      p.vx = -p.vx * 0.4;
      hitBoundary = true;
    }

    if (p.posZ > MAP_LIMIT) {
      p.posZ = MAP_LIMIT;
      p.vz = -p.vz * 0.4;
      hitBoundary = true;
    } else if (p.posZ < -MAP_LIMIT) {
      p.posZ = -MAP_LIMIT;
      p.vz = -p.vz * 0.4;
      hitBoundary = true;
    }

    if (hitBoundary) {
      p.speed = -p.speed * 0.3;
      p.cameraShake = 0.4;
    }

    // 6. COLLISION WITH STATIC OBSTACLES (obstaclesList)
    const carRadius = 1.1; // Bounding radius of the car
    obstaclesList.forEach((obs) => {
      const dx = p.posX - obs.x;
      const dz = p.posZ - obs.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      const minDist = carRadius + obs.radius;

      if (dist < minDist) {
        // Resolve overlap (push out)
        const overlap = minDist - dist;
        const nx = dx / (dist || 1);
        const nz = dz / (dist || 1);

        p.posX += nx * overlap;
        p.posZ += nz * overlap;

        // Bounce back velocity
        const normalVel = p.vx * nx + p.vz * nz;
        if (normalVel < 0) {
          // Calculate bounce normal impulse
          p.vx -= nx * normalVel * 1.4;
          p.vz -= nz * normalVel * 1.4;
          p.speed = -p.speed * 0.35;
          p.cameraShake = 0.35;
        }
      }
    });

    // 7. COLLISION WITH KNOCKABLE SKILLS CUBES
    skillCubesList.forEach((cube) => {
      const dx = p.posX - cube.pos.x;
      const dz = p.posZ - cube.pos.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      const minDist = carRadius + cube.size * 0.7; // Approx sphere radius for cube

      if (dist < minDist) {
        const overlap = minDist - dist;
        const nx = dx / (dist || 1);
        const nz = dz / (dist || 1);

        // Push cube away (apply momentum)
        const pushForce = Math.max(3.0, Math.abs(p.speed) * 1.1);
        cube.vel.x = -nx * pushForce;
        cube.vel.z = -nz * pushForce;
        cube.vel.y = Math.max(2.0, Math.abs(p.speed) * 0.6); // slight upward pop!

        // Give random spinning torque
        cube.rotVel.x = (Math.random() - 0.5) * 8;
        cube.rotVel.y = (Math.random() - 0.5) * 8;
        cube.rotVel.z = (Math.random() - 0.5) * 8;

        // Push car back slightly
        p.posX += nx * overlap * 0.5;
        p.posZ += nz * overlap * 0.5;
        p.speed = p.speed * 0.5;
      }
    });

    // 8. UPDATE 3D MESH
    carRef.current.position.set(p.posX, 0, p.posZ);
    carRef.current.rotation.y = p.angle;

    // Export global position for other modules (minimap, etc)
    carGlobalPosition.set(p.posX, 0, p.posZ);
    carGlobalAngle.value = p.angle;

    // Rotate Wheels based on velocity
    const wheelRotSpeed = p.speed * 2.0 * dt;
    if (rearLeftWheelRef.current) rearLeftWheelRef.current.rotation.x += wheelRotSpeed;
    if (rearRightWheelRef.current) rearRightWheelRef.current.rotation.x += wheelRotSpeed;
    if (frontLeftWheelRef.current) {
      frontLeftWheelRef.current.rotation.x += wheelRotSpeed;
      frontLeftWheelRef.current.rotation.y = p.steeringAngle;
    }
    if (frontRightWheelRef.current) {
      frontRightWheelRef.current.rotation.x += wheelRotSpeed;
      frontRightWheelRef.current.rotation.y = p.steeringAngle;
    }

    // 9. DYNAMIC FOLLOW CAMERA
    const followDist = 5.5;
    const followHeight = 2.4;
    
    const lookTarget = new Vector3(
      p.posX + Math.sin(p.angle) * 1.2,
      0.4,
      p.posZ + Math.cos(p.angle) * 1.2
    );

    // Behind car position
    const camTargetX = p.posX - Math.sin(p.angle) * followDist;
    const camTargetZ = p.posZ - Math.cos(p.angle) * followDist;
    const camTargetY = followHeight;

    const currentCam = state.camera.position;
    
    // LERP camera to target position (faster follow when moving fast)
    const lerpSpeed = isDrifting ? 0.05 : 0.09;
    currentCam.x += (camTargetX - currentCam.x) * lerpSpeed;
    currentCam.y += (camTargetY - currentCam.y) * lerpSpeed;
    currentCam.z += (camTargetZ - currentCam.z) * lerpSpeed;

    // Camera shake decay
    if (p.cameraShake > 0.01) {
      p.cameraShake *= 0.9;
      currentCam.x += (Math.random() - 0.5) * p.cameraShake;
      currentCam.y += (Math.random() - 0.5) * p.cameraShake;
      currentCam.z += (Math.random() - 0.5) * p.cameraShake;
    }

    state.camera.lookAt(lookTarget);

    // 10. ZONE CHECKING AND PORTFOLIO TRIGGERS (Throttle back to React state to prevent lagging)
    frameCounter++;
    if (frameCounter % 4 === 0) {
      // Find current active zone
      let detectedZone: GameState['currentZone'] = null;
      let activeProjZone: string | null = null;

      // Check general zones
      for (const [zoneKey, zoneVal] of Object.entries(ZONES)) {
        const dx = p.posX - zoneVal.x;
        const dz = p.posZ - zoneVal.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < zoneVal.radius) {
          detectedZone = zoneKey as GameState['currentZone'];
          break;
        }
      }

      // Check specific project billboards (if inside the projects zone)
      if (detectedZone === 'projects') {
        for (const proj of PROJECT_BILLBOARDS) {
          const dx = p.posX - proj.x;
          const dz = p.posZ - proj.z;
          const dist = Math.sqrt(dx * dx + dz * dz);
          if (dist < proj.radius) {
            activeProjZone = proj.id;
            break;
          }
        }
      }

      // Auto trigger Resume Download when entering Resume Zone pedestal
      let downloaded = gameState.downloadedResume;
      if (detectedZone === 'resume' && !gameState.downloadedResume) {
        downloaded = true;
        // Trigger download
        const link = document.createElement('a');
        link.href = '/resume.txt';
        link.download = 'resume_software_engineer.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Confetti!
        import('canvas-confetti').then((confetti) => {
          confetti.default({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        });
      }

      // Track drift accumulation score (purely for gaming feel)
      let currentDriftMeter = 0;
      if (isDrifting) {
        p.driftScore = Math.min(100, p.driftScore + dt * 45);
        currentDriftMeter = p.driftScore;
      } else {
        p.driftScore = Math.max(0, p.driftScore - dt * 60);
        currentDriftMeter = p.driftScore;
      }

      // Export current speed to ref for audio
      speedRef.current = p.speed;

      // Update Game State
      setGameState((prev) => {
        // If interact key (Enter) was pressed, check if we can trigger modal
        let newActiveProject = prev.activeProject;
        let newShowContact = prev.showContact;
        let visited = [...prev.visitedProjects];

        if (inputs.interact) {
          if (activeProjZone) {
            const project = projects.find((proj) => proj.id === activeProjZone);
            if (project) {
              newActiveProject = project;
              if (!visited.includes(activeProjZone)) {
                visited.push(activeProjZone);
              }
            }
          } else if (detectedZone === 'contact') {
            newShowContact = true;
          }
        }

        // Avoid triggering React state update if nothing has changed
        if (
          prev.currentZone === detectedZone &&
          prev.activeProjectZoneId === activeProjZone &&
          prev.downloadedResume === downloaded &&
          prev.activeProject === newActiveProject &&
          prev.showContact === newShowContact &&
          prev.speed === Math.round(Math.abs(p.speed) * 3) &&
          Math.abs(prev.drift - currentDriftMeter) < 5
        ) {
          return prev;
        }

        return {
          ...prev,
          currentZone: detectedZone,
          activeProjectZoneId: activeProjZone,
          downloadedResume: downloaded,
          activeProject: newActiveProject,
          showContact: newShowContact,
          visitedProjects: visited,
          speed: Math.round(Math.abs(p.speed) * 3), // Speed visual scaling
          drift: Math.round(currentDriftMeter),
        };
      });
    }
  });

  return (
    <>
      <group ref={carRef} position={[0, 0, 8]} scale={[0.75, 0.75, 0.75]}>
        {/* 3D Car Model */}
        <group position={[0, 0.45, 0]}>
          
          {/* Chassis / Body */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.5, 0.5, 3.0]} />
            <meshStandardMaterial color="#ffffff" roughness={0.15} metalness={0.4} />
          </mesh>
          
          {/* Wedge Cabin (Sleek sci-fi cockpit) */}
          <mesh position={[0, 0.45, -0.2]} castShadow>
            <boxGeometry args={[1.1, 0.4, 1.4]} />
            <meshStandardMaterial 
              color="#a855f7" 
              emissive="#7c3aed" 
              emissiveIntensity={0.6} 
              roughness={0.0} 
              transparent 
              opacity={0.65} 
            />
          </mesh>
 
          {/* Cyber Neon Spoiler */}
          <group position={[0, 0.5, -1.3]}>
            <mesh castShadow>
              <boxGeometry args={[1.6, 0.1, 0.4]} />
              <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={0.8} />
            </mesh>
            {/* Spoiler supports */}
            <mesh position={[-0.6, -0.2, 0]}>
              <boxGeometry args={[0.1, 0.3, 0.1]} />
              <meshStandardMaterial color="#e5e7eb" />
            </mesh>
            <mesh position={[0.6, -0.2, 0]}>
              <boxGeometry args={[0.1, 0.3, 0.1]} />
              <meshStandardMaterial color="#e5e7eb" />
            </mesh>
          </group>
 
          {/* Front Grill / Hood details */}
          <mesh position={[0, 0.1, 1.45]}>
            <boxGeometry args={[1.2, 0.15, 0.1]} />
            <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={0.8} />
          </mesh>
 
          {/* Headlights */}
          <group position={[0, 0.1, 1.5]}>
            <spotLight
               position={[-0.5, 0, 0]}
               angle={0.45}
               penumbra={0.5}
               intensity={30}
               distance={20}
               color="#ffffff"
               castShadow
             />
             <spotLight
               position={[0.5, 0, 0]}
               angle={0.45}
               penumbra={0.5}
               intensity={30}
               distance={20}
               color="#ffffff"
               castShadow
             />
          </group>
 
          {/* Glowing Exhaust / Cyber Tail Light */}
          <mesh position={[0, 0.05, -1.51]}>
            <boxGeometry args={[1.2, 0.08, 0.05]} />
            <meshStandardMaterial 
              color={inputs.backward || inputs.handbrake ? "#ef4444" : "#7c3aed"} 
              emissive={inputs.backward || inputs.handbrake ? "#ef4444" : "#7c3aed"} 
              emissiveIntensity={inputs.backward || inputs.handbrake ? 3.0 : 1.5} 
              toneMapped={false}
            />
          </mesh>
 
          {/* Tail lights flare (Brighter when braking) */}
          {inputs.handbrake || inputs.backward ? (
            <>
              <pointLight position={[-0.6, 0.5, -1.8]} color="#ef4444" intensity={2} distance={5} />
              <pointLight position={[0.6, 0.5, -1.8]} color="#ef4444" intensity={2} distance={5} />
            </>
          ) : null}
 
          {/* Wheels */}
          {/* Front Left */}
          <mesh ref={frontLeftWheelRef} position={[-0.9, -0.2, 1.0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.4, 0.4, 0.35, 12]} />
            <meshStandardMaterial color="#1f2937" roughness={0.8} />
          </mesh>
          {/* Front Right */}
          <mesh ref={frontRightWheelRef} position={[0.9, -0.2, 1.0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.4, 0.4, 0.35, 12]} />
            <meshStandardMaterial color="#1f2937" roughness={0.8} />
          </mesh>
          {/* Rear Left */}
          <mesh ref={rearLeftWheelRef} position={[-0.9, -0.2, -1.0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.45, 0.45, 0.4, 12]} />
            <meshStandardMaterial color="#1f2937" roughness={0.8} />
          </mesh>
          {/* Rear Right */}
          <mesh ref={rearRightWheelRef} position={[0.9, -0.2, -1.0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.45, 0.45, 0.4, 12]} />
            <meshStandardMaterial color="#1f2937" roughness={0.8} />
          </mesh>
 
        </group>
      </group>

      {/* Tire Smoke Effect */}
      <TireSmoke isDrifting={isDrifting} carPos={{ x: physics.current.posX, z: physics.current.posZ }} carAngle={physics.current.angle} />
    </>
  );
};
