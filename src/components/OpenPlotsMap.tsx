import React, { useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrthographicCamera, OrbitControls, Sky, Environment, MeshReflectorMaterial, SoftShadows, Stars, Line, Html } from '@react-three/drei';
import { Delaunay } from 'd3-delaunay';
import { useState } from 'react';
import { EffectComposer, Bloom, Vignette, SSAO, GodRays } from '@react-three/postprocessing';
import * as THREE from 'three';
import { MovingClouds, FlappingBird, Tree } from './CityMap';

// High-Performance Procedural Noise for terrain bump mapping and water ripples
const generateNoiseTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext('2d');
  if (context) {
    const imgData = context.createImageData(512, 512);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const v = Math.floor(Math.random() * 255);
      imgData.data[i] = v;     // R
      imgData.data[i + 1] = v; // G
      imgData.data[i + 2] = v; // B
      imgData.data[i + 3] = 255; // A
    }
    context.putImageData(imgData, 0, 0);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(15, 15);
  tex.needsUpdate = true;
  return tex;
};

// Component to animate the water ripples seamlessly
const WaterAnimator = ({ texture }: { texture: THREE.Texture }) => {
  useFrame((_, delta) => {
    texture.offset.x += delta * 0.05;
    texture.offset.y += delta * 0.05;
  });
  return null;
};

// Deterministic pseudo-noise for rolling hills
const getTerrainHeight = (x: number, z: number) => {
  let y = 0;
  y += Math.sin(x * 0.015 + z * 0.01) * 4.0; 
  y += Math.sin(x * 0.03 - z * 0.02) * 2.0; 
  y += Math.sin(x * 0.08 + z * 0.05) * 0.5;
  return y;
};

