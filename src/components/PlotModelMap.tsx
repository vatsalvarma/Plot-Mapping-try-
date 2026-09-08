import React, { useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, Sky, Environment, SoftShadows, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { Delaunay } from 'd3-delaunay';
import { MovingClouds, FlappingBird } from './CityMap';

// Deterministic pseudo-noise for rolling hills
const getTerrainHeight = (x: number, z: number) => {
  let y = 0;
  y += Math.sin(x * 0.015 + z * 0.01) * 6.0; 
  y += Math.sin(x * 0.03 - z * 0.02) * 3.0; 
  y += Math.sin(x * 0.08 + z * 0.05) * 0.5;
  return y;
};

// Procedural Road Distance Calculation
const getDistanceToRoad = (x: number, z: number) => {
  // Main winding road
  const road1Z = Math.sin(x * 0.02) * 80 + Math.cos(x * 0.01) * 40;
  const dist1 = Math.abs(z - road1Z);
  
  // Secondary intersecting road
  const road2X = Math.sin(z * 0.03) * 60 + Math.cos(z * 0.015) * 20;
  const dist2 = Math.abs(x - road2X);
  
  return Math.min(dist1, dist2);
};

// Procedural 3D Instanced Grass (Optimized for Village)
const InstancedGrass = () => {
  const count = 20000;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  useEffect(() => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 400;
      const z = (Math.random() - 0.5) * 400;
      
      const distToRoad = getDistanceToRoad(x, z);
      if (distToRoad < 8) continue; // No grass on roads!
      
      const y = getTerrainHeight(x, z);
      
      dummy.position.set(x, y + 0.3, z);
      dummy.rotation.y = Math.random() * Math.PI;
      dummy.rotation.x = (Math.random() - 0.5) * 0.5;
      dummy.rotation.z = (Math.random() - 0.5) * 0.5;
      
      const scale = Math.random() * 0.6 + 0.4;
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      
      color.setHex(0x3f4a3c);
      color.offsetHSL(0, 0, (Math.random() - 0.5) * 0.1);
      meshRef.current.setColorAt(i, color);
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, []);

  const shaderRef = useRef<any>(null);
  useFrame((state) => {
    if (shaderRef.current) shaderRef.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow receiveShadow>
      <coneGeometry args={[0.15, 0.8, 3]} />
      <meshStandardMaterial 
        roughness={1} 
        onBeforeCompile={(shader) => {
          shader.uniforms.uTime = { value: 0 };
          shaderRef.current = shader;
          shader.vertexShader = `
            uniform float uTime;
            ${shader.vertexShader}
          `.replace(
            `#include <begin_vertex>`,
            `
            #include <begin_vertex>
            if (position.y > 0.0) { 
                float worldX = instanceMatrix[3][0];
                float worldZ = instanceMatrix[3][2];
                float windX = sin(uTime * 2.0 + worldX * 0.05 + worldZ * 0.05) * 0.15;
                float windZ = cos(uTime * 1.5 + worldZ * 0.05) * 0.15;
                transformed.x += windX;
                transformed.z += windZ;
            }
            `
          );
        }}
      />
    </instancedMesh>
  );
};

// High-Definition Window with Frame and Reflective Glass
const HouseWindow = ({ position, rotationY }: { position: [number, number, number], rotationY: number }) => (
  <group position={position} rotation={[0, rotationY, 0]}>
    {/* Glass */}
    <mesh position={[0, 0, 0.04]} castShadow>
      <boxGeometry args={[0.8, 1.2, 0.05]} />
      <meshStandardMaterial color="#1a2b3c" roughness={0.1} metalness={0.9} />
    </mesh>
    {/* White Frame */}
    <mesh position={[0, 0, 0.02]} castShadow>
      <boxGeometry args={[1.0, 1.4, 0.05]} />
      <meshStandardMaterial color="#ffffff" roughness={0.9} />
    </mesh>
  </group>
);

// High-Definition Door with Frame
const HouseDoor = ({ position, rotationY }: { position: [number, number, number], rotationY: number }) => (
  <group position={position} rotation={[0, rotationY, 0]}>
    {/* Wood Door */}
    <mesh position={[0, 0, 0.04]} castShadow>
      <boxGeometry args={[1.2, 2.0, 0.05]} />
      <meshStandardMaterial color="#4e342e" roughness={0.9} />
    </mesh>
    {/* White Frame */}
    <mesh position={[0, 0, 0.02]} castShadow>
      <boxGeometry args={[1.4, 2.2, 0.05]} />
      <meshStandardMaterial color="#ffffff" roughness={0.9} />
    </mesh>
  </group>
);

// High-Definition Stylized Medieval House
const StylizedMedievalHouse = ({ position, rotationY }: { position: [number, number, number], rotationY: number }) => {
  const width = Math.random() * 2 + 4.5; // 4.5 to 6.5
  const depth = Math.random() * 2 + 4.5; // 4.5 to 6.5
  const floor1Height = 2.2;
  const floor2Height = Math.random() * 1.0 + 1.8; // 1.8 to 2.8
  const totalHeight = floor1Height + floor2Height;
  
  const roofHeight = Math.random() * 1.5 + 2.5; // Steep roofs
  const roofColorHex = ['#b83b3b', '#a33232', '#c94c4c', '#8b2626'][Math.floor(Math.random() * 4)]; // Vibrant terracotta reds
  
  const woodColorHex = '#4a2f1d'; // Dark framing wood
  const deckColorHex = '#6e4b33'; // Lighter deck wood
  const wallColorHex = ['#f5e6d3', '#fff0db', '#e8d9c5'][Math.floor(Math.random() * 3)]; // Stucco cream
  
  const isLShaped = Math.random() > 0.3;
  const wingWidth = width * (Math.random() * 0.2 + 0.6);
  const wingDepth = depth * (Math.random() * 0.2 + 0.6);

  const hasDormer = Math.random() > 0.4;
  const hasChimney = Math.random() > 0.3;

  // Deck dimensions
  const deckPadding = 1.2;
  const deckWidth = width + deckPadding * 2;
  const deckDepth = depth + deckPadding * 2;
  const deckHeight = 0.5;

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      
      {/* --- 1. RAISED WOODEN DECK & STAIRS --- */}
      <group position={[0, deckHeight / 2, 0]}>
        {/* Main Deck Board */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[deckWidth, 0.2, deckDepth]} />
          <meshStandardMaterial color={deckColorHex} roughness={0.9} />
        </mesh>
        {/* Support Pillars (Corners) */}
        {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([dx, dz], i) => (
          <mesh key={`pillar-${i}`} position={[dx * (deckWidth/2 - 0.2), -deckHeight/2, dz * (deckDepth/2 - 0.2)]} castShadow receiveShadow>
             <cylinderGeometry args={[0.15, 0.15, deckHeight]} />
             <meshStandardMaterial color={woodColorHex} roughness={1} />
          </mesh>
        ))}
        {/* Wooden Stairs (Front) */}
        <group position={[0, -0.1, deckDepth/2 + 0.6]}>
           <mesh position={[0, 0, -0.3]} castShadow receiveShadow>
             <boxGeometry args={[1.8, 0.2, 0.4]} />
             <meshStandardMaterial color={deckColorHex} roughness={0.9} />
           </mesh>
           <mesh position={[0, -0.2, 0.1]} castShadow receiveShadow>
             <boxGeometry args={[1.8, 0.2, 0.4]} />
             <meshStandardMaterial color={deckColorHex} roughness={0.9} />
           </mesh>
        </group>
      </group>

      {/* Lift everything to sit on the deck */}
      <group position={[0, deckHeight + 0.1, 0]}>
        
        {/* --- 2. MULTI-STORY WALLS --- */}
        {/* Floor 1 (Wood Planks) */}
        <mesh position={[0, floor1Height / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[width, floor1Height, depth]} />
          <meshStandardMaterial color="#6b4c33" roughness={0.9} /> 
        </mesh>
        
        {/* Floor 2 (Stucco/Plaster) */}
        <mesh position={[0, floor1Height + floor2Height / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[width, floor2Height, depth]} />
          <meshStandardMaterial color={wallColorHex} roughness={0.9} />
        </mesh>

        {/* --- 3. TIMBER FRAMING (Beams) --- */}
        {/* Horizontal Floor Separator Beam */}
        <mesh position={[0, floor1Height, 0]} castShadow receiveShadow>
           <boxGeometry args={[width + 0.2, 0.2, depth + 0.2]} />
           <meshStandardMaterial color={woodColorHex} roughness={0.9} />
        </mesh>
        {/* Vertical Corner Beams */}
        {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([dx, dz], i) => (
          <mesh key={`beam-${i}`} position={[dx * (width/2), totalHeight/2, dz * (depth/2)]} castShadow receiveShadow>
             <boxGeometry args={[0.2, totalHeight, 0.2]} />
             <meshStandardMaterial color={woodColorHex} roughness={0.9} />
          </mesh>
        ))}

        {/* --- 4. DOORS & WINDOWS --- */}
        <HouseDoor position={[0, 1.0, depth / 2]} rotationY={0} />
        {/* First Floor Windows */}
        <HouseWindow position={[-width / 3, floor1Height / 2, depth / 2]} rotationY={0} />
        <HouseWindow position={[width / 3, floor1Height / 2, depth / 2]} rotationY={0} />
        {/* Second Floor Windows */}
        <HouseWindow position={[-width / 3, floor1Height + floor2Height / 2, depth / 2]} rotationY={0} />
        <HouseWindow position={[width / 3, floor1Height + floor2Height / 2, depth / 2]} rotationY={0} />

        {/* --- 5. STEEP PITCHED ROOF --- */}
        <group position={[0, totalHeight, 0]}>
          {/* Main Roof Mesh */}
          <mesh position={[0, roofHeight / 2, 0]} rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
            <coneGeometry args={[Math.max(width, depth) / 1.1, roofHeight, 4, 1]} />
            <meshStandardMaterial color={roofColorHex} roughness={0.9} />
          </mesh>
          {/* Wooden Fascia (Roof Trim) */}
          <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
             <boxGeometry args={[width + 1.0, 0.2, depth + 1.0]} />
             <meshStandardMaterial color={woodColorHex} roughness={0.9} />
          </mesh>

          {/* Dormer Window */}
          {hasDormer && (
             <group position={[0, roofHeight / 3, depth / 2 - 0.2]}>
               <mesh position={[0, 0.5, 0.5]} castShadow receiveShadow>
                 <boxGeometry args={[1.5, 1.2, 1.0]} />
                 <meshStandardMaterial color={wallColorHex} roughness={0.9} />
               </mesh>
               <mesh position={[0, 1.4, 0.5]} rotation={[0, Math.PI/4, 0]} castShadow receiveShadow>
                 <coneGeometry args={[1.2, 1.0, 4, 1]} />
                 <meshStandardMaterial color={roofColorHex} roughness={0.9} />
               </mesh>
               <HouseWindow position={[0, 0.5, 1.0]} rotationY={0} />
             </group>
          )}

          {/* Stylized Tapered Chimney */}
          {hasChimney && (
             <group position={[-width/3, roofHeight * 0.6, -depth/4]}>
                <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
                   <cylinderGeometry args={[0.2, 0.4, 2.0, 4]} />
                   <meshStandardMaterial color="#7a7a7a" roughness={0.9} />
                </mesh>
                <mesh position={[0, 2.1, 0]} castShadow receiveShadow>
                   <coneGeometry args={[0.5, 0.5, 4]} />
                   <meshStandardMaterial color="#4a4a4a" roughness={0.9} />
                </mesh>
             </group>
          )}
        </group>

        {/* --- 6. L-SHAPED INTERSECTING WING --- */}
        {isLShaped && (
           <group position={[width/2, 0, depth/4]}>
              <mesh position={[0, floor1Height / 2, 0]} castShadow receiveShadow>
                <boxGeometry args={[wingWidth, floor1Height, wingDepth]} />
                <meshStandardMaterial color="#6b4c33" roughness={0.9} /> 
              </mesh>
              <mesh position={[0, floor1Height + floor2Height / 2, 0]} castShadow receiveShadow>
                <boxGeometry args={[wingWidth, floor2Height, wingDepth]} />
                <meshStandardMaterial color={wallColorHex} roughness={0.9} />
              </mesh>
              <mesh position={[0, floor1Height, 0]} castShadow receiveShadow>
                 <boxGeometry args={[wingWidth + 0.2, 0.2, wingDepth + 0.2]} />
                 <meshStandardMaterial color={woodColorHex} roughness={0.9} />
              </mesh>
              <group position={[0, totalHeight, 0]}>
                <mesh position={[0, (roofHeight*0.8) / 2, 0]} rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
                  <coneGeometry args={[Math.max(wingWidth, wingDepth) / 1.1, roofHeight*0.8, 4, 1]} />
                  <meshStandardMaterial color={roofColorHex} roughness={0.9} />
                </mesh>
                <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
                   <boxGeometry args={[wingWidth + 0.8, 0.2, wingDepth + 0.8]} />
                   <meshStandardMaterial color={woodColorHex} roughness={0.9} />
                </mesh>
              </group>
              <HouseWindow position={[wingWidth/2, floor1Height + floor2Height/2, 0]} rotationY={Math.PI/2} />
           </group>
        )}
      </group>
    </group>
  );
};

// High-Definition Ultra-Modern Luxury Villa
const ModernLuxuryVilla = ({ position, rotationY }: { position: [number, number, number], rotationY: number }) => {
  const width = Math.random() * 2 + 5.0; // 5.0 to 7.0
  const depth = Math.random() * 2 + 5.0; // 5.0 to 7.0
  const floor1Height = 2.4;
  const floor2Height = 2.4;
  
  const roofColorHex = '#1a1a1a'; // Dark grey / black flat roof
  const wallColorHex = '#f0f0f0'; // Pure modern white
  const glassColorHex = '#0a1526'; // Dark tinted glass
  const foundationColorHex = '#404040'; // Dark slate foundation

  // Second floor overhangs to create a balcony and carport
  const f2Width = width * 1.1;
  const f2Depth = depth * 0.7;
  const f2OffsetZ = -depth * 0.15;

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* 1. Foundation / Patio Base */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[width + 2, 0.2, depth + 2]} />
        <meshStandardMaterial color={foundationColorHex} roughness={0.7} metalness={0.2} />
      </mesh>

      {/* 2. First Floor (Concrete) */}
      <mesh position={[0, floor1Height / 2 + 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, floor1Height, depth]} />
        <meshStandardMaterial color={wallColorHex} roughness={0.8} />
      </mesh>

      {/* Floor 1 Massive Glass Panels (Front) */}
      <mesh position={[0, floor1Height / 2 + 0.2, depth / 2 + 0.05]} castShadow>
        <boxGeometry args={[width * 0.8, floor1Height * 0.8, 0.05]} />
        <meshStandardMaterial color={glassColorHex} roughness={0.05} metalness={0.9} />
      </mesh>

      {/* Floor 1 Glass Panels (Side) */}
      <mesh position={[width / 2 + 0.05, floor1Height / 2 + 0.2, 0]} castShadow>
        <boxGeometry args={[0.05, floor1Height * 0.8, depth * 0.6]} />
        <meshStandardMaterial color={glassColorHex} roughness={0.05} metalness={0.9} />
      </mesh>

      {/* 3. Second Floor (Overhang / Cantilever) */}
      <group position={[0, floor1Height + 0.2, f2OffsetZ]}>
        <mesh position={[0, floor2Height / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[f2Width, floor2Height, f2Depth]} />
          <meshStandardMaterial color={wallColorHex} roughness={0.8} />
        </mesh>
        
        {/* Floor 2 Glass Panels */}
        <mesh position={[0, floor2Height / 2, f2Depth / 2 + 0.05]} castShadow>
          <boxGeometry args={[f2Width * 0.85, floor2Height * 0.8, 0.05]} />
          <meshStandardMaterial color={glassColorHex} roughness={0.05} metalness={0.9} />
        </mesh>

        {/* Flat Roof with Dark Trim */}
        <mesh position={[0, floor2Height + 0.1, 0]} castShadow receiveShadow>
          <boxGeometry args={[f2Width + 0.6, 0.2, f2Depth + 0.6]} />
          <meshStandardMaterial color={roofColorHex} roughness={0.9} />
        </mesh>
      </group>

      {/* 4. Support Pillars for Overhang */}
      <mesh position={[-f2Width / 2 + 0.2, floor1Height / 2 + 0.2, f2OffsetZ + f2Depth / 2 - 0.2]} castShadow receiveShadow>
        <boxGeometry args={[0.4, floor1Height, 0.4]} />
        <meshStandardMaterial color={wallColorHex} roughness={0.8} />
      </mesh>
      <mesh position={[f2Width / 2 - 0.2, floor1Height / 2 + 0.2, f2OffsetZ + f2Depth / 2 - 0.2]} castShadow receiveShadow>
        <boxGeometry args={[0.4, floor1Height, 0.4]} />
        <meshStandardMaterial color={wallColorHex} roughness={0.8} />
      </mesh>

      {/* 5. Glass Balcony Railings */}
      <mesh position={[0, floor1Height + 0.7, depth / 2 + 0.9]} castShadow>
        <boxGeometry args={[width + 1.8, 1.0, 0.05]} />
        <meshStandardMaterial color="#88ccff" transparent opacity={0.4} roughness={0.1} metalness={0.8} />
      </mesh>
      <mesh position={[width / 2 + 0.9, floor1Height + 0.7, depth / 2 + 0.9 - (depth + 1) / 2]} castShadow>
        <boxGeometry args={[0.05, 1.0, depth + 1]} />
        <meshStandardMaterial color="#88ccff" transparent opacity={0.4} roughness={0.1} metalness={0.8} />
      </mesh>
      <mesh position={[-width / 2 - 0.9, floor1Height + 0.7, depth / 2 + 0.9 - (depth + 1) / 2]} castShadow>
        <boxGeometry args={[0.05, 1.0, depth + 1]} />
        <meshStandardMaterial color="#88ccff" transparent opacity={0.4} roughness={0.1} metalness={0.8} />
      </mesh>

      {/* 6. Bamboo Planter Detail (Greenery) */}
      <group position={[width/2 + 0.5, 0.2, depth/2 + 0.5]}>
         <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
           <boxGeometry args={[1.0, 0.4, 0.4]} />
           <meshStandardMaterial color="#2a2a2a" roughness={0.9} />
         </mesh>
         {[...Array(5)].map((_, i) => (
           <mesh key={`bamboo-${i}`} position={[-0.4 + i*0.2, 0.8, 0]} castShadow>
             <cylinderGeometry args={[0.02, 0.02, 1.2]} />
             <meshStandardMaterial color="#556b2f" roughness={0.8} />
           </mesh>
         ))}
      </group>
    </group>
  );
};

