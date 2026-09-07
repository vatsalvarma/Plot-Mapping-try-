import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrthographicCamera, OrbitControls, Html, Sky, Environment, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

// Procedurally generate a window grid texture for realism
const generateWindowTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Base glass color (dark blue/grey)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 256, 256);
    
    // Window frames / mullions
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 4;
    for (let x = 0; x <= 256; x += 32) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 256); ctx.stroke();
    }
    for (let y = 0; y <= 256; y += 16) { // Floors are shorter than window width
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(256, y); ctx.stroke();
    }
    
    // Add some random lit windows for realism
    for (let i = 0; i < 40; i++) {
      const rx = Math.floor(Math.random() * 8) * 32;
      const ry = Math.floor(Math.random() * 16) * 16;
      ctx.fillStyle = Math.random() > 0.5 ? '#cbd5e1' : '#fef08a'; // White or warm light
      ctx.globalAlpha = Math.random() * 0.5 + 0.1;
      ctx.fillRect(rx + 2, ry + 2, 28, 12);
      ctx.globalAlpha = 1.0;
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  // Use anisotropic filtering for sharp windows at angles
  texture.anisotropy = 16;
  return texture;
};

// A highly realistic glass skyscraper
const GlassBuilding = ({ position, scale, windowTex }: { position: [number, number, number], scale: [number, number, number], windowTex: THREE.Texture }) => {
  
  // Clone the texture so we can repeat it based on the building's specific scale
  const buildingTex = useMemo(() => {
    const tex = windowTex.clone();
    tex.needsUpdate = true;
    // Repeat based on width/height so windows are proportionally sized
    tex.repeat.set(scale[0], scale[1]);
    return tex;
  }, [windowTex, scale]);

  return (
    <group position={position}>
      {/* Grass/Concrete Base */}
      <mesh position={[0, -scale[1]/2 + 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[scale[0] + 1, scale[2] + 1]} />
        <meshStandardMaterial color="#3f4a3c" roughness={1} />
      </mesh>
      
      {/* Reflective Glass Skyscraper Mesh */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={scale} />
        <meshPhysicalMaterial 
          map={buildingTex}
          color="#a8b2c1" // Tint of the glass
          metalness={0.95} // Highly reflective
          roughness={0.05} // Very smooth glass
          envMapIntensity={2.5} // Reflect the sky and environment strongly
          clearcoat={1.0} // Extra layer of shine
          clearcoatRoughness={0.05}
        />
      </mesh>
      
      {/* Flat roof top (concrete) */}
      <mesh position={[0, scale[1]/2 + 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[scale[0] - 0.1, scale[2] - 0.1]} />
        <meshStandardMaterial color="#64748b" roughness={0.9} metalness={0.1} />
      </mesh>
    </group>
  );
};

// Procedurally generate highly detailed roads
const generateRoadTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Base asphalt for the non-road areas (buildings sit here)
  ctx.fillStyle = '#1c1d21';
  ctx.fillRect(0, 0, 1024, 1024);

  // The texture repeats every 18 units.
  // The road is centered in the middle of the texture tile.
  // Let's make the road 6 units wide (1024 / 3 = 341px).
  const roadWidth = 340;
  const center = 512;
  const halfRoad = roadWidth / 2;

  // Draw main asphalt for intersecting roads
  ctx.fillStyle = '#151618'; 
  ctx.fillRect(center - halfRoad, 0, roadWidth, 1024); // Vertical
  ctx.fillRect(0, center - halfRoad, 1024, roadWidth); // Horizontal

  // Draw dashed white lane dividers
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 4;
  ctx.setLineDash([30, 30]);

  const laneOffset = halfRoad / 2;
  ctx.beginPath();
  // Vertical lanes
  ctx.moveTo(center - laneOffset, 0); ctx.lineTo(center - laneOffset, 1024);
  ctx.moveTo(center + laneOffset, 0); ctx.lineTo(center + laneOffset, 1024);
  // Horizontal lanes
  ctx.moveTo(0, center - laneOffset); ctx.lineTo(1024, center - laneOffset);
  ctx.moveTo(0, center + laneOffset); ctx.lineTo(1024, center + laneOffset);
  ctx.stroke();

  // Draw solid double yellow center lines
  ctx.strokeStyle = '#eab308';
  ctx.setLineDash([]);
  ctx.lineWidth = 4;
  
  ctx.beginPath();
  // Vertical
  ctx.moveTo(center - 4, 0); ctx.lineTo(center - 4, 1024);
  ctx.moveTo(center + 4, 0); ctx.lineTo(center + 4, 1024);
  // Horizontal
  ctx.moveTo(0, center - 4); ctx.lineTo(1024, center - 4);
  ctx.moveTo(0, center + 4); ctx.lineTo(1024, center + 4);
  ctx.stroke();

  // Clear the intersection so lines don't criss-cross ugly
  ctx.fillStyle = '#151618';
  ctx.fillRect(center - halfRoad + 10, center - halfRoad + 10, roadWidth - 20, roadWidth - 20);

  // Draw Crosswalks (Zebra crossings)
  ctx.fillStyle = '#ffffff';
  const cwWidth = 20; // width of white stripe
  const cwLength = 80;
  const cwGap = 35;
  const cwOffset = halfRoad - 30; // Push to edge of intersection

  // Top and Bottom crosswalks
  for (let x = center - halfRoad + 20; x < center + halfRoad - 20; x += cwGap) {
    ctx.fillRect(x, center - cwOffset - cwLength, cwWidth, cwLength); // Top
    ctx.fillRect(x, center + cwOffset, cwWidth, cwLength); // Bottom
  }
  // Left and Right crosswalks
  for (let y = center - halfRoad + 20; y < center + halfRoad - 20; y += cwGap) {
    ctx.fillRect(center - cwOffset - cwLength, y, cwLength, cwWidth); // Left
    ctx.fillRect(center + cwOffset, y, cwLength, cwWidth); // Right
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 16;
  
  // 324x324 plane / 18 grid size = 18 repeats.
  // We offset by 0.5 so world origin (0,0) hits the CENTER of the texture (the road crossing)
  texture.repeat.set(18, 18);
  texture.offset.set(0.5, 0.5);
  
  return texture;
};

// Tree Component
const Tree = ({ position }: { position: [number, number, number] }) => {
  const height = Math.random() * 2 + 3;
  const leafColor = ['#2d4c1e', '#3a5f27', '#4b7a33', '#5c923e'][Math.floor(Math.random() * 4)];
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh castShadow receiveShadow position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.2, 0.3, height, 8]} />
        <meshStandardMaterial color="#4a3b2c" roughness={1} />
      </mesh>
      {/* Leaves */}
      <mesh castShadow receiveShadow position={[0, height, 0]}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshStandardMaterial color={leafColor} roughness={0.8} />
      </mesh>
    </group>
  );
};