// Procedural 3D Instanced Grass (20,000 blades rendered in a single draw call!)
const InstancedGrass = () => {
  const count = 25000;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  useEffect(() => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 400;
      const z = (Math.random() - 0.5) * 400;
      const y = getTerrainHeight(x, z);
      
      // Skip spawning grass underwater
      if (y < -1.0) continue;

      dummy.position.set(x, y + 0.3, z); // shift up so cone sits on ground
      dummy.rotation.y = Math.random() * Math.PI;
      dummy.rotation.x = (Math.random() - 0.5) * 0.5; // Random lean
      dummy.rotation.z = (Math.random() - 0.5) * 0.5;
      
      const scale = Math.random() * 0.6 + 0.4;
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      
      // Color matches the terrain vertex coloring
      if (y > 2.0) color.setHex(0x556846);
      else color.setHex(0x3f4a3c);
      color.offsetHSL(0, 0, (Math.random() - 0.5) * 0.1);
      meshRef.current.setColorAt(i, color);
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, []);

  const shaderRef = useRef<any>(null);
  
  // Update the shader time uniform every frame for continuous wind physics
  useFrame((state) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow receiveShadow>
      <coneGeometry args={[0.15, 0.8, 3]} />
      <meshStandardMaterial 
        roughness={1} 
        onBeforeCompile={(shader) => {
          shader.uniforms.uTime = { value: 0 };
          shaderRef.current = shader;
          // Inject custom GLSL shader code directly into the WebGL renderer
          shader.vertexShader = `
            uniform float uTime;
            ${shader.vertexShader}
          `.replace(
            `#include <begin_vertex>`,
            `
            #include <begin_vertex>
            // Advanced Wind Physics: Sway only the top of the grass based on world position!
            if (position.y > 0.0) { 
                float worldX = instanceMatrix[3][0];
                float worldZ = instanceMatrix[3][2];
                // Wave propagation using sine and world coordinates
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

// Floating Sunset Fireflies
const Fireflies = () => {
  const count = 800;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 400; // x
      pos[i * 3 + 1] = Math.random() * 8 + 0.2; // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 400; // z
    }
    return pos;
  }, []);
  
  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.05) * 0.2;
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.5;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.8} color="#ffd257" transparent opacity={0.8} sizeAttenuation={true} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
};

// 4-legged Geometric Animated Animal (Deer/Horse)
const AnimatedAnimal = ({ startPos, direction, speed }: { startPos: [number, number, number], direction: { axis: 'x' | 'z', sign: number }, speed: number }) => {
  const ref = useRef<THREE.Group>(null);
  const flLeg = useRef<THREE.Group>(null); // front left
  const frLeg = useRef<THREE.Group>(null); // front right
  const blLeg = useRef<THREE.Group>(null); // back left
  const brLeg = useRef<THREE.Group>(null); // back right
  
  const offset = useRef(Math.random() * Math.PI * 2);
  const color = useRef(['#8b5a2b', '#a0522d', '#cd853f', '#d2691e'][Math.floor(Math.random() * 4)]); // Earthy tones
  
  useFrame((state, delta) => {
    if (!ref.current) return;
    const move = speed * direction.sign * delta;
    if (direction.axis === 'z') {
      ref.current.position.z += move;
      if (ref.current.position.z > 200) ref.current.position.z = -200;
      if (ref.current.position.z < -200) ref.current.position.z = 200;
    } else {
      ref.current.position.x += move;
      if (ref.current.position.x > 200) ref.current.position.x = -200;
      if (ref.current.position.x < -200) ref.current.position.x = 200;
    }
    
    // Four-legged kinematic trot animation
    const t = state.clock.elapsedTime * speed * 3 + offset.current;
    const swing1 = Math.sin(t);
    const swing2 = Math.sin(t + Math.PI); // Opposite phase
    
    // Read the procedural terrain height so the animal realistically walks UP and DOWN the hills!
    const terrainY = getTerrainHeight(ref.current.position.x, ref.current.position.z);
    ref.current.position.y = terrainY + Math.abs(swing1) * 0.05; // Bobbing body
    
    // Diagonal pairs move together in a natural trot
    if (flLeg.current) flLeg.current.rotation.x = swing1 * 0.5;
    if (brLeg.current) brLeg.current.rotation.x = swing1 * 0.5;
    
    if (frLeg.current) frLeg.current.rotation.x = swing2 * 0.5;
    if (blLeg.current) blLeg.current.rotation.x = swing2 * 0.5;
  });

  const isZ = direction.axis === 'z';
  const rotationY = isZ ? (direction.sign > 0 ? 0 : Math.PI) : (direction.sign > 0 ? Math.PI / 2 : -Math.PI / 2);

  return (
    <group ref={ref} position={startPos} rotation={[0, rotationY, 0]}>
      {/* Torso/Body */}
      <mesh castShadow receiveShadow position={[0, 1.2, 0]}>
        <boxGeometry args={[0.6, 0.5, 1.2]} />
        <meshStandardMaterial color={color.current} roughness={0.9} />
      </mesh>
      
      {/* Neck & Head */}
      <group position={[0, 1.4, 0.5]}>
         {/* Neck */}
         <mesh castShadow receiveShadow position={[0, 0.3, 0]} rotation={[0.4, 0, 0]}>
           <boxGeometry args={[0.3, 0.6, 0.3]} />
           <meshStandardMaterial color={color.current} roughness={0.9} />
         </mesh>
         {/* Head */}
         <mesh castShadow receiveShadow position={[0, 0.6, 0.2]}>
           <boxGeometry args={[0.3, 0.3, 0.5]} />
           <meshStandardMaterial color={color.current} roughness={0.9} />
         </mesh>
         {/* Ears/Antlers */}
         <mesh castShadow position={[-0.2, 0.8, -0.1]}>
           <boxGeometry args={[0.05, 0.3, 0.05]} />
           <meshStandardMaterial color="#4a3b2c" />
         </mesh>
         <mesh castShadow position={[0.2, 0.8, -0.1]}>
           <boxGeometry args={[0.05, 0.3, 0.05]} />
           <meshStandardMaterial color="#4a3b2c" />
         </mesh>
      </group>
      
      {/* Front Left Leg */}
      <group position={[-0.2, 1.0, 0.4]} ref={flLeg}>
        <mesh castShadow position={[0, -0.5, 0]}>
          <boxGeometry args={[0.15, 1.0, 0.15]} />
          <meshStandardMaterial color={color.current} roughness={0.9} />
        </mesh>
      </group>
      {/* Front Right Leg */}
      <group position={[0.2, 1.0, 0.4]} ref={frLeg}>
        <mesh castShadow position={[0, -0.5, 0]}>
          <boxGeometry args={[0.15, 1.0, 0.15]} />
          <meshStandardMaterial color={color.current} roughness={0.9} />
        </mesh>
      </group>
      
      {/* Back Left Leg */}
      <group position={[-0.2, 1.0, -0.4]} ref={blLeg}>
        <mesh castShadow position={[0, -0.5, 0]}>
          <boxGeometry args={[0.15, 1.0, 0.15]} />
          <meshStandardMaterial color={color.current} roughness={0.9} />
        </mesh>
      </group>
      {/* Back Right Leg */}
      <group position={[0.2, 1.0, -0.4]} ref={brLeg}>
        <mesh castShadow position={[0, -0.5, 0]}>
          <boxGeometry args={[0.15, 1.0, 0.15]} />
          <meshStandardMaterial color={color.current} roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
};


const PlotCallout = ({ plot }: { plot: { id: number, x: number, y: number, z: number, area: number, type: string } }) => {
  const [grown, setGrown] = useState(0);
  const pulseRef = useRef<any>(null);
  
  useFrame((state, delta) => {
    if (grown < 1) {
      setGrown(Math.min(1, grown + delta * 2));
    }
    if (pulseRef.current) {
      const t = state.clock.elapsedTime;
      const pulsePhase = (Math.sin(t * 4) * 0.5 + 0.5); 
      const scale = 1 + pulsePhase * 0.6;
      pulseRef.current.scale.set(scale, scale, scale);
      pulseRef.current.material.opacity = Math.max(0, 0.8 - pulsePhase * 0.8);
      pulseRef.current.rotation.z -= delta;
    }
  });

  const height = 20;
  const branchX = 15;
  const p0 = new THREE.Vector3(plot.x, plot.y, plot.z);
  const p1 = new THREE.Vector3(plot.x, plot.y + height * grown, plot.z);
  const branchProg = Math.max(0, (grown - 0.8) * 5);
  const p2 = new THREE.Vector3(plot.x + branchX * branchProg, plot.y + height, plot.z);
  const points = [p0, p1, p2];

  return (
    <group>
      <group position={[plot.x, plot.y + 0.2, plot.z]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh>
          <circleGeometry args={[0.5, 32]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={0.9} depthWrite={false} />
        </mesh>
        <mesh>
          <ringGeometry args={[0.8, 1.0, 32]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={0.6} depthWrite={false} />
        </mesh>
        <mesh ref={pulseRef}>
          <ringGeometry args={[1.2, 1.3, 32]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={0.4} depthWrite={false} />
        </mesh>
      </group>
      <Line points={points} color="#00ffff" lineWidth={2} transparent opacity={0.8} />
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
              <strong style={{ fontSize: '18px', letterSpacing: '2px' }}>O-PLOT# {plot.id}</strong>
              <span style={{ fontSize: '10px', marginTop: '6px' }}>DATA SYSTEM</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
              <div style={{ background: 'rgba(0,255,255,0.1)', padding: '6px' }}>
                <div style={{ opacity: 0.7, fontSize: '10px' }}>EST. AREA</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{plot.area.toLocaleString()} sq ft</div>
              </div>
              <div style={{ background: 'rgba(0,255,255,0.1)', padding: '6px' }}>
                <div style={{ opacity: 0.7, fontSize: '10px' }}>ZONING</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{plot.type.toUpperCase()}</div>
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

const ProceduralPlotLines = ({ voronoiData }: { voronoiData: any }) => {
  const lineGeometry = useMemo(() => {
    const points: number[] = [];
    try {
      const voronoi = voronoiData.delaunay.voronoi([-300, -300, 300, 300]);
      
      const pushVoronoiLine = (p1x: number, p1z: number, p2x: number, p2z: number) => {
         const steps = 10;
         for(let i=0; i<steps; i++) {
            const t1 = i/steps;
            const t2 = (i+1)/steps;
            const xA = p1x + (p2x - p1x) * t1;
            const zA = p1z + (p2z - p1z) * t1;
            const xB = p1x + (p2x - p1x) * t2;
            const zB = p1z + (p2z - p1z) * t2;
            
            points.push(xA, getTerrainHeight(xA, zA) + 0.3, zA);
            points.push(xB, getTerrainHeight(xB, zB) + 0.3, zB);
         }
      };
      
      const polygons = voronoi.cellPolygons();
      for (const polygon of polygons) {
         for (let i = 0; i < polygon.length - 1; i++) {
            pushVoronoiLine(polygon[i][0], polygon[i][1], polygon[i+1][0], polygon[i+1][1]);
         }
      }
    } catch(e) { console.error(e); }
    
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    return geo;
  }, [voronoiData]);

  return (
    <lineSegments geometry={lineGeometry}>
      <lineBasicMaterial color="#ffffff" transparent opacity={0.6} linewidth={1} />
    </lineSegments>
  );
};

export const OpenPlotsMap: React.FC = () => {
  const [sunRef, setSunRef] = React.useState<THREE.Mesh | null>(null);
  const [showPlotLines, setShowPlotLines] = useState(false);
  const [selectedPlot, setSelectedPlot] = useState<any>(null);
  
  const voronoiData = useMemo(() => {
    const seeds: [number, number][] = [];
    for(let i=0; i<300; i++) {
       const tx = (Math.random() - 0.5) * 600;
       const tz = (Math.random() - 0.5) * 600;
       seeds.push([tx, tz]);
    }
    const delaunay = Delaunay.from(seeds);
    return { seeds, delaunay };
  }, []);

  const handleTerrainClick = (e: any) => {
    if (!showPlotLines) return;
    e.stopPropagation();
    const { x, z } = e.point;
    if (x < -300 || x > 300 || z < -300 || z > 300) return;
    const index = voronoiData.delaunay.find(x, z);
    const seed = voronoiData.seeds[index];
    
    const voronoi = voronoiData.delaunay.voronoi([-300, -300, 300, 300]);
    const polygon = voronoi.cellPolygon(index);
    let area = 0;
    if (polygon) {
      for (let i = 0; i < polygon.length - 1; i++) {
        area += polygon[i][0] * polygon[i+1][1] - polygon[i+1][0] * polygon[i][1];
      }
      area = Math.abs(area / 2);
    }
    area = Math.round(area * 10);
    
    setSelectedPlot({
      id: index + 2000,
      x: seed[0],
      y: getTerrainHeight(seed[0], seed[1]),
      z: seed[1],
      area,
      type: 'OPEN PLOT'
    });
  };
  const noiseTex = useMemo(() => generateNoiseTexture(), []);
  
  const elements = useMemo(() => {
    const trees = [];
    const animals = [];
    const birds = [];
    
    // Spawn a dense procedural forest landscape
    for (let x = -150; x <= 150; x += 15) {
      for (let z = -150; z <= 150; z += 15) {
        // Leave a sweeping clearing through the center for animals
        const distToCenter = Math.sqrt(x*x + z*z);
        if (distToCenter < 40) continue;
        if (Math.abs(x - z) < 20) continue; 
        
        // Spawn clusters of trees
        if (Math.random() > 0.2) {
           const tx = x + (Math.random() * 10 - 5);
           const tz = z + (Math.random() * 10 - 5);
           // Snap tree strictly to the new uneven terrain height
           const ty = getTerrainHeight(tx, tz);
           // Only spawn trees above the water line!
           if (ty > -1.0) {
             trees.push([tx, ty, tz]);
           }
        }
      }
    }
    
    // Spawn wildlife roaming the plots (above water)
    for (let i = 0; i < 40; i++) {
       const isZ = Math.random() > 0.5;
       const startX = Math.random() * 200 - 100;
       const startZ = Math.random() * 200 - 100;
       const startY = getTerrainHeight(startX, startZ);
       
       if (startY > -1.0) {
         animals.push({
           startPos: [startX, startY, startZ] as [number, number, number],
           direction: { axis: isZ ? 'z' : 'x', sign: Math.random() > 0.5 ? 1 : -1 },
           speed: Math.random() * 2 + 1
         });
       } else {
         i--; // retry if underwater
       }
    }

    // Spawn Birds in the sky
    for (let i = 0; i < 30; i++) {
      birds.push({
        startPos: [Math.random() * 400 - 200, Math.random() * 15 + 35, Math.random() * 400 - 200] as [number, number, number],
        speed: Math.random() * 15 + 10,
        offset: Math.random() * 10
      });
    }

    return { trees, animals, birds };
  }, []);

  // Generate the highly detailed uneven terrain geometry once
  const terrainGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(600, 600, 150, 150);
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

      // Hyper-realistic vertex coloring based on height
      if (terrainY < -1.0) {
         color.setHex(0x2a3821); // Darker soil near water
      } else if (terrainY > 2.0) {
         color.setHex(0x556846); // Sunlit peaks
      } else {
         color.setHex(0x3f4a3c); // Mid grass
      }
      // Add natural color noise
      color.offsetHSL(0, 0, (Math.random() - 0.5) * 0.08);
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
      style={{ width: '100%', height: '100%', display: 'block', background: '#3f4a3c' }}
      gl={{ antialias: false, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
    >
      <SoftShadows size={25} samples={16} focus={0.5} />
      <Sky sunPosition={[150, 15, -100]} turbidity={0.7} rayleigh={2} mieCoefficient={0.005} mieDirectionalG={0.8} />
      <Stars radius={150} depth={50} count={4000} factor={6} saturation={0} fade speed={2} />
      <Environment preset="sunset" background={false} />
      <fog attach="fog" args={['#cf7f53', 60, 220]} />
      <mesh ref={setSunRef} position={[150, 15, -100]}>
        <sphereGeometry args={[12, 32, 32]} />
        <meshBasicMaterial color="#ffebd6" />
      </mesh>
      <MovingClouds />
      <Fireflies />
      <OrthographicCamera makeDefault position={[60, 60, 60]} zoom={14} near={-200} far={300} />
      <OrbitControls enableRotate={true} enablePan={true} enableZoom={true} maxPolarAngle={Math.PI / 2 - 0.05} minPolarAngle={Math.PI / 8} target={[0, 0, 0]} autoRotate={true} autoRotateSpeed={0.5} />
      <ambientLight intensity={0.3} color="#404040" />
      <directionalLight 
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
      <directionalLight position={[-50, 50, 50]} intensity={0.5} color="#87ceeb" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow geometry={terrainGeo} onClick={handleTerrainClick}>
        <meshStandardMaterial vertexColors={true} roughness={1} metalness={0.02} bumpMap={noiseTex} bumpScale={0.8} />
      </mesh>

            {showPlotLines && <ProceduralPlotLines voronoiData={voronoiData} />}
      {selectedPlot && showPlotLines && <PlotCallout key={selectedPlot.id} plot={selectedPlot} />}

      {/* Lake / Water Body at the bottom of the valleys */}
      <WaterAnimator texture={noiseTex} />
      <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[600, 600]} />
        {/* Real-time SSR Water Reflections with Animated Ripples! */}
        <MeshReflectorMaterial
          blur={[400, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={15}
          roughness={0.1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#051923"
          metalness={0.6}
          mirror={0.8}
          distortionMap={noiseTex}
          distortion={0.5}
        />
      </mesh>

      {/* Render Birds */}
      {elements.birds.map((bird: any, i: number) => (
        <FlappingBird key={`bird-${i}`} startPos={bird.startPos} speed={bird.speed} offset={bird.offset} />
      ))}

      {/* Render Trees */}
      {elements.trees.map((t: any, i: number) => (
        <Tree key={`tree-${i}`} position={t as [number, number, number]} />
      ))}

      {/* Render Animals */}
      {elements.animals.map((a: any, i: number) => (
        <AnimatedAnimal key={`animal-${i}`} {...a} />
      ))}

      {/* Instanced 3D Grass */}
      <InstancedGrass />

      {/* Cinematic Post-Processing */}
      <EffectComposer multisampling={4}>
        {/* Soft Volumetric God Rays shining through the trees! */}
        {sunRef && <GodRays sun={sunRef} samples={30} density={0.8} decay={0.9} weight={0.3} exposure={0.4} clampMax={1} />}
        {/* Screen Space Ambient Occlusion for deep, realistic contact shadows */}
        <SSAO samples={21} radius={0.1} intensity={15} luminanceInfluence={0.5} />
        <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} intensity={0.8} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
            </EffectComposer>
    </Canvas>
    
    <div style={{ position: 'absolute', bottom: '20px', right: '20px', zIndex: 1000 }}>
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
    </div>
  );
};
