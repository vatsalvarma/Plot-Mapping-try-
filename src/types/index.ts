export type PlotStatus = 'AVAILABLE' | 'BOOKED' | 'SOLD';

export interface PlotData {
  id: string;
  number: number;
  status: PlotStatus;
  points: string;
  area: string;
  price: string;
  dimensions: {
    n: string;
    s: string;
    e: string;
    w: string;
  };
  center: { x: number; y: number };
}

export type FilterStatus = 'NONE' | 'ALL' | PlotStatus;
