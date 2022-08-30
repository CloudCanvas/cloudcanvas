import { AccessProvider, AwsRegion } from "./aws";
import { CloudWatchClient } from "@aws-sdk/client-cloudwatch";
import { CloudWatchLogsClient } from "@aws-sdk/client-cloudwatch-logs";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBStreamsClient } from "@aws-sdk/client-dynamodb-streams";
import { LambdaClient } from "@aws-sdk/client-lambda";
import { S3Client } from "@aws-sdk/client-s3";

// Interface for accessing AWS across organisations, accounts and regions dynamically
export type AWS = {
  account: (account: string) => AWS;
  role: (account: string) => AWS;
  region: (region: AwsRegion) => AWS;
  accessProvider: AccessProvider;
  s3: S3Client;
  cloudwatch: CloudWatchClient;
  cloudwatchLogs: CloudWatchLogsClient;
  dynamodb: DynamoDBClient;
  dynamodbstreams: DynamoDBStreamsClient;
  lambda: LambdaClient;
};

export class UnauthorisedError extends Error {
  constructor(msg: string) {
    super(msg);

    this.name = "UnauthorisedError";

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, UnauthorisedError.prototype);
  }
}
export class InvalidConfigurationError extends Error {
  constructor(msg: string) {
    super(msg);

    this.name = "InvalidConfigurationError";

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, InvalidConfigurationError.prototype);
  }
}