// Animated Smoke Particles
const SmokeParticles = ({ position }: { position: [number, number, number] }) => {
  const groupRef = useRef<any>(null);
  const numParticles = 15;
  const particles = useMemo(() => {
    return Array.from({ length: numParticles }).map(() => ({
      x: (Math.random() - 0.5) * 1.5,
      y: Math.random() * 8,
      z: (Math.random() - 0.5) * 1.5,
      speed: Math.random() * 0.03 + 0.02,
      baseScale: Math.random() * 0.5 + 0.5
    }));
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child: any, i: number) => {
        const p = particles[i];
        child.position.y += p.speed;
        
        // Scale grows as smoke rises
        const currentScale = p.baseScale * (1 + child.position.y * 0.15);
        child.scale.set(currentScale, currentScale, currentScale);
        
        // Opacity fades as smoke rises (handled roughly by resetting)
        if (child.position.y > 8) {
          child.position.y = 0;
          child.position.x = p.x;
          child.position.z = p.z;
        }
      });
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {particles.map((p, i) => (
        <mesh key={`smoke-${i}`} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[0.8, 16, 16]} />
          <meshStandardMaterial color="#aaaaaa" transparent opacity={0.25} roughness={1} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
};

// Massive Industrial Factory
const ProceduralFactory = ({ position, rotationY }: { position: [number, number, number], rotationY: number }) => {
  // Factories are HUGE (10 to 16 width, 12 to 20 depth)
  const width = Math.random() * 6 + 10;
  const depth = Math.random() * 8 + 12;
  const height = Math.random() * 2 + 4.5;
  
  const roofColorHex = '#d0d4d8'; // Light grey metal roof
  const wallColorHex = '#f8f9fa'; // Pure white/light grey walls
  const trimColorHex = '#1e5f99'; // Industrial blue trim
  const concreteColorHex = '#a0a5aa'; // Factory floor/compound

  const trimHeight = 0.6;
  
  // Storage Silos
  const numSilos = Math.floor(Math.random() * 3) + 2; // 2 to 4 silos
  const siloRadius = Math.random() * 0.5 + 0.8;
  const siloHeight = height * 1.5;
  
  // HVACs
  const numHVACs = Math.floor(Math.random() * 4) + 3;

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* 1. Massive Concrete Compound (Base) */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[width + 12, 0.2, depth + 12]} />
        <meshStandardMaterial color={concreteColorHex} roughness={0.9} />
      </mesh>
      
      {/* Compound Perimeter Fence */}
      <mesh position={[0, 1.0, 0]} castShadow>
         <boxGeometry args={[width + 11.5, 2.0, depth + 11.5]} />
         <meshStandardMaterial color="#555555" wireframe opacity={0.3} transparent />
      </mesh>

      {/* 2. Main Warehouse Walls (White) */}
      <mesh position={[0, height / 2 + 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={wallColorHex} roughness={0.8} />
      </mesh>

      {/* Loading Dock Doors (Front) */}
      <group position={[0, 1.5, depth / 2 + 0.05]}>
         {[...Array(3)].map((_, i) => (
            <mesh key={`dock-${i}`} position={[-3 + i * 3, 0, 0]} castShadow>
               <boxGeometry args={[2, 2.5, 0.1]} />
               {/* Roller door corrugated look */}
               <meshStandardMaterial color="#888888" roughness={0.6} metalness={0.5} />
            </mesh>
         ))}
      </group>

      {/* 3. Blue Industrial Trim (Top of walls) */}
      <mesh position={[0, height + 0.2 - trimHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width + 0.2, trimHeight, depth + 0.2]} />
        <meshStandardMaterial color={trimColorHex} roughness={0.7} />
      </mesh>

      {/* Vertical Blue Accent Pillars */}
      {[...Array(4)].map((_, i) => (
         <mesh key={`pillar-front-${i}`} position={[-width/2 + 1 + i * (width/3 - 0.6), height/2 + 0.2, depth/2 + 0.1]} castShadow>
            <boxGeometry args={[0.4, height, 0.2]} />
            <meshStandardMaterial color={trimColorHex} roughness={0.7} />
         </mesh>
      ))}

      {/* 4. Factory Roof */}
      <mesh position={[0, height + 0.2 + 0.8, 0]} rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
        <coneGeometry args={[Math.max(width, depth) / 1.3, 1.6, 4, 1]} />
        <meshStandardMaterial color={roofColorHex} roughness={0.8} metalness={0.2} />
      </mesh>
      {/* Blue Roof Trim */}
      <mesh position={[0, height + 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width + 0.8, 0.3, depth + 0.8]} />
        <meshStandardMaterial color={trimColorHex} roughness={0.7} />
      </mesh>
      
      {/* Roof HVAC Units */}
      <group position={[0, height + 1.2, 0]}>
         {[...Array(numHVACs)].map((_, i) => (
            <group key={`hvac-${i}`} position={[(Math.random()-0.5)*width*0.6, 0.5, (Math.random()-0.5)*depth*0.6]}>
               <mesh castShadow receiveShadow>
                  <boxGeometry args={[1.5, 1.0, 1.5]} />
                  <meshStandardMaterial color="#cccccc" roughness={0.6} metalness={0.7} />
               </mesh>
               {/* HVAC Fan */}
               <mesh position={[0, 0.55, 0]} rotation={[Math.PI/2, 0, 0]} castShadow>
                  <cylinderGeometry args={[0.5, 0.5, 0.1, 16]} />
                  <meshStandardMaterial color="#111111" />
               </mesh>
            </group>
         ))}
      </group>

      {/* 4.5 Tall Smoke Stack with Animated Smoke */}
      <group position={[-width / 2 + 3, 0, -depth / 2 + 3]}>
        <mesh position={[0, height * 1.8, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.6, 1.2, height * 3.6, 16]} />
          <meshStandardMaterial color="#888888" roughness={0.7} metalness={0.2} />
        </mesh>
        <mesh position={[0, height * 3.6, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.8, 0.6, 0.5, 16]} />
          <meshStandardMaterial color="#333333" roughness={0.8} />
        </mesh>
        {/* Smoke Emitter at the top */}
        <SmokeParticles position={[0, height * 3.6 + 0.5, 0]} />
      </group>

      {/* 5. Clustered Storage Silos */}
      <group position={[width / 2 + 2, 0, -depth / 4]}>
        <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
           <boxGeometry args={[siloRadius * 2 * numSilos + 2, 0.3, siloRadius * 2 + 2]} />
           <meshStandardMaterial color={concreteColorHex} roughness={0.9} />
        </mesh>
        
        {[...Array(numSilos)].map((_, i) => (
          <group key={`silo-${i}`} position={[- (siloRadius * 2 * numSilos)/2 + (i * siloRadius * 2.2) + 1, 0, 0]}>
             <mesh position={[0, siloHeight / 2, 0]} castShadow receiveShadow>
               <cylinderGeometry args={[siloRadius, siloRadius, siloHeight, 16]} />
               <meshStandardMaterial color="#f0f0f0" roughness={0.5} metalness={0.3} />
             </mesh>
             <mesh position={[0, siloHeight, 0]} castShadow receiveShadow>
               <sphereGeometry args={[siloRadius, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
               <meshStandardMaterial color="#f0f0f0" roughness={0.5} metalness={0.3} />
             </mesh>
             <mesh position={[siloRadius + 0.1, siloHeight / 2, 0]} castShadow receiveShadow>
               <cylinderGeometry args={[0.1, 0.1, siloHeight, 8]} />
               <meshStandardMaterial color="#888888" roughness={0.6} metalness={0.8} />
             </mesh>
          </group>
        ))}
      </group>

      {/* 6. Strip Windows (Repeating) */}
      <group position={[0, height / 2, depth / 2 + 0.05]}>
         {[...Array(Math.floor(width / 3))].map((_, i) => (
            <mesh key={`window-${i}`} position={[-width/2 + 1.5 + i * 3, 0, 0]} castShadow>
               <boxGeometry args={[1.5, 1.0, 0.05]} />
               <meshStandardMaterial color="#1a2b3c" roughness={0.2} metalness={0.8} />
            </mesh>
         ))}
      </group>
    </group>
  );
};

// Realistic Lush Tree for 3D Drone Scan Look
const LushTree = ({ position }: { position: [number, number, number] }) => {
  const scale = Math.random() * 0.8 + 0.6;
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Trunk */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.5, 3]} />
        <meshStandardMaterial color="#3d2817" roughness={0.9} />
      </mesh>
      {/* Canopy Clusters */}
      <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
        <dodecahedronGeometry args={[2.5, 1]} />
        <meshStandardMaterial color="#2d4c1e" roughness={0.9} />
      </mesh>
      <mesh position={[1.2, 3.0, 1.2]} castShadow receiveShadow>
        <dodecahedronGeometry args={[1.8, 1]} />
        <meshStandardMaterial color="#3a5f27" roughness={0.9} />
      </mesh>
      <mesh position={[-1.2, 4.0, -0.8]} castShadow receiveShadow>
        <dodecahedronGeometry args={[2.2, 1]} />
        <meshStandardMaterial color="#233a18" roughness={0.9} />
      </mesh>
    </group>
  );
};


const PlotCallout = ({ plot }: { plot: { id: number, x: number, y: number, z: number, area: number, type: string, status: string } }) => {
  const [grown, setGrown] = React.useState(0);
  const pulseRef = useRef<any>(null);
  
  // Animate the line growing and hotspot pulsing
  useFrame((state, delta) => {
    if (grown < 1) {
      setGrown(Math.min(1, grown + delta * 2));
    }
    if (pulseRef.current) {
      const t = state.clock.elapsedTime;
      // Pulse scale from 1.0 to 1.6
      const pulsePhase = (Math.sin(t * 4) * 0.5 + 0.5); 
      const scale = 1 + pulsePhase * 0.6;
      pulseRef.current.scale.set(scale, scale, scale);
      // Fade out as it expands
      pulseRef.current.material.opacity = Math.max(0, 0.8 - pulsePhase * 0.8);
      // Spin the ring
      pulseRef.current.rotation.z -= delta;
    }
  });

  // Calculate points for the animated line
  const height = 20;
  const branchX = 15;
  const p0 = new THREE.Vector3(plot.x, plot.y, plot.z);
  const p1 = new THREE.Vector3(plot.x, plot.y + height * grown, plot.z);
  
  // The branch only starts growing after vertical is 80% done
  const branchProg = Math.max(0, (grown - 0.8) * 5);
  const p2 = new THREE.Vector3(plot.x + branchX * branchProg, plot.y + height, plot.z);

  const points = [p0, p1, p2];

  return (
    <group>
      {/* Hotspot Base on the ground */}
      <group position={[plot.x, plot.y + 0.2, plot.z]} rotation={[-Math.PI / 2, 0, 0]}>
        {/* Inner Solid Core */}
        <mesh>
          <circleGeometry args={[0.5, 32]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={0.9} depthWrite={false} />
        </mesh>
        
        {/* Static Inner Ring */}
        <mesh>
          <ringGeometry args={[0.8, 1.0, 32]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={0.6} depthWrite={false} />
        </mesh>

        {/* Expanding / Pulsing Outer Radar Ring */}
        <mesh ref={pulseRef}>
          <ringGeometry args={[1.2, 1.3, 32]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={0.4} depthWrite={false} />
        </mesh>
      </group>

      {/* The 3D Line */}
      <Line points={points} color="#00ffff" lineWidth={2} transparent opacity={0.8} />

      {/* The HTML HUD Overlay at the end of the line */}
      {grown >= 1 && (
        <Html position={[p2.x, p2.y, p2.z]} center zIndexRange={[100, 0]}>
          <div style={{
            background: 'rgba(10, 20, 30, 0.85)',
            border: '1px solid #00ffff',
            borderLeft: '4px solid #00ffff',
            padding: '15px',
            color: '#00ffff',
            fontFamily: 'monospace',
            width: '280px',
            boxShadow: '0 0 15px rgba(0, 255, 255, 0.2)',
            backdropFilter: 'blur(4px)',
            pointerEvents: 'none',
            userSelect: 'none'
          }}>
            <div style={{ borderBottom: '1px solid rgba(0,255,255,0.3)', paddingBottom: '8px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <strong style={{ fontSize: '18px', letterSpacing: '2px' }}>H-LAND# {plot.id}</strong>
              <span style={{ fontSize: '10px', marginTop: '6px' }}>DATA SYSTEM</span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
              <div style={{ background: 'rgba(0,255,255,0.1)', padding: '6px' }}>
                <div style={{ opacity: 0.7, fontSize: '10px' }}>EST. AREA</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{plot.area.toLocaleString()} sq ft</div>
              </div>
              <div style={{ background: 'rgba(0,255,255,0.1)', padding: '6px' }}>
                <div style={{ opacity: 0.7, fontSize: '10px' }}>ZONING</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{plot.type.toUpperCase()} ({plot.status})</div>
              </div>
            </div>
            
            <div style={{ marginTop: '8px', padding: '6px', background: 'rgba(0,255,255,0.05)', fontSize: '11px', opacity: 0.8 }}>
              LAT: {(plot.x).toFixed(4)} <br/>
              LON: {(plot.z).toFixed(4)}
            </div>
            
            <div style={{ 
              marginTop: '10px', 
              height: '20px', 
              background: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,255,255,0.2) 2px, rgba(0,255,255,0.2) 4px)' 
            }} />
          </div>
        </Html>
      )}
    </group>
  );
};

const ProceduralPlotLines = ({ voronoiData }: { voronoiData: any }) => {
  const { delaunay, seeds } = voronoiData;
  const lineGeometry = useMemo(() => {
    const points: number[] = [];
    
    // 1. Draw continuous Road Borders
    // Road 1 (X from -200 to 200)
    for(let x = -200; x <= 200; x += 2) {
       const zCenter = Math.sin(x * 0.02) * 80 + Math.cos(x * 0.01) * 40;
       const nextX = x + 2;
       const nextZCenter = Math.sin(nextX * 0.02) * 80 + Math.cos(nextX * 0.01) * 40;
       
       // Top border
       let y1 = getTerrainHeight(x, zCenter + 6.5) + 0.3;
       let y2 = getTerrainHeight(nextX, nextZCenter + 6.5) + 0.3;
       points.push(x, y1, zCenter + 6.5, nextX, y2, nextZCenter + 6.5);
       
       // Bottom border
       y1 = getTerrainHeight(x, zCenter - 6.5) + 0.3;
       y2 = getTerrainHeight(nextX, nextZCenter - 6.5) + 0.3;
       points.push(x, y1, zCenter - 6.5, nextX, y2, nextZCenter - 6.5);
    }
    
    // Road 2 (Z from -200 to 200)
    for(let z = -200; z <= 200; z += 2) {
       const xCenter = Math.sin(z * 0.03) * 60 + Math.cos(z * 0.015) * 20;
       const nextZ = z + 2;
       const nextXCenter = Math.sin(nextZ * 0.03) * 60 + Math.cos(nextZ * 0.015) * 20;
       
       let y1 = getTerrainHeight(xCenter + 6.5, z) + 0.3;
       let y2 = getTerrainHeight(nextXCenter + 6.5, nextZ) + 0.3;
       points.push(xCenter + 6.5, y1, z, nextXCenter + 6.5, y2, nextZ);
       
       y1 = getTerrainHeight(xCenter - 6.5, z) + 0.3;
       y2 = getTerrainHeight(nextXCenter - 6.5, nextZ) + 0.3;
       points.push(xCenter - 6.5, y1, z, nextXCenter - 6.5, y2, nextZ);
    }

    // 2. Use parent-calculated Voronoi
    try {
      const voronoi = delaunay.voronoi([-200, -200, 200, 200]);
      
      const pushVoronoiLine = (p1x: number, p1z: number, p2x: number, p2z: number) => {
         // Subdivide line to drape over terrain and stop at road boundaries
         const steps = 10;
         for(let i=0; i<steps; i++) {
            const t1 = i/steps;
            const t2 = (i+1)/steps;
            const xA = p1x + (p2x - p1x) * t1;
            const zA = p1z + (p2z - p1z) * t1;
            const xB = p1x + (p2x - p1x) * t2;
            const zB = p1z + (p2z - p1z) * t2;
            
            // Only draw segment if it is OUTSIDE the road (dist > 6.5)
            if (getDistanceToRoad(xA, zA) >= 6.5 && getDistanceToRoad(xB, zB) >= 6.5) {
               points.push(xA, getTerrainHeight(xA, zA) + 0.3, zA);
               points.push(xB, getTerrainHeight(xB, zB) + 0.3, zB);
            }
         }
      };
      
      const polygons = voronoi.cellPolygons();
      for (const polygon of polygons) {
         for (let i = 0; i < polygon.length - 1; i++) {
            pushVoronoiLine(polygon[i][0], polygon[i][1], polygon[i+1][0], polygon[i+1][1]);
         }
      }
    } catch(e) { console.error("Voronoi error", e); }
    
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    return geo;
  }, [delaunay, seeds]);

  return (
    <lineSegments geometry={lineGeometry}>
      <lineBasicMaterial color="#ffffff" linewidth={2} opacity={0.9} transparent />
    </lineSegments>
  );
};

export const PlotModelMap: React.FC = () => {
  const [showPlotLines, setShowPlotLines] = React.useState(false);
  const [showAvailability, setShowAvailability] = React.useState(false);
  const [selectedPlot, setSelectedPlot] = React.useState<any>(null);


  const elements = useMemo(() => {
    const trees: any[] = [];
    const houses: any[] = [];
    const birds: any[] = [];
    
    // Hardcode 2 massive factories on opposite sides of the map
    houses.push({
      position: [140, getTerrainHeight(140, -140), -140] as [number, number, number],
      rotationY: Math.PI / 4,
      type: 'factory'
    });
    houses.push({
      position: [-140, getTerrainHeight(-140, 140), 140] as [number, number, number],
      rotationY: Math.PI / 4 + Math.PI,
      type: 'factory'
    });

    // Pass 1: Randomly spawn massive factories across the map first
    for (let i = 0; i < 3; i++) {
      const tx = (Math.random() - 0.5) * 360;
      const tz = (Math.random() - 0.5) * 360;
      const distToRoad = getDistanceToRoad(tx, tz);
      
      // Factories need a lot of space, spawn them slightly away from main roads
      if (distToRoad > 15) {
        // Ensure factories don't overlap each other
        const canPlace = houses.every((h: any) => Math.hypot(h.position[0] - tx, h.position[2] - tz) > 50);
        if (canPlace) {
           houses.push({
             position: [tx, getTerrainHeight(tx, tz), tz] as [number, number, number],
             rotationY: Math.random() * Math.PI * 2,
             type: 'factory'
           });
        }
      }
    }

    // Pass 2: Spawn houses and dense trees along the procedural roads
    for (let x = -200; x <= 200; x += 12) {
      for (let z = -200; z <= 200; z += 12) {
        const tx = x + (Math.random() * 10 - 5);
        const tz = z + (Math.random() * 10 - 5);
        const distToRoad = getDistanceToRoad(tx, tz);
        const ty = getTerrainHeight(tx, tz);
        
        // Spawn Dense Housing alongside the main roads
        if (distToRoad > 8 && distToRoad < 40) {
          // Check collision against BOTH existing houses AND the huge factories
          const canPlace = houses.every((h: any) => {
             const hRadius = h.type === 'factory' ? 28 : 12; // Factories need huge clearance
             return Math.hypot(h.position[0] - tx, h.position[2] - tz) > (12 + hRadius) / 2;
          });

          if (canPlace) {
            if (Math.random() > 0.3) {
               houses.push({
                 position: [tx, ty, tz] as [number, number, number],
                 rotationY: Math.random() * Math.PI * 2,
                 type: Math.random() > 0.5 ? 'medieval' : 'modern'
               });
            }
          }
        }
        
        // Spawn Dense Trees further away from roads
        if (distToRoad > 12) {
           // Trees must not spawn inside houses or factories
           const canPlaceTree = houses.every((h: any) => {
             const hRadius = h.type === 'factory' ? 24 : 8;
             return Math.hypot(h.position[0] - tx, h.position[2] - tz) > hRadius;
           });
           
           if (canPlaceTree && Math.random() > 0.6) {
             trees.push([tx, ty, tz]);
           }
        }
      }
    }

    // Spawn Birds in the sky
    for (let i = 0; i < 30; i++) {
      birds.push({
        startPos: [Math.random() * 400 - 200, Math.random() * 15 + 40, Math.random() * 400 - 200] as [number, number, number],
        speed: Math.random() * 15 + 10,
        offset: Math.random() * 10
      });
    }

    return { trees, houses, birds };
  }, []);

  // Generate the highly detailed uneven terrain geometry with ROADS and FARMLAND vertex colors!

  const voronoiData = useMemo(() => {
    const seeds: [number, number][] = elements.houses.map((h: any) => [h.position[0], h.position[2]]);
    for(let i=0; i<150; i++) {
       const tx = (Math.random() - 0.5) * 400;
       const tz = (Math.random() - 0.5) * 400;
       if (getDistanceToRoad(tx, tz) > 15) seeds.push([tx, tz]);
    }
    const delaunay = Delaunay.from(seeds);
    
    // Generate random status for each plot
    const statusArray = seeds.map(() => {
      const r = Math.random();
      if (r < 0.5) return 'AVAILABLE';
      if (r < 0.75) return 'BOOKED';
      return 'SOLD';
    });

    return { seeds, delaunay, statusArray };
  }, [elements]);

  const availabilityTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    // Draw Voronoi plots
    const voronoi = voronoiData.delaunay.voronoi([-200, -200, 200, 200]);
    const polygons = Array.from(voronoi.cellPolygons());
    
    polygons.forEach((poly, i) => {
      ctx.beginPath();
      poly.forEach((point, j) => {
        const cx = (point[0] + 200) * 2.56;
        const cy = (point[1] + 200) * 2.56;
        if (j === 0) ctx.moveTo(cx, cy);
        else ctx.lineTo(cx, cy);
      });
      ctx.closePath();
      
      const status = voronoiData.statusArray[i];
      // Use slightly randomized shades for each plot so adjacent plots of the same status don't visually merge into one massive polygon!
      const rand = Math.random();
      if (status === 'AVAILABLE') {
         ctx.fillStyle = `rgba(${70 + rand * 15}, ${165 + rand * 20}, ${70 + rand * 15}, 0.5)`; // Unique Green
      } else if (status === 'BOOKED') {
         ctx.fillStyle = `rgba(${245 + rand * 10}, ${145 + rand * 15}, 0, 0.5)`; // Unique Orange
      } else {
         ctx.fillStyle = `rgba(${235 + rand * 20}, ${55 + rand * 15}, ${45 + rand * 15}, 0.5)`; // Unique Red
      }
      
      ctx.fill();
    });

    // Pixel-perfect mathematical erasure of the roads
    const imgData = ctx.getImageData(0, 0, 1024, 1024);
    const data = imgData.data;
    for (let py = 0; py < 1024; py++) {
      for (let px = 0; px < 1024; px++) {
        // Convert canvas coordinates back to world coordinates
        const worldX = (px / 2.56) - 200;
        const worldZ = (py / 2.56) - 200;
        
        // If the pixel is inside the road boundaries, completely clear its alpha channel
        if (getDistanceToRoad(worldX, worldZ) <= 6.5) {
          const index = (py * 1024 + px) * 4;
          data[index + 3] = 0; // Set Alpha to 0
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    texture.anisotropy = 4;
    return texture;
  }, [voronoiData]);
  
  const handleTerrainClick = (e: any) => {
    if (!showPlotLines && !showAvailability) return;
    e.stopPropagation();
    const { x, z } = e.point;
    // Find closest plot
    const index = voronoiData.delaunay.find(x, z);
    const seed = voronoiData.seeds[index];
    
    // Determine type (if it's a house, check elements.houses)
    let type = 'EMPTY PLOT';
    let area = Math.floor(Math.random() * 5000 + 10000); // Mock area
    elements.houses.forEach((h: any) => {
      if (Math.abs(h.position[0] - seed[0]) < 0.1 && Math.abs(h.position[2] - seed[1]) < 0.1) {
        type = h.type === 'factory' ? 'INDUSTRIAL' : 'RESIDENTIAL';
        if (h.type === 'factory') area += 25000;
      }
    });

    const status = voronoiData.statusArray[index];
    setSelectedPlot({
      id: index + 1000,
      x: seed[0],
      y: getTerrainHeight(seed[0], seed[1]),
      z: seed[1],
      area,
      type,
      status
    });
  };

  const terrainGeo = useMemo(() => {
    // 400x400 resolution gives 160,000 vertices for ultra-smooth 4K road drawing!
    const geo = new THREE.PlaneGeometry(600, 600, 400, 400);
    const pos = geo.attributes.position;
    const colors = [];
    const color = new THREE.Color();

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const worldX = x;
      const worldZ = -y;
      
      const terrainY = getTerrainHeight(worldX, worldZ);
      pos.setZ(i, terrainY);

      const distToRoad = getDistanceToRoad(worldX, worldZ);
      const isFarm = Math.sin(worldX * 0.08) * Math.cos(worldZ * 0.08) > 0.5;

      // High-Definition Smooth Blending Vertex Colors with SmoothStep
      if (distToRoad < 3) {
        // Core Dirt/Concrete Road
        color.setHex(0xd4c3a3); // Light sandy beige
        color.offsetHSL(0, 0, (Math.random() - 0.5) * 0.03);
      } else if (distToRoad >= 3 && distToRoad < 5) {
        // Dusty road shoulder
        const t = (distToRoad - 3) / 2;
        const smoothT = t * t * (3 - 2 * t);
        const coreColor = new THREE.Color(0xd4c3a3);
        const shoulderColor = new THREE.Color(0xa39a7b);
        color.copy(coreColor).lerp(shoulderColor, smoothT);
      } else if (distToRoad >= 5 && distToRoad < 10) {
        // Smooth road edge blending organically into grass
        const t = (distToRoad - 5) / 5;
        const smoothT = t * t * (3 - 2 * t);
        const shoulderColor = new THREE.Color(0xa39a7b);
        const grassColor = new THREE.Color(isFarm ? 0x4a5d23 : 0x556846);
        color.copy(shoulderColor).lerp(grassColor, smoothT);
      } else if (isFarm && distToRoad > 15) {
        // Cultivated Farmland
        color.setHex(Math.random() > 0.5 ? 0x4a5d23 : 0x6b8e23); 
      } else {
        // Natural Terrain
        if (terrainY > 2.0) color.setHex(0x556846); 
        else color.setHex(0x3f4a3c); 
        color.offsetHSL(0, 0, (Math.random() - 0.5) * 0.08);
      }
      colors.push(color.r, color.g, color.b);
    }
    
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
    <Canvas 
      shadows 
      className="canvas-container"
      style={{ width: '100vw', height: '100vh', display: 'block', background: '#3f4a3c' }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
    >
      <SoftShadows size={30} samples={16} focus={0.5} />
      <Sky sunPosition={[100, 60, -100]} turbidity={0.3} rayleigh={1.2} />
      
      <Environment preset="park" background={false} />
      
      <MovingClouds />
      
      <PerspectiveCamera makeDefault position={[0, 150, 150]} fov={55} near={1} far={1000} />
      <OrbitControls enableRotate={true} enablePan={true} enableZoom={true} maxPolarAngle={Math.PI / 2.2} target={[0, 0, 0]} autoRotate={true} autoRotateSpeed={0.3} />

      <ambientLight intensity={0.5} color="#ffffff" />
      <directionalLight 
        position={[150, 60, -100]} 
        intensity={1.5} 
        color="#ffebd6"
        castShadow 
        shadow-mapSize={[2048, 2048]} 
        shadow-camera-left={-200}
        shadow-camera-right={200}
        shadow-camera-top={200}
        shadow-camera-bottom={-200}
        shadow-bias={-0.001}
      />

      {/* Massive Village Terrain with ROADS and FARMLANDS */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow geometry={terrainGeo} onClick={handleTerrainClick}>
        <meshStandardMaterial vertexColors={true} roughness={1} metalness={0.02} />
      </mesh>

      {/* Render Birds */}
      {elements.birds.map((bird: any, i: number) => (
        <FlappingBird key={`bird-${i}`} startPos={bird.startPos} speed={bird.speed} offset={bird.offset} />
      ))}

      {/* Render Trees */}
      {elements.trees.map((t: any, i: number) => (
        <LushTree key={`tree-${i}`} position={t as [number, number, number]} />
      ))}

      {/* Render Houses & Factories */}
      {elements.houses.map((h: any, i: number) => {
        if (h.type === 'factory') {
          return <ProceduralFactory key={`building-${i}`} position={h.position} rotationY={h.rotationY} />;
        } else if (h.type === 'modern') {
          return <ModernLuxuryVilla key={`building-${i}`} position={h.position} rotationY={h.rotationY} />;
        } else {
          return <StylizedMedievalHouse key={`building-${i}`} position={h.position} rotationY={h.rotationY} />;
        }
      })}

            {/* Availability Canvas Overlay */}
      {showAvailability && availabilityTexture && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.25, 0]} geometry={terrainGeo}>
          <meshBasicMaterial map={availabilityTexture} transparent depthWrite={false} />
        </mesh>
      )}

      {/* Plot Boundaries Overlay */}
      {(showPlotLines || showAvailability) && <ProceduralPlotLines voronoiData={voronoiData} />}
      {selectedPlot && (showPlotLines || showAvailability) && <PlotCallout key={selectedPlot.id} plot={selectedPlot} />}

      {/* Instanced 3D Grass */}
      <InstancedGrass />
    </Canvas>

    {/* UI Overlay: Toggles */}
    <div style={{ position: 'absolute', bottom: '20px', right: '20px', zIndex: 1000, display: 'flex', gap: '10px' }}>
      <button 
        onClick={() => setShowAvailability(!showAvailability)}
        style={{
          backgroundColor: showAvailability ? '#ff4d4d' : '#1a1a1a',
          color: '#ffffff',
          border: '1px solid #444',
          padding: '12px 24px',
          borderRadius: '4px',
          fontFamily: 'monospace',
          fontSize: '14px',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0,0,0,0.5)',
          transition: 'all 0.2s ease'
        }}
      >
        {showAvailability ? 'HIDE AVAILABILITY' : 'SHOW AVAILABILITY'}
      </button>
      <button 
        onClick={() => setShowPlotLines(!showPlotLines)}
        style={{
          backgroundColor: showPlotLines ? '#ff4d4d' : '#1a1a1a',
          color: '#ffffff',
          border: '1px solid #444',
          padding: '12px 24px',
          borderRadius: '4px',
          fontFamily: 'monospace',
          fontSize: '14px',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0,0,0,0.5)',
          transition: 'all 0.2s ease'
        }}
      >
        {showPlotLines ? 'HIDE PLOT LINES' : 'SHOW PLOT LINES'}
      </button>
    </div>
    
    {/* Availability Legend */}
    {showAvailability && (
      <div style={{ position: 'absolute', bottom: '80px', right: '20px', zIndex: 1000, display: 'flex', gap: '10px', background: 'rgba(0,0,0,0.6)', padding: '10px', borderRadius: '4px' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'white', fontFamily: 'monospace', fontSize: '12px' }}>
            <div style={{ width: '12px', height: '12px', background: '#4CAF50', borderRadius: '2px' }}></div> AVAILABLE
         </div>
         <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'white', fontFamily: 'monospace', fontSize: '12px' }}>
            <div style={{ width: '12px', height: '12px', background: '#FF9800', borderRadius: '2px' }}></div> BOOKED
         </div>
         <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'white', fontFamily: 'monospace', fontSize: '12px' }}>
            <div style={{ width: '12px', height: '12px', background: '#F44336', borderRadius: '2px' }}></div> SOLD
         </div>
      </div>
    )}
  </div>
  );
};
