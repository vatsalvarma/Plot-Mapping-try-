import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sky, Stars } from '@react-three/drei';
import * as THREE from 'three';

export const DynamicEnvironment = ({ setSunRef }: { setSunRef?: (mesh: THREE.Mesh | null) => void }) => {
  const { scene } = useThree();
  const sunMesh = useRef<THREE.Mesh>(null);
  const dirLight = useRef<THREE.DirectionalLight>(null);
  const ambientLight = useRef<THREE.AmbientLight>(null);
  
  React.useEffect(() => {
    if (setSunRef && sunMesh.current) {
      setSunRef(sunMesh.current);
    }
  }, [setSunRef]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * 0.1; // Speed of day/night cycle
    
    // Calculate sun position (orbiting around the scene)
    const sunX = Math.cos(t) * 200;
    const sunY = Math.sin(t) * 150;
    const sunZ = Math.sin(t) * 100;
    
    if (sunMesh.current) sunMesh.current.position.set(sunX, sunY, sunZ);
    if (dirLight.current) dirLight.current.position.set(sunX, sunY, sunZ);

    // Day / Night interpolation
    const isDay = sunY > 0;
    const intensity = Math.max(0, Math.min(1, sunY / 50));
    
    if (dirLight.current) dirLight.current.intensity = intensity * 5;
    if (ambientLight.current) {
       ambientLight.current.intensity = isDay ? 0.3 + intensity * 0.2 : 0.05;
       ambientLight.current.color.setHex(isDay ? 0x404040 : 0x0a101a);
    }

    // Toggle emissive lights on buildings (streetlights, windows) globally
    scene.traverse((child: any) => {
      if (child.isMesh && child.material && child.material.name === 'emissiveLight') {
         if (isDay && intensity > 0.2) {
             child.material.emissiveIntensity = 0;
         } else {
             child.material.emissiveIntensity = 2.0;
         }
      }
    });
  });

  return (
    <>
      <ambientLight ref={ambientLight} intensity={0.3} color="#404040" />
      
      {/* Moving Sun Light */}
      <directionalLight 
        ref={dirLight}
        position={[150, 20, -100]} 
        intensity={5} 
        color="#ffebd6"
        castShadow 
        shadow-mapSize={[4096, 4096]} 
        shadow-camera-left={-150}
        shadow-camera-right={150}
        shadow-camera-top={150}
        shadow-camera-bottom={-150}
        shadow-bias={-0.001}
      />
      {/* Physical Sun Mesh for God Rays */}
      <mesh ref={sunMesh} position={[150, 20, -100]}>
         <sphereGeometry args={[8, 32, 32]} />
         <meshBasicMaterial color="#ffffff" />
      </mesh>

      <directionalLight position={[-50, 50, 50]} intensity={0.2} color="#87ceeb" />

      {/* Sky and Stars */}
      <Sky distance={450000} sunPosition={sunMesh.current?.position || [150, 20, -100]} inclination={0} azimuth={0.25} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </>
  );
};

export const CinematicCamera = () => {
  const { camera } = useThree();
  const started = useRef(false);

  useFrame(({ clock }) => {
    if (!started.current) {
      // Set initial cinematic position high up and far away
      camera.position.set(0, 300, 300);
      camera.lookAt(0, 0, 0);
      started.current = true;
    }
    
    // Smoothly interpolate to default viewing angle during the first few seconds
    const t = clock.elapsedTime;
    if (t < 4.0) {
       const progress = t / 4.0;
       // Ease out cubic
       const ease = 1 - Math.pow(1 - progress, 3);
       
       camera.position.lerp(new THREE.Vector3(60, 60, 60), ease * 0.1);
    }
  });

  return null;
};

// Advanced Rain Particle System
export const RainSystem = () => {
  const rainGeo = useRef<THREE.BufferGeometry>(null);
  const rainCount = 15000;
  
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(rainCount * 3);
    const vel = new Float32Array(rainCount);
    for(let i=0;i<rainCount;i++){
      pos[i*3] = (Math.random() - 0.5) * 400; // x
      pos[i*3+1] = Math.random() * 200; // y
      pos[i*3+2] = (Math.random() - 0.5) * 400; // z
      vel[i] = 0;
    }
    return [pos, vel];
  }, []);

  useFrame(() => {
    if (rainGeo.current) {
      const positions = rainGeo.current.attributes.position.array as Float32Array;
      for(let i=0;i<rainCount;i++){
        velocities[i] -= 0.1 + Math.random() * 0.1;
        positions[i*3+1] += velocities[i];
        if (positions[i*3+1] < -20) {
          positions[i*3+1] = 200;
          velocities[i] = 0;
        }
      }
      rainGeo.current.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points>
      <bufferGeometry ref={rainGeo}>
        <bufferAttribute attach="attributes-position" count={rainCount} array={positions} itemSize={3} args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#aaaaaa" size={0.3} transparent opacity={0.6} />
    </points>
  );
};
