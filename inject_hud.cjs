const fs = require('fs');
let content = fs.readFileSync('src/components/PlotModelMap.tsx', 'utf8');

// 1. Add Html to drei imports
content = content.replace(
  "import { PerspectiveCamera, OrbitControls, Sky, Environment, SoftShadows } from '@react-three/drei';",
  "import { PerspectiveCamera, OrbitControls, Sky, Environment, SoftShadows, Html } from '@react-three/drei';"
);

// 2. Add PlotCallout component right before ProceduralPlotLines
const plotCalloutCode = `
const PlotCallout = ({ plot }: { plot: { id: number, x: number, y: number, z: number, area: number, type: string } }) => {
  const lineRef = useRef<any>(null);
  const [grown, setGrown] = React.useState(0);
  
  // Animate the line growing
  useFrame((state, delta) => {
    if (grown < 1) {
      setGrown(Math.min(1, grown + delta * 2));
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
  const geo = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <group>
      {/* The 3D Line */}
      <line geometry={geo}>
        <lineBasicMaterial color="#00ffff" linewidth={2} transparent opacity={0.8} />
      </line>

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
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{plot.type.toUpperCase()}</div>
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
`;
content = content.replace("const ProceduralPlotLines = ({ houses }: { houses: any[] }) => {", plotCalloutCode + "\nconst ProceduralPlotLines = ({ voronoiData }: { voronoiData: any }) => {\n  const { delaunay, seeds } = voronoiData;");

// 3. Update ProceduralPlotLines to use voronoiData instead of calculating it
const oldVoronoiCalc = `    // 2. Generate Voronoi Plots for houses and empty plots
    const seeds: [number, number][] = houses.map((h: any) => [h.position[0], h.position[2]]);
    
    // Add empty plot seeds
    for(let i=0; i<150; i++) {
       const tx = (Math.random() - 0.5) * 400;
       const tz = (Math.random() - 0.5) * 400;
       if (getDistanceToRoad(tx, tz) > 15) {
          seeds.push([tx, tz]);
       }
    }
    
    try {
      const delaunay = Delaunay.from(seeds);
      const voronoi = delaunay.voronoi([-200, -200, 200, 200]);`;

const newVoronoiCalc = `    // 2. Use parent-calculated Voronoi
    try {
      const voronoi = delaunay.voronoi([-200, -200, 200, 200]);`;
content = content.replace(oldVoronoiCalc, newVoronoiCalc);

// 4. Update the end of lineGeometry dependencies
content = content.replace("  }, [houses]);", "  }, [delaunay, seeds]);");

// 5. Add state and voronoiData to PlotModelMap
const oldPlotModelMapStart = `export const PlotModelMap: React.FC = () => {
  const [showPlotLines, setShowPlotLines] = React.useState(false);`;

const newPlotModelMapStart = `export const PlotModelMap: React.FC = () => {
  const [showPlotLines, setShowPlotLines] = React.useState(false);
  const [selectedPlot, setSelectedPlot] = React.useState<any>(null);`;
content = content.replace(oldPlotModelMapStart, newPlotModelMapStart);

// 6. Calculate voronoiData right after elements
const targetToInsertVoronoi = "  const terrainGeo = useMemo(() => {";
const voronoiDataCalc = `
  const voronoiData = useMemo(() => {
    const seeds: [number, number][] = elements.houses.map((h: any) => [h.position[0], h.position[2]]);
    for(let i=0; i<150; i++) {
       const tx = (Math.random() - 0.5) * 400;
       const tz = (Math.random() - 0.5) * 400;
       if (getDistanceToRoad(tx, tz) > 15) seeds.push([tx, tz]);
    }
    const delaunay = Delaunay.from(seeds);
    return { seeds, delaunay };
  }, [elements]);
  
  const handleTerrainClick = (e: any) => {
    if (!showPlotLines) return;
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

    setSelectedPlot({
      id: index + 1000,
      x: seed[0],
      y: getTerrainHeight(seed[0], seed[1]),
      z: seed[1],
      area,
      type
    });
  };

`;
content = content.replace(targetToInsertVoronoi, voronoiDataCalc + targetToInsertVoronoi);

// 7. Add onClick to terrain
content = content.replace(
  "<mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow geometry={terrainGeo}>",
  "<mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow geometry={terrainGeo} onClick={handleTerrainClick}>"
);

// 8. Render PlotCallout and update ProceduralPlotLines prop
content = content.replace(
  "{showPlotLines && <ProceduralPlotLines houses={elements.houses} />}",
  `{showPlotLines && <ProceduralPlotLines voronoiData={voronoiData} />}\n      {selectedPlot && showPlotLines && <PlotCallout key={selectedPlot.id} plot={selectedPlot} />}`
);

fs.writeFileSync('src/components/PlotModelMap.tsx', content);
console.log("HUD injected successfully!");
