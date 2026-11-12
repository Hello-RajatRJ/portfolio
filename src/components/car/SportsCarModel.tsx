import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, MeshStandardMaterial, MeshBasicMaterial } from 'three';
import { Text } from '@react-three/drei';
import type { CarPhysicsState, CarVisualState } from '../CarState';
import { NitroExhaustFlame } from './CarFX';

interface SportsCarModelProps {
  physicsRef: React.MutableRefObject<CarPhysicsState>;
  visualRef: React.MutableRefObject<CarVisualState>;
}

export const SportsCarModel: React.FC<SportsCarModelProps> = ({
  physicsRef,
  visualRef,
}) => {
  const wheeliePivotRef = useRef<Group>(null);
  const chassisRef = useRef<Group>(null);
  const frontLeftWheel = useRef<Group>(null);
  const frontRightWheel = useRef<Group>(null);
  const rearLeftWheel = useRef<Group>(null);
  const rearRightWheel = useRef<Group>(null);
  const brakeLightMatRef = useRef<MeshBasicMaterial>(null);

  // High-Gloss Automotive Red Paint (Image 1 reference)
  const redPaintMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#dc2626',
        metalness: 0.85,
        roughness: 0.14,
        envMapIntensity: 2.5,
      }),
    []
  );

  const blackStripeMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#09090b',
        roughness: 0.3,
        metalness: 0.5,
      }),
    []
  );

  const carbonMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#18181b',
        roughness: 0.6,
        metalness: 0.4,
      }),
    []
  );

  const glassMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#020617',
        roughness: 0.1,
        metalness: 0.9,
        transparent: true,
        opacity: 0.85,
      }),
    []
  );

  const chromeMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#f8fafc',
        metalness: 0.98,
        roughness: 0.08,
      }),
    []
  );

  const tireMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#18181b',
        roughness: 0.7,
      }),
    []
  );

  useFrame((_state, delta) => {
    const dt = Math.min(delta, 0.08);
    const p = physicsRef.current;
    const v = visualRef.current;

    // 1. Wheelie Pop (Pivots the entire car around the rear axle)
    if (wheeliePivotRef.current) {
      wheeliePivotRef.current.rotation.x = -v.wheelieAngle;
    }

    // 2. Suspension pitch & roll
    if (chassisRef.current) {
      chassisRef.current.rotation.z = -v.bodyRoll;
      chassisRef.current.rotation.x = v.bodyPitch;
    }

    // 3. Wheel spinning
    v.wheelRot += (p.speed / 0.35) * dt;

    if (frontLeftWheel.current && frontRightWheel.current) {
      // Front wheel steer yaw directly matches car turn direction
      frontLeftWheel.current.rotation.y = p.steeringAngle;
      frontRightWheel.current.rotation.y = p.steeringAngle;

      // Wheel spin
      if (frontLeftWheel.current.children && frontLeftWheel.current.children[0]) {
        frontLeftWheel.current.children[0].rotation.x = v.wheelRot;
      }
      if (frontRightWheel.current.children && frontRightWheel.current.children[0]) {
        frontRightWheel.current.children[0].rotation.x = v.wheelRot;
      }
    }

    if (rearLeftWheel.current && rearRightWheel.current) {
      if (rearLeftWheel.current.children && rearLeftWheel.current.children[0]) {
        rearLeftWheel.current.children[0].rotation.x = v.wheelRot;
      }
      if (rearRightWheel.current.children && rearRightWheel.current.children[0]) {
        rearRightWheel.current.children[0].rotation.x = v.wheelRot;
      }
    }

    // 4. Brake light intensity
    if (brakeLightMatRef.current) {
      brakeLightMatRef.current.color.set(v.isBraking ? '#ff003c' : '#7f1d1d');
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* ── WHEELIE PIVOT GROUP (Pivot centered on Rear Axle at y = 0.28, z = -0.95) ── */}
      <group ref={wheeliePivotRef} position={[0, 0.28, -0.95]}>
        {/* Dynamic Chassis Group (reacts to suspension, pitch, roll) */}
        <group ref={chassisRef} position={[0, 0.07, 0.95]}>
          {/* ── LOWER MAIN BODY HULL ── */}
          <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.45, 0.42, 3.1]} />
            <primitive object={redPaintMat} attach="material" />
          </mesh>

          {/* ── DUAL BLACK MATTE RACING STRIPES (down center) ── */}
          {[-0.12, 0.12].map((sx) => (
            <mesh key={`stripe-${sx}`} position={[sx, 0.28, 0]}>
              <boxGeometry args={[0.16, 0.02, 3.12]} />
              <primitive object={blackStripeMat} attach="material" />
            </mesh>
          ))}

          {/* ── FRONT HOOD SCULPT & POWER BULGE ── */}
          <mesh position={[0, 0.18, 0.85]} rotation={[-0.06, 0, 0]} castShadow>
            <boxGeometry args={[1.38, 0.24, 1.3]} />
            <primitive object={redPaintMat} attach="material" />
          </mesh>

          {/* Hood Vents */}
          {[-0.32, 0.32].map((vx) => (
            <mesh key={`vent-${vx}`} position={[vx, 0.31, 0.8]} rotation={[-0.06, 0, 0]}>
              <boxGeometry args={[0.18, 0.02, 0.4]} />
              <primitive object={carbonMat} attach="material" />
            </mesh>
          ))}

          {/* ── CABIN GREENHOUSE & FASTBACK ROOF ── */}
          <mesh position={[0, 0.46, -0.22]} castShadow>
            <boxGeometry args={[1.18, 0.45, 1.45]} />
            <primitive object={glassMat} attach="material" />
          </mesh>
          {/* Roof Panel */}
          <mesh position={[0, 0.69, -0.22]} castShadow>
            <boxGeometry args={[1.15, 0.04, 1.1]} />
            <primitive object={redPaintMat} attach="material" />
          </mesh>
          {/* Roof racing stripes */}
          {[-0.12, 0.12].map((sx) => (
            <mesh key={`roof-stripe-${sx}`} position={[sx, 0.715, -0.22]}>
              <boxGeometry args={[0.16, 0.02, 1.11]} />
              <primitive object={blackStripeMat} attach="material" />
            </mesh>
          ))}

          {/* ── AGGRESSIVE FRONT BUMPER & LOWER CARBON SPLITTER ── */}
          <mesh position={[0, -0.06, 1.58]} castShadow>
            <boxGeometry args={[1.42, 0.28, 0.22]} />
            <primitive object={redPaintMat} attach="material" />
          </mesh>
          {/* Honeycomb Black Grille */}
          <mesh position={[0, 0.02, 1.68]}>
            <boxGeometry args={[1.05, 0.2, 0.04]} />
            <primitive object={carbonMat} attach="material" />
          </mesh>
          {/* Front Splitter Wing */}
          <mesh position={[0, -0.16, 1.65]}>
            <boxGeometry args={[1.48, 0.04, 0.28]} />
            <primitive object={carbonMat} attach="material" />
          </mesh>

          {/* Dual LED Projector Headlights */}
          {[-0.52, 0.52].map((hx) => (
            <group key={`headlight-${hx}`} position={[hx, 0.08, 1.64]}>
              <mesh>
                <boxGeometry args={[0.26, 0.1, 0.04]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
              <pointLight color="#ffffff" intensity={1.5} distance={10} />
            </group>
          ))}

          {/* ── REAR FASCIA & MUSTANG GT TAILLIGHTS (Image 1 reference) ── */}
          <mesh position={[0, 0.04, -1.56]} castShadow>
            <boxGeometry args={[1.44, 0.36, 0.18]} />
            <primitive object={redPaintMat} attach="material" />
          </mesh>

          {/* Black Gloss Trunk Panel */}
          <mesh position={[0, 0.12, -1.64]}>
            <boxGeometry args={[1.36, 0.24, 0.03]} />
            <primitive object={blackStripeMat} attach="material" />
          </mesh>

          {/* Chrome "GT" Center Emblem */}
          <Text
            position={[0, 0.12, -1.67]}
            rotation={[0, Math.PI, 0]}
            fontSize={0.16}
            color="#f8fafc"
            anchorX="center"
            anchorY="middle"
          >
            GT
          </Text>

          {/* Tri-Bar Iconic LED Taillights (Left & Right) */}
          {[-0.56, -0.48, -0.4, 0.4, 0.48, 0.56].map((tx) => (
            <mesh key={`tail-bar-${tx}`} position={[tx, 0.12, -1.66]}>
              <boxGeometry args={[0.04, 0.18, 0.02]} />
              <meshBasicMaterial ref={brakeLightMatRef} color="#ff003c" />
            </mesh>
          ))}

          {/* Rear Decklid Spoiler */}
          <mesh position={[0, 0.35, -1.48]} castShadow>
            <boxGeometry args={[1.38, 0.06, 0.22]} />
            <primitive object={carbonMat} attach="material" />
          </mesh>

          {/* Quad Chrome Exhaust Tips */}
          {[-0.45, -0.32, 0.32, 0.45].map((ex) => (
            <mesh key={`exhaust-${ex}`} position={[ex, -0.12, -1.64]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.045, 0.045, 0.18, 12]} />
              <primitive object={chromeMat} attach="material" />
            </mesh>
          ))}

          {/* Rear Carbon Diffuser */}
          <mesh position={[0, -0.16, -1.54]}>
            <boxGeometry args={[1.2, 0.12, 0.24]} />
            <primitive object={carbonMat} attach="material" />
          </mesh>

          {/* Neon Red Underglow */}
          <pointLight position={[0, -0.2, 0]} color="#ef4444" intensity={2.2} distance={4.5} />

          {/* Nitro Boost Quad Exhaust Flames */}
          <NitroExhaustFlame visualRef={visualRef} />
        </group>

        {/* ── 4 WHEELS WITH STEERING & ROTATION ── */}
        {/* Front Left (1.90m ahead of rear axle) */}
        <group ref={frontLeftWheel} position={[-0.74, 0, 1.90]}>
          <group>
            {/* Tire */}
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.28, 0.28, 0.24, 24]} />
              <primitive object={tireMat} attach="material" />
            </mesh>
            {/* Chrome Rim */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.18, 0.18, 0.25, 16]} />
              <primitive object={chromeMat} attach="material" />
            </mesh>
          </group>
        </group>

        {/* Front Right (1.90m ahead of rear axle) */}
        <group ref={frontRightWheel} position={[0.74, 0, 1.90]}>
          <group>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.28, 0.28, 0.24, 24]} />
              <primitive object={tireMat} attach="material" />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.18, 0.18, 0.25, 16]} />
              <primitive object={chromeMat} attach="material" />
            </mesh>
          </group>
        </group>

        {/* Rear Left (at rear axle pivot center) */}
        <group ref={rearLeftWheel} position={[-0.74, 0, 0]}>
          <group>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.29, 0.29, 0.26, 24]} />
              <primitive object={tireMat} attach="material" />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.19, 0.19, 0.27, 16]} />
              <primitive object={chromeMat} attach="material" />
            </mesh>
          </group>
        </group>

        {/* Rear Right (at rear axle pivot center) */}
        <group ref={rearRightWheel} position={[0.74, 0, 0]}>
          <group>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.29, 0.29, 0.26, 24]} />
              <primitive object={tireMat} attach="material" />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.19, 0.19, 0.27, 16]} />
              <primitive object={chromeMat} attach="material" />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
};