// Highly Detailed Animated Car Component
const Car = ({ startPos, direction, speed, color }: { startPos: [number, number, number], direction: { axis: 'x' | 'z', sign: number }, speed: number, color: string }) => {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((_, delta) => {
    if (!ref.current) return;
    if (direction.axis === 'z') {
      ref.current.position.z += speed * direction.sign * delta;
      if (ref.current.position.z > 162) ref.current.position.z = -162;
      if (ref.current.position.z < -162) ref.current.position.z = 162;
    } else {
      ref.current.position.x += speed * direction.sign * delta;
      if (ref.current.position.x > 162) ref.current.position.x = -162;
      if (ref.current.position.x < -162) ref.current.position.x = 162;
    }
  });

  const isZ = direction.axis === 'z';
  // Face the car in the correct direction
  const rotationY = isZ ? (direction.sign > 0 ? 0 : Math.PI) : (direction.sign > 0 ? Math.PI / 2 : -Math.PI / 2);

  return (
    <group ref={ref} position={startPos} rotation={[0, rotationY, 0]}>
      {/* Car Chassis (Body) */}
      <mesh castShadow position={[0, 0.4, 0]}>
        <boxGeometry args={[1.8, 0.5, 4.2]} />
        <meshPhysicalMaterial color={color} metalness={0.7} roughness={0.2} clearcoat={1.0} />
      </mesh>
      
      {/* Car Cabin (Glass/Windows) */}
      <mesh castShadow position={[0, 0.9, -0.2]}>
        <boxGeometry args={[1.6, 0.55, 2.2]} />
        <meshPhysicalMaterial color="#11151c" metalness={0.9} roughness={0.05} />
      </mesh>

      {/* 4 Wheels */}
      {[-1.2, 1.2].map((zPos, i) => 
        [-0.9, 0.9].map((xPos, j) => (
          <group key={`wheel-${i}-${j}`} position={[xPos, 0.25, zPos]}>
            <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.35, 0.35, 0.2, 16]} />
              <meshStandardMaterial color="#111" roughness={0.9} />
            </mesh>
            {/* Hubcaps */}
            <mesh position={[xPos > 0 ? 0.11 : -0.11, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.18, 0.18, 0.05, 16]} />
              <meshStandardMaterial color="#ccc" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        ))
      )}

      {/* Headlights */}
      <mesh position={[0.6, 0.45, 2.11]}>
        <boxGeometry args={[0.4, 0.2, 0.05]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.6, 0.45, 2.11]}>
        <boxGeometry args={[0.4, 0.2, 0.05]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      
      {/* Taillights */}
      <mesh position={[0.6, 0.45, -2.11]}>
        <boxGeometry args={[0.4, 0.15, 0.05]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      <mesh position={[-0.6, 0.45, -2.11]}>
        <boxGeometry args={[0.4, 0.15, 0.05]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
    </group>
  );
};

// Animated NPC (Pedestrian) with Walking Animation
const NPC = ({ startPos, direction, speed }: { startPos: [number, number, number], direction: { axis: 'x' | 'z', sign: number }, speed: number }) => {
  const ref = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Group>(null);
  const rightLeg = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);
  
  const offset = useRef(Math.random() * Math.PI * 2);
  const shirtColor = useRef(`hsl(${Math.random() * 360}, 60%, 40%)`);
  const pantsColor = useRef(`hsl(${Math.random() * 360}, 30%, 30%)`);
  const skinColor = useRef(['#fca5a5', '#fdba74', '#d4a373', '#8b5a2b', '#3e2723'][Math.floor(Math.random() * 5)]);
  
  useFrame((state, delta) => {
    if (!ref.current) return;
    const move = speed * direction.sign * delta;
    if (direction.axis === 'z') {
      ref.current.position.z += move;
      if (ref.current.position.z > 162) ref.current.position.z = -162;
      if (ref.current.position.z < -162) ref.current.position.z = 162;
    } else {
      ref.current.position.x += move;
      if (ref.current.position.x > 162) ref.current.position.x = -162;
      if (ref.current.position.x < -162) ref.current.position.x = 162;
    }
    
    // Walking animation kinematics
    const t = state.clock.elapsedTime * speed * 3 + offset.current;
    const swing = Math.sin(t);
    
    ref.current.position.y = Math.abs(swing) * 0.05; // Bobbing
    
    // Swing arms and legs
    if (leftLeg.current) leftLeg.current.rotation.x = swing * 0.6;
    if (rightLeg.current) rightLeg.current.rotation.x = -swing * 0.6;
    if (leftArm.current) leftArm.current.rotation.x = -swing * 0.5;
    if (rightArm.current) rightArm.current.rotation.x = swing * 0.5;
  });

  const isZ = direction.axis === 'z';
  const rotationY = isZ ? (direction.sign > 0 ? 0 : Math.PI) : (direction.sign > 0 ? Math.PI / 2 : -Math.PI / 2);

  return (
    <group ref={ref} position={startPos} rotation={[0, rotationY, 0]}>
      {/* Torso */}
      <mesh castShadow position={[0, 1.1, 0]}>
        <boxGeometry args={[0.5, 0.7, 0.3]} />
        <meshStandardMaterial color={shirtColor.current} roughness={0.9} />
      </mesh>
      
      {/* Head */}
      <mesh castShadow position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.2]} />
        <meshStandardMaterial color={skinColor.current} roughness={0.6} />
      </mesh>
      
      {/* Left Leg */}
      <group position={[-0.15, 0.75, 0]} ref={leftLeg}>
        <mesh castShadow position={[0, -0.35, 0]}>
          <boxGeometry args={[0.2, 0.7, 0.2]} />
          <meshStandardMaterial color={pantsColor.current} roughness={0.9} />
        </mesh>
      </group>
      
      {/* Right Leg */}
      <group position={[0.15, 0.75, 0]} ref={rightLeg}>
        <mesh castShadow position={[0, -0.35, 0]}>
          <boxGeometry args={[0.2, 0.7, 0.2]} />
          <meshStandardMaterial color={pantsColor.current} roughness={0.9} />
        </mesh>
      </group>
      
      {/* Left Arm */}
      <group position={[-0.35, 1.3, 0]} ref={leftArm}>
        <mesh castShadow position={[0, -0.3, 0]}>
          <boxGeometry args={[0.15, 0.6, 0.15]} />
          <meshStandardMaterial color={skinColor.current} roughness={0.6} />
        </mesh>
      </group>
      
      {/* Right Arm */}
      <group position={[0.35, 1.3, 0]} ref={rightArm}>
        <mesh castShadow position={[0, -0.3, 0]}>
          <boxGeometry args={[0.15, 0.6, 0.15]} />
          <meshStandardMaterial color={skinColor.current} roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
};

