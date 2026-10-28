import { useState } from 'react';
import type { FilterStatus, PlotData, PlotMap } from './types';
import { ALL_MAPS } from './data/plots';
import { MapContainer } from './components/MapContainer';
import { PlotOverlay } from './components/PlotOverlay';
import { HUD } from './components/HUD';
import { HoverHUD } from './components/HoverHUD';
import { DetailsDrawer } from './components/DetailsDrawer';
import { Logo } from './components/Logo';
import { PlotSwitcher } from './components/PlotSwitcher';

function App() {
  const [currentMapId, setCurrentMapId] = useState<string>('palm-meadows');
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('NONE');
  const [selectedPlotId, setSelectedPlotId] = useState<string | null>(null);
  const [hoveredPlotId, setHoveredPlotId] = useState<string | null>(null);

  // Dynamically resolve current map so any code edit in plots.ts updates instantly via HMR without refresh!
  const currentMap = ALL_MAPS.find((m) => m.id === currentMapId) || ALL_MAPS[0];
  const selectedPlot = currentMap.plots.find((p) => p.id === selectedPlotId) || null;
  const hoveredPlot = currentMap.plots.find((p) => p.id === hoveredPlotId) || null;

  const handlePlotClick = (plot: PlotData) => {
    setSelectedPlotId(plot.id);
  };

  const handleCloseDrawer = () => {
    setSelectedPlotId(null);
  };

  const handleSelectMap = (map: PlotMap) => {
    setCurrentMapId(map.id);
    setSelectedPlotId(null);
    setHoveredPlotId(null);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background select-none">
      <Logo />

      {/* Top Right Change Plots Button with Dropdown Thumbnails */}
      <PlotSwitcher 
        currentMap={currentMap} 
        onSelectMap={handleSelectMap} 
      />

      {/* Background Map & Interactive Polygons */}
      <MapContainer currentMap={currentMap}>
        <PlotOverlay 
          currentMap={currentMap}
          activeFilter={activeFilter}
          selectedPlot={selectedPlot}
          onPlotClick={handlePlotClick}
          onPlotHover={(plot) => setHoveredPlotId(plot ? plot.id : null)}
        />
      </MapContainer>

      {/* Floating UI Elements */}
      <HoverHUD plot={hoveredPlot} />
      <HUD 
        activeFilter={activeFilter} 
        setActiveFilter={setActiveFilter} 
      />

      {/* Detailed Plot Drawer */}
      <DetailsDrawer 
        plot={selectedPlot} 
        onClose={handleCloseDrawer} 
      />
    </div>
  );
}

export default App;
