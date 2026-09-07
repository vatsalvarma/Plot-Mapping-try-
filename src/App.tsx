import { CityMap } from './components/CityMap';
import { HUD } from './components/HUD';
import './App.css';

function App() {
  return (
    <div className="app-container">
      {/* 3D WebGL Canvas Layer */}
      <CityMap />
      
      {/* HTML UI Overlay Layer */}
      <HUD />
    </div>
  );
}

export default App;
