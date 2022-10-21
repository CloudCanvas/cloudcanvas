import { Model } from "./model";

export const SampleData = (): Model => {
  return {
    from: new Date(+new Date() - 1000 * 60 * 60),
    to: new Date(),
    // x, y values spread out over the last hour every 5 mins
    values: Array.from({ length: 12 }, (_, i) => i * 5).map((i) => ({
      x: new Date(+new Date() - 1000 * 60 * 60 + 1000 * 60 * i),
      y: Math.random() * 100,
    })),
  };
};
