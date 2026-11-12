import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, DirectionalLight, AmbientLight, Fog, HemisphereLight } from 'three';
import { useStore } from '../../store/useStore';

export const DayNightCycle: React.FC = () => {
  const moonLightRef = useRef<DirectionalLight>(null);
  const ambientLightRef = useRef<AmbientLight>(null);
  const hemiLightRef = useRef<HemisphereLight>(null);
  const rimLightRef = useRef<DirectionalLight>(null);

  const timeOfDay = useStore((s) => s.timeOfDay);

  // ── Palette Configuration: Hot Wheels Arena Skyscraper Lighting ──
  const nightSky     = new Color('#080c18');
  const nightFog     = new Color('#080c18');
  const nightAmbient = new Color('#1e1b4b');
  const moonColor    = new Color('#fef08a');
  const rimColor     = new Color('#ff4800');

  // Daytime fallback palette if timeOfDay is toggled to day (0.5)
  const daySky       = new Color('#1e293b');
  const dayFog       = new Color('#0f172a');
  const dayAmbient   = new Color('#334155');
  const sunColor     = new Color('#f8fafc');

  useFrame(({ scene }) => {
    // Determine blend factor between night (0 or 1) and daytime (0.5)
    // By default timeOfDay is night (0 or 1)
    const isDay = timeOfDay > 0.25 && timeOfDay < 0.75;
    const targetFog = isDay ? dayFog : nightFog;
    const targetSky = isDay ? daySky : nightSky;
    const targetAmbient = isDay ? dayAmbient : nightAmbient;
    const targetDir = isDay ? sunColor : moonColor;

    if (scene.fog instanceof Fog) {
      scene.fog.color.lerp(targetFog, 0.05);
      scene.fog.near = 35;
      scene.fog.far = 125;
    }
    if (scene.background instanceof Color) {
      scene.background.lerp(targetSky, 0.05);
    } else {
      scene.background = targetSky.clone();
    }

    if (ambientLightRef.current) {
      ambientLightRef.current.color.lerp(targetAmbient, 0.05);
      ambientLightRef.current.intensity = isDay ? 1.0 : 0.95;
    }

    if (moonLightRef.current) {
      moonLightRef.current.color.lerp(targetDir, 0.05);
      moonLightRef.current.intensity = isDay ? 2.5 : 2.2;
    }

    if (rimLightRef.current) {
      rimLightRef.current.color.lerp(rimColor, 0.05);
    }
  });

  return (
    <group>
      {/* Deep atmospheric ambient light */}
      <ambientLight ref={ambientLightRef} color="#221745" intensity={0.95} />

      {/* Cyberpunk hemisphere light (cyan sky glow, deep purple ground bounce) */}
      <hemisphereLight
        ref={hemiLightRef}
        args={['#38bdf8', '#1e1b4b', 0.65]}
      />

      {/* Primary directional celestial moonlight */}
      <directionalLight
        ref={moonLightRef}
        position={[22, 36, 18]}
        color="#a5b4fc"
        intensity={2.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={1}
        shadow-camera-far={120}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-bias={-0.0004}
      />

      {/* Fiery Hot Wheels flame rim light from side angle */}
      <directionalLight
        ref={rimLightRef}
        position={[-24, 18, -24]}
        color="#ff4800"
        intensity={1.6}
      />
    </group>
  );
};
