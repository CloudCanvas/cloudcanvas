import { AccessProvider, AWS, AwsRegion } from "@cloudcanvas/types";
import { S3Helper } from "../ports/s3Helper";
import { StreamManager } from "../ports/streamManager";
import { createAWSProxy } from "./awsProxy";
import { makeDynamoDbStreamManager } from "./dynamoDbStreamManager";
import { makeS3Helper } from "./s3Helper";

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
  s3Helper: S3Helper;
  createDynamoStreamManager: (
    props: ClientProps & { tableName: string }
  ) => StreamManager;
} => {
  const proxy = createAWSProxy(accessProvider);

  return {
    aws: proxy,
    s3Helper: makeS3Helper({ aws: proxy }),
    createDynamoStreamManager: (props) =>
      makeDynamoDbStreamManager({ aws: proxy, ...props }),
  };
};
