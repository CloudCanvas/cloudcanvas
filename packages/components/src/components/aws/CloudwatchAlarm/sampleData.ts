import { Model } from "./model";

export const SampleData = (): Model => {
  return {
    status: "ALARM",
    reason: "AWS Limit exceeded",
  };
};
