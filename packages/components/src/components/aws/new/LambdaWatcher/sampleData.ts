import { Model } from "./model";

export const SampleData = (): Model => {
  return [
    {
      message: "Hey hoo. I'm a lambda function log. I live in the cloud.",
      at: +new Date(),
      id: Math.random() + "",
    },
  ];
};
