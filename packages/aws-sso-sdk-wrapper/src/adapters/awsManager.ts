import { AccessProvider, AWS, AwsRegion } from "@cloudcanvas/types";
import { createAWSProxy } from "./awsProxy";

type AWSPorts = {
  accessProvider: AccessProvider;
};

export type ClientProps = {
  accountId: string;
  region: AwsRegion;
  permissionSet: string;
};

export const createAWSClient = ({
  accessProvider,
}: AWSPorts): {
  aws: AWS;
} => {
  const proxy = createAWSProxy(accessProvider);

  return {
    aws: proxy,
  };
};
