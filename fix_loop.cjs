const fs = require('fs');

let content = fs.readFileSync('c:/Users/Asus/Documents/plotsystem/src/components/PlotModelMap.tsx', 'utf8');

const targetContent = `  const elements = useMemo(() => {
    const trees: any[] = [];
    const houses: any[] = [];
    const birds: any[] = [];
    
    // Spawn houses and dense trees along the procedural roads
    for (let x = -200; x <= 200; x += 12) {
      for (let z = -200; z <= 200; z += 12) {
        // Add some noise to the grid so houses aren't perfectly aligned
        const tx = x + (Math.random() - 0.5) * 6;
        const tz = z + (Math.random() - 0.5) * 6;
        const distToRoad = getDistanceToRoad(tx, tz);
        const ty = getTerrainHeight(tx, tz);
        
        // Spawn Dense Housing alongside the main roads
        if (distToRoad > 8 && distToRoad < 40) {
          if (Math.random() > 0.5) {
        // Determine type beforehand to check distance properly
        const rType = Math.random();
        let targetType = 'medieval';
        if (rType > 0.9) targetType = 'factory';
        else if (rType > 0.5) targetType = 'modern';

        const requiredRadius = targetType === 'factory' ? 22 : 12;

        const canPlace = houses.every((h: any) => {
           const hRadius = h.type === 'factory' ? 22 : 12;
           return Math.hypot(h.position[0] - tx, h.position[2] - tz) > (requiredRadius + hRadius);
        });

        if (canPlace) {
          if (Math.random() > 0.3) {
             houses.push({
               position: [tx, ty, tz] as [number, number, number],
               rotationY: Math.random() * Math.PI * 2,
               type: targetType
             });
          }
        }
          }
        }
        
        // Spawn Dense Trees further away from roads
        if (distToRoad > 12) {
           // Ensure trees don't spawn inside houses
           const noHouseOverlap = houses.every((h: any) => Math.hypot(h.position[0] - tx, h.position[2] - tz) > 8);
           if (noHouseOverlap && Math.random() > 0.6) {
             trees.push([tx, ty, tz]);
           }
        }
      }
    }`;

const replacementContent = `  const elements = useMemo(() => {
    const trees: any[] = [];
    const houses: any[] = [];
    const birds: any[] = [];
    
    // Pass 1: Randomly spawn massive factories across the map first
    for (let i = 0; i < 20; i++) {
      const tx = (Math.random() - 0.5) * 360;
      const tz = (Math.random() - 0.5) * 360;
      const distToRoad = getDistanceToRoad(tx, tz);
      
      // Factories need a lot of space, spawn them slightly away from main roads
      if (distToRoad > 15) {
        // Ensure factories don't overlap each other
        const canPlace = houses.every((h: any) => Math.hypot(h.position[0] - tx, h.position[2] - tz) > 50);
        if (canPlace) {
           houses.push({
             position: [tx, getTerrainHeight(tx, tz), tz] as [number, number, number],
             rotationY: Math.random() * Math.PI * 2,
             type: 'factory'
           });
        }
      }
    }

    // Pass 2: Spawn houses and dense trees along the procedural roads
    for (let x = -200; x <= 200; x += 12) {
      for (let z = -200; z <= 200; z += 12) {
        // Add some noise to the grid so houses aren't perfectly aligned
        const tx = x + (Math.random() - 0.5) * 6;
        const tz = z + (Math.random() - 0.5) * 6;
        const distToRoad = getDistanceToRoad(tx, tz);
        const ty = getTerrainHeight(tx, tz);
        
        // Spawn Dense Housing alongside the main roads
        if (distToRoad > 8 && distToRoad < 40) {
          // Check collision against BOTH existing houses AND the huge factories
          const canPlace = houses.every((h: any) => {
             const hRadius = h.type === 'factory' ? 28 : 12; // Factories need huge clearance
             return Math.hypot(h.position[0] - tx, h.position[2] - tz) > (12 + hRadius) / 2;
          });

          if (canPlace) {
            if (Math.random() > 0.3) {
               houses.push({
                 position: [tx, ty, tz] as [number, number, number],
                 rotationY: Math.random() * Math.PI * 2,
                 type: Math.random() > 0.5 ? 'medieval' : 'modern'
               });
            }
          }
        }
        
        // Spawn Dense Trees further away from roads
        if (distToRoad > 12) {
           // Trees must not spawn inside houses or factories
           const canPlaceTree = houses.every((h: any) => {
             const hRadius = h.type === 'factory' ? 24 : 8;
             return Math.hypot(h.position[0] - tx, h.position[2] - tz) > hRadius;
           });
           
           if (canPlaceTree && Math.random() > 0.6) {
             trees.push([tx, ty, tz]);
           }
        }
      }
    }`;

content = content.replace(targetContent, replacementContent);
fs.writeFileSync('c:/Users/Asus/Documents/plotsystem/src/components/PlotModelMap.tsx', content);
console.log("Replaced successfully!");
