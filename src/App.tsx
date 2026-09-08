import { useState } from 'react';
import { CityMap } from './components/CityMap';
import { OpenPlotsMap } from './components/OpenPlotsMap';
import { PlotModelMap } from './components/PlotModelMap';
import { HUD } from './components/HUD';
import './App.css';

export interface BuildingData {
  id: string;
  name: string;
  power: number;
  session: string;
  signal: 'STRONG' | 'MODERATE' | 'WEAK';
  health: number;
  position: [number, number, number];
  scale: [number, number, number];
}

export type ViewMode = 'CITY' | 'PLOTS' | 'PLOT_MODEL';

function App() {
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingData | null>(null);
  const [activeView, setActiveView] = useState<ViewMode>('CITY');

  return (
    <div className="app-container">
      {/* 3D WebGL Canvas Layer */}
      {activeView === 'CITY' && <CityMap onSelectBuilding={setSelectedBuilding} />}
      {activeView === 'PLOTS' && <OpenPlotsMap />}
      {activeView === 'PLOT_MODEL' && <PlotModelMap />}
      
      {/* HTML UI Overlay Layer */}
      <HUD 
        selectedBuilding={selectedBuilding}
        activeView={activeView}
        setActiveView={setActiveView}
      />
    </div>
  );
}

export default App;
