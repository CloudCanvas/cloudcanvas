import { CustomData } from "../../form/v1";
import { AWS } from "cloudcanvas-types";

export const customDataFetcher = async (aws: AWS): Promise<CustomData[]> => {
  return [
    {
      label: "Default",
      value: "Default",
    },
  ];
};
