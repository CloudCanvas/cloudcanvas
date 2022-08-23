import { Credentials } from "@aws-sdk/types";

// AWS
export type AWSCredentials = Credentials & {
  identityId?: string;
};

export type AwsRegion =
  | "us-east-1"
  | "us-east-2"
  | "us-west-1"
  | "us-west-2"
  | "af-south-1"
  | "ap-east-1"
  | "ap-southeast-3"
  | "ap-south-1"
  | "ap-northeast-3"
  | "ap-northeast-2"
  | "ap-southeast-1"
  | "ap-southeast-2"
  | "ap-northeast-1"
  | "ca-central-1"
  | "eu-central-1"
  | "eu-west-1"
  | "eu-west-2";

// SSO

export type SSOSession = {
  startUrl: string;
  region: string;
  accessToken: string;
  expiresAt: Date;
};

export type AccessPair = {
  accountId: string;
  permissionSet: string;
};
