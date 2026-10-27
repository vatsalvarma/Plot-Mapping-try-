import type { PlotData } from '../types';

export const PLOTS: PlotData[] = [
  {
    id: '1',
    number: 101,
    status: 'AVAILABLE',
    points: '1468,270 1750,359 1760,530 1499,480',
    area: '4500 sq.ft',
    price: '$210,000',
    dimensions: { n: '80ft', s: '85ft', e: '50ft', w: '60ft' },
    center: { x: 1580, y: 440 }
  },
  {
    id: '2',
    number: 102,
    status: 'BOOKED',
    points: '1750,360 2185,510 2090,700 1770,600',
    area: '5200 sq.ft',
    price: '$250,000',
    dimensions: { n: '110ft', s: '100ft', e: '40ft', w: '50ft' },
    center: { x: 1940, y: 520 }
  },
  {
    id: '3',
    number: 103,
    status: 'AVAILABLE',
    points: '1500,480 1762,530 1790,805 1545,820',
    area: '6000 sq.ft',
    price: '$280,000',
    dimensions: { n: '85ft', s: '95ft', e: '120ft', w: '110ft' },
    center: { x: 1640, y: 640 }
  },
  {
    id: '4',
    number: 104,
    status: 'SOLD',
    points: '1770,600 2090,705 1890,1180 1840,1160',
    area: '4800 sq.ft',
    price: '$230,000',
    dimensions: { n: '100ft', s: '40ft', e: '110ft', w: '120ft' },
    center: { x: 1920, y: 660 }
  },
  {
    id: '5',
    number: 105,
    status: 'AVAILABLE',
    points: '1545,820 1793,805 1820,990 1580,1070',
    area: '5500 sq.ft',
    price: '$265,000',
    dimensions: { n: '90ft', s: '120ft', e: '70ft', w: '110ft' },
    center: { x: 1680, y: 880 }
  },
  {
    id: '7',
    number: 107,
    status: 'BOOKED',
    points: '2060,780 2300,850 2200,1090 1990,950',
    area: '5000 sq.ft',
    price: '$240,000',
    dimensions: { n: '75ft', s: '85ft', e: '110ft', w: '100ft' },
    center: { x: 2110, y: 860 }
  }
];
