import { AWS } from "../domain/aws";

export type AWSManager = {
  init: () => Promise<AWS>;
};
