const fs = require('fs');
let content = fs.readFileSync('src/components/PlotModelMap.tsx', 'utf8');

// 1. Update PlotCallout to display status
const oldPlotCalloutType = `const PlotCallout = ({ plot }: { plot: { id: number, x: number, y: number, z: number, area: number, type: string } }) => {`;
const newPlotCalloutType = `const PlotCallout = ({ plot }: { plot: { id: number, x: number, y: number, z: number, area: number, type: string, status: string } }) => {`;
content = content.replace(oldPlotCalloutType, newPlotCalloutType);

// Add Status to HUD Data
const oldZoningHUD = `<div style={{ fontSize: '14px', fontWeight: 'bold' }}>{plot.type.toUpperCase()}</div>`;
const newZoningHUD = `<div style={{ fontSize: '14px', fontWeight: 'bold' }}>{plot.type.toUpperCase()} ({plot.status})</div>`;
content = content.replace(oldZoningHUD, newZoningHUD);

// 2. Add showAvailability state
const oldState = `const [showPlotLines, setShowPlotLines] = React.useState(false);
  const [selectedPlot, setSelectedPlot] = React.useState<any>(null);`;
const newState = `const [showPlotLines, setShowPlotLines] = React.useState(false);
  const [showAvailability, setShowAvailability] = React.useState(false);
  const [selectedPlot, setSelectedPlot] = React.useState<any>(null);`;
content = content.replace(oldState, newState);

// 3. Update voronoiData useMemo to include statusArray
const oldVoronoiData = `  const voronoiData = useMemo(() => {
    const seeds: [number, number][] = elements.houses.map((h: any) => [h.position[0], h.position[2]]);
    for(let i=0; i<150; i++) {
       const tx = (Math.random() - 0.5) * 400;
       const tz = (Math.random() - 0.5) * 400;
       if (getDistanceToRoad(tx, tz) > 15) seeds.push([tx, tz]);
    }
    const delaunay = Delaunay.from(seeds);
    return { seeds, delaunay };
  }, [elements]);`;

const newVoronoiData = `  const voronoiData = useMemo(() => {
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
      if (status === 'AVAILABLE') ctx.fillStyle = 'rgba(76, 175, 80, 0.4)'; // Green
      else if (status === 'BOOKED') ctx.fillStyle = 'rgba(255, 152, 0, 0.4)'; // Orange
      else ctx.fillStyle = 'rgba(244, 67, 54, 0.4)'; // Red
      
      ctx.fill();
      
      // Thin boundary line
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Erase the roads using destination-out
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 18 * 2.56; // Road width is ~6.5 radius = 13 diameter. Extra margin.
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Road 1
    ctx.beginPath();
    for (let x = -200; x <= 200; x += 2) {
      const z = Math.sin(x * 0.02) * 80 + Math.cos(x * 0.01) * 40;
      const cx = (x + 200) * 2.56;
      const cy = (z + 200) * 2.56;
      if (x === -200) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    }
    ctx.stroke();

    // Road 2
    ctx.beginPath();
    for (let z = -200; z <= 200; z += 2) {
      const x = Math.sin(z * 0.03) * 60 + Math.cos(z * 0.015) * 20;
      const cx = (x + 200) * 2.56;
      const cy = (z + 200) * 2.56;
      if (z === -200) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    }
    ctx.stroke();
    
    ctx.globalCompositeOperation = 'source-over';
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    texture.anisotropy = 4;
    return texture;
  }, [voronoiData]);`;
content = content.replace(oldVoronoiData, newVoronoiData);

// 4. Update handleTerrainClick to pass status
const oldSetSelectedPlot = `    setSelectedPlot({
      id: index + 1000,
      x: seed[0],
      y: getTerrainHeight(seed[0], seed[1]),
      z: seed[1],
      area,
      type
    });`;
const newSetSelectedPlot = `    const status = voronoiData.statusArray[index];
    setSelectedPlot({
      id: index + 1000,
      x: seed[0],
      y: getTerrainHeight(seed[0], seed[1]),
      z: seed[1],
      area,
      type,
      status
    });`;
content = content.replace(oldSetSelectedPlot, newSetSelectedPlot);

// 5. Add Availability mesh overlay and UI toggle
const targetMeshLocation = `{/* Plot Boundaries Overlay */}
      {showPlotLines && <ProceduralPlotLines voronoiData={voronoiData} />}
      {selectedPlot && showPlotLines && <PlotCallout key={selectedPlot.id} plot={selectedPlot} />}`;

const overlayMesh = `      {/* Availability Canvas Overlay */}
      {showAvailability && availabilityTexture && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.25, 0]} geometry={terrainGeo}>
          <meshBasicMaterial map={availabilityTexture} transparent depthWrite={false} />
        </mesh>
      )}

      {/* Plot Boundaries Overlay */}
      {(showPlotLines || showAvailability) && <ProceduralPlotLines voronoiData={voronoiData} />}
      {selectedPlot && (showPlotLines || showAvailability) && <PlotCallout key={selectedPlot.id} plot={selectedPlot} />}`;
content = content.replace(targetMeshLocation, overlayMesh);

const oldUI = `    {/* UI Overlay: Plot Lines Toggle */}
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
    </div>`;

const newUI = `    {/* UI Overlay: Toggles */}
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
    )}`;
content = content.replace(oldUI, newUI);

// Fix click handler to respond to both
content = content.replace(`if (!showPlotLines) return;`, `if (!showPlotLines && !showAvailability) return;`);


fs.writeFileSync('src/components/PlotModelMap.tsx', content);
console.log("Availability injected successfully!");
