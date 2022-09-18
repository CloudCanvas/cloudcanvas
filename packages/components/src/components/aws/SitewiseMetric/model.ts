export interface TimeSeriesData {
  from: Date;
  to: Date;
  values: { x: number; y: number }[];
}

export type Update = TimeSeriesData;
export type Model = TimeSeriesData;
