const fs = require('fs');
let content = fs.readFileSync('src/components/OpenPlotsMap.tsx', 'utf8');

// 1. Add imports
content = content.replace(
  `import { OrthographicCamera, OrbitControls, Sky, Environment, MeshReflectorMaterial, SoftShadows, Stars } from '@react-three/drei';`,
  `import { OrthographicCamera, OrbitControls, Sky, Environment, MeshReflectorMaterial, SoftShadows, Stars, Line, Html } from '@react-three/drei';\nimport { Delaunay } from 'd3-delaunay';\nimport { useState } from 'react';`
);

// 2. Add Components
const componentsToAdd = `
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
            
            if (getTerrainHeight(xA, zA) > -1.0 && getTerrainHeight(xB, zB) > -1.0) {
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

export const OpenPlotsMap: React.FC = () => {`;
content = content.replace(`export const OpenPlotsMap: React.FC = () => {`, componentsToAdd);

// 3. Add state and voronoi logic
const stateAndLogic = `  const [sunRef, setSunRef] = React.useState<THREE.Mesh | null>(null);
  const [showPlotLines, setShowPlotLines] = useState(false);
  const [selectedPlot, setSelectedPlot] = useState<any>(null);
  
  const voronoiData = useMemo(() => {
    const seeds: [number, number][] = [];
    for(let i=0; i<300; i++) {
       const tx = (Math.random() - 0.5) * 600;
       const tz = (Math.random() - 0.5) * 600;
       if (getTerrainHeight(tx, tz) > -1.0) {
         seeds.push([tx, tz]);
       }
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
  };`;
content = content.replace(`  const [sunRef, setSunRef] = React.useState<THREE.Mesh | null>(null);`, stateAndLogic);

// 4. Update terrain mesh and add plot lines
const oldTerrain = `<mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow geometry={terrainGeo}>`;
const newTerrain = `<div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
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

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow geometry={terrainGeo} onClick={handleTerrainClick}>`;

// In order to wrap <Canvas> in <div>, I need to replace the whole <Canvas> tag.
content = content.replace(/<Canvas[\s\S]*?<ambientLight intensity=\{0.3\} color="#404040" \/>[\s\S]*?<directionalLight position=\{\[-50, 50, 50\]\} intensity=\{0.5\} color="#87ceeb" \/>[\s\S]*?<mesh rotation=\{\[-Math.PI \/ 2, 0, 0\]\} receiveShadow geometry=\{terrainGeo\}>/, newTerrain);

const addPlots = `      {showPlotLines && <ProceduralPlotLines voronoiData={voronoiData} />}
      {selectedPlot && showPlotLines && <PlotCallout key={selectedPlot.id} plot={selectedPlot} />}

      {/* Lake / Water Body`;
content = content.replace(`{/* Lake / Water Body`, addPlots);

// 5. Wrap closing tags and add UI
const closingTags = `      </EffectComposer>
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
};`;
content = content.replace(/<\/EffectComposer>\s*<\/Canvas>\s*\);\s*};/, closingTags);

fs.writeFileSync('src/components/OpenPlotsMap.tsx', content);
console.log("Injected open plots UI and lines successfully");
