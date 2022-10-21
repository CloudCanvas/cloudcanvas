import { AWS } from "cloudcanvas-types";

export type AWSManager = {
  init: () => Promise<AWS>;
};
