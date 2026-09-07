export type PlotStatus = 'AVAILABLE' | 'BOOKED' | 'SOLD';

export interface PlotData {
  id: string;
  number: number;
  status: PlotStatus;
  area: string;
  dimensions: {
    n: string;
    s: string;
    e: string;
    w: string;
  };
  price: string;
  points: string; 
  center: { x: number; y: number }; 
}

// Generate organic, irregular polygons for plots
export const mockPlots: PlotData[] = [
  {
    id: 'plot-1', number: 1, status: 'AVAILABLE', area: '3200 sq.ft',
    dimensions: { n: '45 ft', s: '50 ft', e: '68 ft', w: '62 ft' }, price: '$150,000',
    points: '200,400 350,380 370,550 180,520', center: { x: 275, y: 462 }
  },
  {
    id: 'plot-2', number: 2, status: 'BOOKED', area: '2900 sq.ft',
    dimensions: { n: '50 ft', s: '48 ft', e: '60 ft', w: '58 ft' }, price: '$140,000',
    points: '350,380 500,360 480,510 370,550', center: { x: 425, y: 450 }
  },
  {
    id: 'plot-3', number: 3, status: 'SOLD', area: '3500 sq.ft',
    dimensions: { n: '60 ft', s: '55 ft', e: '70 ft', w: '65 ft' }, price: '$170,000',
    points: '500,360 680,340 660,490 480,510', center: { x: 580, y: 425 }
  },
  {
    id: 'plot-4', number: 4, status: 'AVAILABLE', area: '2800 sq.ft',
    dimensions: { n: '42 ft', s: '40 ft', e: '65 ft', w: '60 ft' }, price: '$135,000',
    points: '680,340 820,330 840,480 660,490', center: { x: 750, y: 410 }
  },
  {
    id: 'plot-5', number: 5, status: 'AVAILABLE', area: '3100 sq.ft',
    dimensions: { n: '55 ft', s: '50 ft', e: '60 ft', w: '65 ft' }, price: '$145,000',
    points: '820,330 960,310 980,450 840,480', center: { x: 900, y: 392 }
  },
  // Row 2 (Below a winding "road" gap)
  {
    id: 'plot-6', number: 6, status: 'SOLD', area: '4000 sq.ft',
    dimensions: { n: '65 ft', s: '70 ft', e: '60 ft', w: '55 ft' }, price: '$190,000',
    points: '220,620 380,590 410,750 250,780', center: { x: 315, y: 685 }
  },
  {
    id: 'plot-7', number: 7, status: 'AVAILABLE', area: '3800 sq.ft',
    dimensions: { n: '60 ft', s: '62 ft', e: '64 ft', w: '60 ft' }, price: '$180,000',
    points: '380,590 530,560 550,720 410,750', center: { x: 467, y: 655 }
  },
  {
    id: 'plot-8', number: 8, status: 'BOOKED', area: '3400 sq.ft',
    dimensions: { n: '55 ft', s: '50 ft', e: '65 ft', w: '62 ft' }, price: '$165,000',
    points: '530,560 690,530 700,680 550,720', center: { x: 617, y: 622 }
  },
  {
    id: 'plot-9', number: 9, status: 'AVAILABLE', area: '3300 sq.ft',
    dimensions: { n: '50 ft', s: '48 ft', e: '68 ft', w: '65 ft' }, price: '$160,000',
    points: '690,530 850,510 870,660 700,680', center: { x: 777, y: 595 }
  },
  {
    id: 'plot-10', number: 10, status: 'AVAILABLE', area: '3600 sq.ft',
    dimensions: { n: '58 ft', s: '60 ft', e: '62 ft', w: '64 ft' }, price: '$175,000',
    points: '850,510 1010,480 1030,640 870,660', center: { x: 940, y: 572 }
  },
  // Curve elements (Irregular shapes)
  {
    id: 'plot-11', number: 11, status: 'AVAILABLE', area: '4500 sq.ft',
    dimensions: { n: '75 ft', s: '65 ft', e: '80 ft', w: '50 ft' }, price: '$220,000',
    points: '1010,480 1150,430 1180,600 1030,640', center: { x: 1092, y: 537 }
  },
  {
    id: 'plot-12', number: 12, status: 'SOLD', area: '4200 sq.ft',
    dimensions: { n: '70 ft', s: '68 ft', e: '75 ft', w: '60 ft' }, price: '$210,000',
    points: '1150,430 1300,380 1330,550 1180,600', center: { x: 1240, y: 490 }
  },
  {
    id: 'plot-13', number: 13, status: 'BOOKED', area: '3900 sq.ft',
    dimensions: { n: '65 ft', s: '60 ft', e: '68 ft', w: '55 ft' }, price: '$195,000',
    points: '1300,380 1450,340 1470,510 1330,550', center: { x: 1387, y: 445 }
  },
  {
    id: 'plot-14', number: 14, status: 'AVAILABLE', area: '4100 sq.ft',
    dimensions: { n: '68 ft', s: '65 ft', e: '72 ft', w: '60 ft' }, price: '$205,000',
    points: '1450,340 1600,300 1620,470 1470,510', center: { x: 1535, y: 405 }
  },
  {
    id: 'plot-15', number: 15, status: 'AVAILABLE', area: '3700 sq.ft',
    dimensions: { n: '60 ft', s: '58 ft', e: '65 ft', w: '62 ft' }, price: '$185,000',
    points: '1600,300 1750,270 1780,440 1620,470', center: { x: 1687, y: 370 }
  }
];
