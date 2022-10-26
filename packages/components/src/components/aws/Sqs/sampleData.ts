import { Model } from "./model";

export const SampleData = (): Model => {
  return [
    {
      message: JSON.stringify({
        id: "1234",
        msgAttr1: "Important data",
        msgAttr2: "Not really",
      }),
      at: +new Date(),
    },
  ];
};
