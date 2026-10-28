import { useState } from 'react';
import type { FilterStatus, PlotData, PlotMap } from './types';
import { MAP_PALM_MEADOWS } from './data/plots';
import { MapContainer } from './components/MapContainer';
import { PlotOverlay } from './components/PlotOverlay';
import { HUD } from './components/HUD';
import { HoverHUD } from './components/HoverHUD';
import { DetailsDrawer } from './components/DetailsDrawer';
import { Logo } from './components/Logo';
import { PlotSwitcher } from './components/PlotSwitcher';

function App() {
  const [currentMap, setCurrentMap] = useState<PlotMap>(MAP_PALM_MEADOWS);
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('NONE');
  const [selectedPlot, setSelectedPlot] = useState<PlotData | null>(null);
  const [hoveredPlot, setHoveredPlot] = useState<PlotData | null>(null);

  const handlePlotClick = (plot: PlotData) => {
    setSelectedPlot(plot);
  };

  const handleCloseDrawer = () => {
    setSelectedPlot(null);
  };

  const handleSelectMap = (map: PlotMap) => {
    setCurrentMap(map);
    setSelectedPlot(null);
    setHoveredPlot(null);
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
          onPlotHover={setHoveredPlot}
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
