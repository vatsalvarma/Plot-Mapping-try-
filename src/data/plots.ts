import type { PlotData } from '../types';

export const PLOTS: PlotData[] = [
  {
    id: '1',
    number: 101,
    status: 'AVAILABLE',
    points: '1420,310 1730,390 1780,550 1490,510',
    area: '4500 sq.ft',
    price: '$210,000',
    dimensions: { n: '80ft', s: '85ft', e: '50ft', w: '60ft' },
    center: { x: 1580, y: 440 }
  },
  {
    id: '2',
    number: 102,
    status: 'BOOKED',
    points: '1730,390 2150,500 2110,640 1780,550',
    area: '5200 sq.ft',
    price: '$250,000',
    dimensions: { n: '110ft', s: '100ft', e: '40ft', w: '50ft' },
    center: { x: 1940, y: 520 }
  },
  {
    id: '3',
    number: 103,
    status: 'AVAILABLE',
    points: '1490,510 1780,550 1770,760 1520,730',
    area: '6000 sq.ft',
    price: '$280,000',
    dimensions: { n: '85ft', s: '95ft', e: '120ft', w: '110ft' },
    center: { x: 1640, y: 640 }
  },
  {
    id: '4',
    number: 104,
    status: 'SOLD',
    points: '1780,550 2110,640 2050,710 1770,760',
    area: '4800 sq.ft',
    price: '$230,000',
    dimensions: { n: '100ft', s: '40ft', e: '110ft', w: '120ft' },
    center: { x: 1920, y: 660 }
  },
  {
    id: '5',
    number: 105,
    status: 'AVAILABLE',
    points: '1520,730 1770,760 1850,990 1600,1070',
    area: '5500 sq.ft',
    price: '$265,000',
    dimensions: { n: '90ft', s: '120ft', e: '70ft', w: '110ft' },
    center: { x: 1680, y: 880 }
  },
  {
    id: '6',
    number: 106,
    status: 'AVAILABLE',
    points: '1770,760 2050,710 1980,950 1850,990',
    area: '4200 sq.ft',
    price: '$195,000',
    dimensions: { n: '80ft', s: '60ft', e: '90ft', w: '100ft' },
    center: { x: 1900, y: 850 }
  },
  {
    id: '7',
    number: 107,
    status: 'BOOKED',
    points: '2050,710 2280,750 2150,1080 1980,950',
    area: '5000 sq.ft',
    price: '$240,000',
    dimensions: { n: '75ft', s: '85ft', e: '110ft', w: '100ft' },
    center: { x: 2110, y: 860 }
  }
];
