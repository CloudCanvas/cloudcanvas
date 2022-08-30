import { Model } from "./model";

export const SampleData = (): Model => {
  return [
    {
      message: "Hey hoo. I'm a lambda function log. I live in the cloud.",
      timestamp: +new Date(),
      id: Math.random() + "",
    },
  ];
};