// Ground with highly detailed procedural roads
const Ground = () => {
  const roadTex = useMemo(() => generateRoadTexture(), []);

  return (
    <group position={[0, -0.01, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        {/* 324 is perfectly divisible by 18 grid blocks (18 * 18 = 324) */}
        <planeGeometry args={[324, 324]} />
        <meshStandardMaterial 
          map={roadTex} 
          roughness={0.9} 
          metalness={0.1}
        />
      </mesh>
    </group>
  );
};

const DroneMarker = ({ position, label, active = false }: { position: [number, number, number], label: string, active?: boolean }) => {
  return (
    <group position={position}>
      <mesh castShadow>
         <boxGeometry args={[1, 0.3, 1]} />
         <meshStandardMaterial color={active ? "#ffffff" : "#444444"} metalness={0.8} roughness={0.2} />
      </mesh>
      <ContactShadows position={[0, -position[1] + 0.1, 0]} opacity={0.6} scale={8} blur={2.5} far={position[1]} />
      <Html center position={[0, 2, 0]} className="ui-interactive" zIndexRange={[100, 0]}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', pointerEvents: 'none' }}>
           <div style={{ 
              background: active ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.8)', 
              color: active ? '#000' : '#fff',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.2)',
              whiteSpace: 'nowrap'
           }}>
              {label}
           </div>
        </div>
      </Html>
    </group>
  );
};

