import type { PlotData, PlotMap } from '../types';

export const PLOTS_MOUNTAIN: PlotData[] = [
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

export const PLOTS_PALM_MEADOWS: PlotData[] = [
  {
    id: 'palm-201',
    number: 201,
    status: 'AVAILABLE',
    points: '616,649 878,514 1115,608 850,810',
    area: '6,500 sq.ft',
    price: '$320,000',
    dimensions: { n: '110ft', s: '120ft', e: '100ft', w: '95ft' },
    center: { x: 857, y: 678 }
  },
  {
    id: 'palm-202',
    number: 202,
    status: 'BOOKED',
    points: '428,525 700,435 878,514 605,645',
    area: '5,200 sq.ft',
    price: '$260,000',
    dimensions: { n: '90ft', s: '95ft', e: '85ft', w: '85ft' },
    center: { x: 648, y: 568 }
  },
  {
    id: 'palm-203',
    number: 203,
    status: 'AVAILABLE',
    points: '330,450 570,380 700,435 430,525',
    area: '5,000 sq.ft',
    price: '$245,000',
    dimensions: { n: '85ft', s: '90ft', e: '85ft', w: '80ft' },
    center: { x: 484, y: 485 }
  },
  {
    id: 'palm-204',
    number: 204,
    status: 'SOLD',
    points: '175,350 390,310 560,380 320,445',
    area: '4,800 sq.ft',
    price: '$235,000',
    dimensions: { n: '80ft', s: '85ft', e: '80ft', w: '75ft' },
    center: { x: 340, y: 406 }
  },
  {
    id: 'palm-205',
    number: 205,
    status: 'AVAILABLE',
    points: '100,290 265,260 390,305 170,345',
    area: '4,500 sq.ft',
    price: '$220,000',
    dimensions: { n: '75ft', s: '80ft', e: '75ft', w: '70ft' },
    center: { x: 220, y: 338 }
  },
  {
    id: 'palm-206',
    number: 206,
    status: 'AVAILABLE',
    points: '878,514 700,435 895,370 1065,420',
    area: '5,400 sq.ft',
    price: '$275,000',
    dimensions: { n: '95ft', s: '100ft', e: '90ft', w: '85ft' },
    center: { x: 883, y: 428 }
  },
  {
    id: 'palm-207',
    number: 207,
    status: 'BOOKED',
    points: '700,435 579,385 765,333 890,375',
    area: '5,100 sq.ft',
    price: '$255,000',
    dimensions: { n: '90ft', s: '95ft', e: '85ft', w: '85ft' },
    center: { x: 713, y: 356 }
  },
  {
    id: 'palm-208',
    number: 208,
    status: 'AVAILABLE',
    points: '570,380 465,340 638,300 755,330',
    area: '4,700 sq.ft',
    price: '$230,000',
    dimensions: { n: '85ft', s: '85ft', e: '80ft', w: '80ft' },
    center: { x: 558, y: 292 }
  },
  {
    id: 'palm-209',
    number: 209,
    status: 'SOLD',
    points: '475,339 335,285 490,255 645,300',
    area: '4,600 sq.ft',
    price: '$225,000',
    dimensions: { n: '80ft', s: '80ft', e: '75ft', w: '75ft' },
    center: { x: 418, y: 238 }
  },
  {
    id: 'palm-212',
    number: 212,
    status: 'BOOKED',
    points: '1005,330 1175,365 1300,300 1185,280',
    area: '4,100 sq.ft',
    price: '$205,000',
    dimensions: { n: '70ft', s: '70ft', e: '65ft', w: '65ft' },
    center: { x: 1313, y: 351 }
  },
  {
    id: 'palm-213',
    number: 213,
    status: 'SOLD',
    points: '1175,370 1380,415 1495,320 1310,300',
    area: '4,400 sq.ft',
    price: '$220,000',
    dimensions: { n: '75ft', s: '75ft', e: '70ft', w: '65ft' },
    center: { x: 1465, y: 407 }
  }
];

export const PLOTS_SUNSET_VALLEY: PlotData[] = [
  // West Lower Block (46, 47, 48)
  {
    id: 'sunset-46',
    number: 46,
    status: 'AVAILABLE',
    points: '480,492 635,485 632,540 465,545',
    area: '5,800 sq.ft',
    price: '$285,000',
    dimensions: { n: '80ft', s: '80ft', e: '60ft', w: '60ft' },
    center: { x: 560, y: 530 }
  },
  {
    id: 'sunset-47',
    number: 47,
    status: 'BOOKED',
    points: '465,545 630,540 625,617 443,623',
    area: '6,200 sq.ft',
    price: '$310,000',
    dimensions: { n: '80ft', s: '80ft', e: '70ft', w: '70ft' },
    center: { x: 560, y: 595 }
  },
  {
    id: 'sunset-48',
    number: 48,
    status: 'AVAILABLE',
    points: '442,622 625,620 620,685 425,705',
    area: '7,000 sq.ft',
    price: '$350,000',
    dimensions: { n: '80ft', s: '85ft', e: '85ft', w: '85ft' },
    center: { x: 550, y: 670 }
  },
  // South Central Block (36, 33, 35, 34)
  {
    id: 'sunset-36',
    number: 36,
    status: 'AVAILABLE',
    points: '780,459 912,460 920,583 772,585',
    area: '5,500 sq.ft',
    price: '$275,000',
    dimensions: { n: '75ft', s: '75ft', e: '65ft', w: '65ft' },
    center: { x: 840, y: 530 }
  },
  {
    id: 'sunset-33',
    number: 33,
    status: 'AVAILABLE',
    points: '912,460 1020,462 1040,583 918,583',
    area: '5,400 sq.ft',
    price: '$270,000',
    dimensions: { n: '70ft', s: '75ft', e: '65ft', w: '65ft' },
    center: { x: 980, y: 530 }
  },
  {
    id: 'sunset-35',
    number: 35,
    status: 'SOLD',
    points: '772,586 918,583 928,715 770,705',
    area: '6,800 sq.ft',
    price: '$340,000',
    dimensions: { n: '75ft', s: '80ft', e: '85ft', w: '85ft' },
    center: { x: 840, y: 640 }
  },
  {
    id: 'sunset-34',
    number: 34,
    status: 'BOOKED',
    points: '918,583 1040,583 1052,705 928,705',
    area: '6,700 sq.ft',
    price: '$335,000',
    dimensions: { n: '75ft', s: '80ft', e: '85ft', w: '85ft' },
    center: { x: 980, y: 640 }
  },
  // South East Block (3, 14, 15, 12, 11)
  {
    id: 'sunset-3',
    number: 3,
    status: 'AVAILABLE',
    points: '1140,462 1235,462 1275,572 1169,572',
    area: '4,800 sq.ft',
    price: '$240,000',
    dimensions: { n: '60ft', s: '60ft', e: '55ft', w: '55ft' },
    center: { x: 1195, y: 525 }
  },
  {
    id: 'sunset-14',
    number: 14,
    status: 'AVAILABLE',
    points: '1235,462 1330,462 1375,570 1275,572',
    area: '4,900 sq.ft',
    price: '$245,000',
    dimensions: { n: '60ft', s: '60ft', e: '55ft', w: '55ft' },
    center: { x: 1300, y: 525 }
  },
  {
    id: 'sunset-15',
    number: 15,
    status: 'SOLD',
    points: '1330,462 1410,462 1460,570 1375,570',
    area: '5,100 sq.ft',
    price: '$255,000',
    dimensions: { n: '60ft', s: '60ft', e: '55ft', w: '55ft' },
    center: { x: 1410, y: 525 }
  },
  {
    id: 'sunset-12',
    number: 12,
    status: 'BOOKED',
    points: '1170,572 1285,572 1312,655 1195,658',
    area: '6,600 sq.ft',
    price: '$330,000',
    dimensions: { n: '75ft', s: '80ft', e: '75ft', w: '75ft' },
    center: { x: 1200, y: 625 }
  },
  {
    id: 'sunset-11',
    number: 11,
    status: 'AVAILABLE',
    points: '1285,570 1460,570 1495,648 1312,655',
    area: '6,900 sq.ft',
    price: '$345,000',
    dimensions: { n: '80ft', s: '85ft', e: '75ft', w: '75ft' },
    center: { x: 1380, y: 625 }
  },
  // West Upper Block (41, 42, 43, 44)
  {
    id: 'sunset-41',
    number: 41,
    status: 'AVAILABLE',
    points: '585,180 680,169 679,210 570,218',
    area: '4,600 sq.ft',
    price: '$230,000',
    dimensions: { n: '75ft', s: '75ft', e: '40ft', w: '40ft' },
    center: { x: 630, y: 225 }
  },
  {
    id: 'sunset-42',
    number: 42,
    status: 'BOOKED',
    points: '570,218 680,210 675,260 550,267',
    area: '4,800 sq.ft',
    price: '$240,000',
    dimensions: { n: '75ft', s: '75ft', e: '45ft', w: '45ft' },
    center: { x: 625, y: 275 }
  },
  {
    id: 'sunset-43',
    number: 43,
    status: 'AVAILABLE',
    points: '550,268 674,260 673,315 532,320',
    area: '4,700 sq.ft',
    price: '$235,000',
    dimensions: { n: '75ft', s: '75ft', e: '40ft', w: '40ft' },
    center: { x: 620, y: 322 }
  },
  
  // North Central Block (28..37)
  {
    id: 'sunset-28a',
    number: 28,
    status: 'AVAILABLE',
    points: '795,155 879,148 880,185 794,190',
    area: '4,200 sq.ft',
    price: '$210,000',
    dimensions: { n: '60ft', s: '60ft', e: '35ft', w: '35ft' },
    center: { x: 850, y: 195 }
  },
  {
    id: 'sunset-28b',
    number: 28,
    status: 'AVAILABLE',
    points: '880,148 960,140 970,179 882,185',
    area: '4,200 sq.ft',
    price: '$210,000',
    dimensions: { n: '60ft', s: '60ft', e: '35ft', w: '35ft' },
    center: { x: 960, y: 195 }
  },
  {
    id: 'sunset-29a',
    number: 29,
    status: 'BOOKED',
    points: '794,189 880,185 883,225 792,228',
    area: '4,300 sq.ft',
    price: '$215,000',
    dimensions: { n: '60ft', s: '60ft', e: '35ft', w: '35ft' },
    center: { x: 850, y: 238 }
  },
  {
    id: 'sunset-29b',
    number: 29,
    status: 'AVAILABLE',
    points: '880,185 970,180 980,223 885,225',
    area: '4,300 sq.ft',
    price: '$215,000',
    dimensions: { n: '60ft', s: '60ft', e: '35ft', w: '35ft' },
    center: { x: 960, y: 238 }
  },
  {
    id: 'sunset-30',
    number: 30,
    status: 'AVAILABLE',
    points: '792,228 882,225 885,273 790,276',
    area: '4,400 sq.ft',
    price: '$220,000',
    dimensions: { n: '60ft', s: '60ft', e: '40ft', w: '40ft' },
    center: { x: 850, y: 284 }
  },
  {
    id: 'sunset-35b',
    number: 35,
    status: 'AVAILABLE',
    points: '881,225 978,224 990,270 885,273',
    area: '4,400 sq.ft',
    price: '$220,000',
    dimensions: { n: '60ft', s: '60ft', e: '40ft', w: '40ft' },
    center: { x: 960, y: 284 }
  },
  {
    id: 'sunset-31a',
    number: 31,
    status: 'SOLD',
    points: '790,275 885,273 887,323 789,323',
    area: '4,300 sq.ft',
    price: '$215,000',
    dimensions: { n: '60ft', s: '60ft', e: '35ft', w: '35ft' },
    center: { x: 850, y: 329 }
  },
  {
    id: 'sunset-31b',
    number: 31,
    status: 'AVAILABLE',
    points: '885,272 990,270 996,320 888,322',
    area: '4,300 sq.ft',
    price: '$215,000',
    dimensions: { n: '60ft', s: '60ft', e: '35ft', w: '35ft' },
    center: { x: 960, y: 329 }
  },
  {
    id: 'sunset-37',
    number: 37,
    status: 'AVAILABLE',
    points: '789,322 885,322 890,378 788,379',
    area: '4,100 sq.ft',
    price: '$205,000',
    dimensions: { n: '60ft', s: '60ft', e: '30ft', w: '30ft' },
    center: { x: 850, y: 368 }
  },
  {
    id: 'sunset-32',
    number: 32,
    status: 'BOOKED',
    points: '885,322 995,320 1000,378 890,378',
    area: '4,100 sq.ft',
    price: '$205,000',
    dimensions: { n: '60ft', s: '60ft', e: '30ft', w: '30ft' },
    center: { x: 960, y: 368 }
  },
  // North East Block (21..27 & 16..20)
  
  
  {
    id: 'sunset-26',
    number: 26,
    status: 'BOOKED',
    points: '1100,323 1215,325 1238,380 1112,380',
    area: '4,200 sq.ft',
    price: '$210,000',
    dimensions: { n: '55ft', s: '55ft', e: '35ft', w: '35ft' },
    center: { x: 1155, y: 332 }
  },
  {
    id: 'sunset-17',
    number: 17,
    status: 'AVAILABLE',
    points: '1218,325 1335,325 1368,383 1237,380',
    area: '4,600 sq.ft',
    price: '$230,000',
    dimensions: { n: '60ft', s: '65ft', e: '35ft', w: '35ft' },
    center: { x: 1285, y: 332 }
  },
  {
    id: 'sunset-25',
    number: 25,
    status: 'AVAILABLE',
    points: '1078,230 1174,225 1215,325 1100,323',
    area: '4,200 sq.ft',
    price: '$210,000',
    dimensions: { n: '55ft', s: '55ft', e: '35ft', w: '35ft' },
    center: { x: 1152, y: 288 }
  },
  {
    id: 'sunset-18',
    number: 18,
    status: 'SOLD',
    points: '1175,225 1274,225 1335,325 1214,325',
    area: '4,700 sq.ft',
    price: '$235,000',
    dimensions: { n: '60ft', s: '65ft', e: '35ft', w: '35ft' },
    center: { x: 1280, y: 288 }
  },
  {
    id: 'sunset-24',
    number: 24,
    status: 'AVAILABLE',
    points: '1050,155 1135,148 1172,225 1080,230',
    area: '4,300 sq.ft',
    price: '$215,000',
    dimensions: { n: '55ft', s: '55ft', e: '35ft', w: '35ft' },
    center: { x: 1150, y: 242 }
  },
  {
    id: 'sunset-19',
    number: 19,
    status: 'AVAILABLE',
    points: '1135,148 1225,146 1275,225 1175,225',
    area: '4,700 sq.ft',
    price: '$235,000',
    dimensions: { n: '60ft', s: '65ft', e: '35ft', w: '35ft' },
    center: { x: 1275, y: 242 }
  },
  {
    id: 'sunset-23',
    number: 23,
    status: 'BOOKED',
    points: '1038,125 1120,115 1138,148 1050,155',
    area: '4,300 sq.ft',
    price: '$215,000',
    dimensions: { n: '55ft', s: '55ft', e: '35ft', w: '35ft' },
    center: { x: 1150, y: 198 }
  },
  {
    id: 'sunset-20',
    number: 20,
    status: 'AVAILABLE',
    points: '1120,115 1198,110 1225,145 1138,150',
    area: '4,800 sq.ft',
    price: '$240,000',
    dimensions: { n: '60ft', s: '65ft', e: '35ft', w: '35ft' },
    center: { x: 1270, y: 198 }
  },
  // East Avenue (4, 2)
  {
    id: 'sunset-4',
    number: 4,
    status: 'AVAILABLE',
    points: '1530,465 1645,465 1710,555 1585,560',
    area: '5,200 sq.ft',
    price: '$260,000',
    dimensions: { n: '75ft', s: '80ft', e: '60ft', w: '60ft' },
    center: { x: 1640, y: 520 }
  },
  {
    id: 'sunset-2',
    number: 2,
    status: 'AVAILABLE',
    points: '1585,560 1710,555 1760,634 1635,639',
    area: '5,600 sq.ft',
    price: '$280,000',
    dimensions: { n: '80ft', s: '85ft', e: '70ft', w: '70ft' },
    center: { x: 1670, y: 605 }
  }
];

export const MAP_PALM_MEADOWS: PlotMap = {
  id: 'palm-meadows',
  name: 'Palm Meadows Layout',
  subtitle: 'Gated Community Residential Grid',
  badge: 'Fullscreen · 11 Plots',
  image: 'plot1.png',
  thumbnail: 'plot1.png',
  width: 1681,
  height: 936,
  enableMousePan: false,
  plots: PLOTS_PALM_MEADOWS
};

export const MAP_SUNSET_VALLEY: PlotMap = {
  id: 'sunset-valley',
  name: 'Sunset Valley Enclave',
  subtitle: 'Grand Master Planned Community',
  badge: 'Fullscreen · 38 Plots',
  image: 'plot2.png',
  thumbnail: 'plot2.png',
  width: 1983,
  height: 793,
  enableMousePan: false,
  plots: PLOTS_SUNSET_VALLEY
};

export const MAP_MOUNTAIN_PANORAMA: PlotMap = {
  id: 'mountain-panorama',
  name: 'Mountain View Panorama',
  subtitle: 'Master Hillside Estate Plan',
  badge: 'Interactive Pan · 6 Plots',
  image: 'map-bg.png',
  thumbnail: 'map-bg.png',
  width: 3840,
  height: 1080,
  enableMousePan: true,
  plots: PLOTS_MOUNTAIN
};

export const ALL_MAPS: PlotMap[] = [
  MAP_PALM_MEADOWS,
  MAP_SUNSET_VALLEY,
  MAP_MOUNTAIN_PANORAMA
];

export const PLOTS: PlotData[] = PLOTS_PALM_MEADOWS;
