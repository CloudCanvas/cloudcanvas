export interface TimeSeriesData {
  from: Date;
  to: Date;
  values: { x: Date; y: number }[];
}

export type Update = TimeSeriesData;
export type Model = TimeSeriesData;
