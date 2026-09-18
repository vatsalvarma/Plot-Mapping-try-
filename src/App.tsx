import React, { useState } from 'react';
import type { FilterStatus, PlotData } from './types';
import { MapContainer } from './components/MapContainer';
import { PlotOverlay } from './components/PlotOverlay';
import { HUD } from './components/HUD';
import { HoverHUD } from './components/HoverHUD';
import { DetailsDrawer } from './components/DetailsDrawer';
import { Logo } from './components/Logo';

function App() {
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('NONE');
  const [selectedPlot, setSelectedPlot] = useState<PlotData | null>(null);
  const [hoveredPlot, setHoveredPlot] = useState<PlotData | null>(null);

  const handlePlotClick = (plot: PlotData) => {
    setSelectedPlot(plot);
  };

  const handleCloseDrawer = () => {
    setSelectedPlot(null);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background">
      <Logo />
      {/* Background Map & Interactive Polygons */}
      <MapContainer>
        <PlotOverlay 
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
