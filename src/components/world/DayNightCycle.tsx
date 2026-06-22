import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, DirectionalLight, AmbientLight, Fog } from 'three';

export const DayNightCycle: React.FC = () => {
  const sunLightRef = useRef<DirectionalLight>(null);
  const ambientLightRef = useRef<AmbientLight>(null);
  
  // Clean daytime palette
  const dayAmbient = new Color('#fafafa');
  const daySun = new Color('#ffffff');
  const dayFog = new Color('#f3f4f6'); // Light gray fog for bright, clean atmosphere

  useFrame(({ scene }) => {
    // Enforce bright daylight
    if (sunLightRef.current) {
      sunLightRef.current.position.set(15, 25, 15);
      sunLightRef.current.color.copy(daySun);
      sunLightRef.current.intensity = 1.0;
    }

    if (ambientLightRef.current) {
      ambientLightRef.current.color.copy(dayAmbient);
      ambientLightRef.current.intensity = 0.85;
    }

    if (scene.fog instanceof Fog) {
      scene.fog.color.copy(dayFog);
    }
    
    scene.background = scene.fog?.color || dayFog;
  });

  return (
    <group>
      <ambientLight ref={ambientLightRef} intensity={0.8} />
      
      <directionalLight
        ref={sunLightRef}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={100}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
      />
    </group>
  );
};