export const CityMap: React.FC = () => {
  // Generate the window texture once for all buildings to use
  const windowTexture = useMemo(() => generateWindowTexture(), []);

  // Generate dynamic traffic, pedestrians, and trees
  const traffic = useMemo(() => {
    const cars = [];
    const npcs = [];
    const trees = [];
    const carColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#ffffff', '#111827', '#6b7280'];
    
    // Spawn cars on roads (roads are at multiples of 18)
    for (let i = 0; i < 80; i++) {
      const isZ = Math.random() > 0.5;
      const roadCoord = (Math.floor(Math.random() * 18) - 9) * 18;
      const laneOffset = 1.8; // Distance from center line
      const sign = Math.random() > 0.5 ? 1 : -1;
      const startPos = Math.random() * 324 - 162;
      
      const x = isZ ? roadCoord + (sign * laneOffset) : startPos;
      const z = isZ ? startPos : roadCoord + (sign * laneOffset * -1); // Drive on right side

      cars.push({
        startPos: [x, 0, z] as [number, number, number],
        direction: { axis: isZ ? 'z' : 'x', sign },
        speed: Math.random() * 15 + 15,
        color: carColors[Math.floor(Math.random() * carColors.length)]
      });
    }

    // Spawn NPCs and Trees on sidewalks (offset by ~4.5 from road center)
    for (let i = 0; i < 150; i++) {
      const isZ = Math.random() > 0.5;
      const roadCoord = (Math.floor(Math.random() * 18) - 9) * 18;
      const side = Math.random() > 0.5 ? 4.5 : -4.5;
      const sign = Math.random() > 0.5 ? 1 : -1;
      const startPos = Math.random() * 324 - 162;
      
      const x = isZ ? roadCoord + side : startPos;
      const z = isZ ? startPos : roadCoord + side;

      npcs.push({
        startPos: [x, 0, z] as [number, number, number],
        direction: { axis: isZ ? 'z' : 'x', sign },
        speed: Math.random() * 2 + 1
      });
    }

    // Generate a sparse number of trees to avoid crashing WebGL
    for (let x = -108; x <= 108; x += 36) {
      for (let i = -108; i <= 108; i += 24) {
        if (Math.random() > 0.4) trees.push([x + 4.5, 0, i]);
        if (Math.random() > 0.4) trees.push([i, 0, x - 4.5]);
      }
    }

    return { cars, npcs, trees };
  }, []);

  const buildings = useMemo(() => {
    const blocks = [];
    const gridSize = 60; 
    
    for (let x = -gridSize; x <= gridSize; x += 6) {
      for (let z = -gridSize; z <= gridSize; z += 6) {
        
        // Roads
        if (x % 18 === 0 || z % 18 === 0) continue; 
        
        // Open lots
        if (Math.random() > 0.8) continue;

        const distFromCenter = Math.sqrt(x*x + z*z);
        
        // Downtown skyline profile
        const maxH = Math.max(4, 50 - distFromCenter * 0.9);
        const height = (Math.random() * maxH) + 5;
        
        // Width and depth
        const w = (Math.random() * 3) + 2.5;
        const d = (Math.random() * 3) + 2.5;
        
        blocks.push({
          position: [x, height / 2, z] as [number, number, number],
          scale: [w, height, d] as [number, number, number]
        });
      }
    }
    return blocks;
  }, []);

  return (
    <Canvas 
      shadows 
      className="canvas-container"
      style={{ width: '100vw', height: '100vh', display: 'block' }}
      gl={{ antialias: false, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
    >
      {/* Golden Hour / Sunset Lighting for extreme realism */}
      <Sky sunPosition={[100, 5, -50]} turbidity={0.6} rayleigh={1.5} mieCoefficient={0.005} mieDirectionalG={0.8} />
      <Environment preset="sunset" background={false} />
      
      <OrthographicCamera 
        makeDefault 
        position={[60, 60, 60]} 
        zoom={14} 
        near={-200} 
        far={300} 
      />
      
      <OrbitControls 
        enableRotate={true}
        enablePan={true}
        enableZoom={true}
        maxPolarAngle={Math.PI / 2 - 0.05}
        minPolarAngle={Math.PI / 8}
        target={[0, 0, 0]}
      />

      <ambientLight intensity={0.2} color="#404040" />
      <directionalLight 
        position={[100, 20, -50]} 
        intensity={4} 
        color="#ffebd6"
        castShadow 
        shadow-mapSize={[4096, 4096]} 
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
        shadow-bias={-0.001}
      />
      {/* Blue sky fill light for shadows */}
      <directionalLight position={[-50, 50, 50]} intensity={0.5} color="#87ceeb" />

      <Ground />

      {/* Render Trees */}
      {traffic.trees.map((t: any, i: number) => (
        <Tree key={`tree-${i}`} position={t as [number, number, number]} />
      ))}

      {/* Render Cars */}
      {traffic.cars.map((car: any, i: number) => (
        <Car key={`car-${i}`} {...car} />
      ))}

      {/* Render NPCs */}
      {traffic.npcs.map((npc: any, i: number) => (
        <NPC key={`npc-${i}`} {...npc} />
      ))}

      {buildings.map((b: any, i: number) => (
        <GlassBuilding key={i} position={b.position} scale={b.scale} windowTex={windowTexture} />
      ))}

      <DroneMarker position={[0, 45, 0]} label="AEC-4200-NYC" active={true} />
      <DroneMarker position={[20, 30, -20]} label="BAS-3100-NYC" />
      <DroneMarker position={[-30, 20, 15]} label="ICD-500-NYC" />
      <DroneMarker position={[40, 15, 25]} label="MME-9420-NYC" />

      {/* Cinematic Post-Processing */}
      <EffectComposer multisampling={4}>
        <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} intensity={0.8} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </Canvas>
  );
};
