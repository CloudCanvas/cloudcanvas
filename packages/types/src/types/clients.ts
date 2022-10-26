import { AccessProvider, AwsRegion } from "./aws";
import { CloudWatchClient } from "@aws-sdk/client-cloudwatch";
import { CloudWatchLogsClient } from "@aws-sdk/client-cloudwatch-logs";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBStreamsClient } from "@aws-sdk/client-dynamodb-streams";
import { IoTSiteWiseClient } from "@aws-sdk/client-iotsitewise";
import { LambdaClient } from "@aws-sdk/client-lambda";
import { SQSClient } from "@aws-sdk/client-sqs";

// Interface for accessing AWS across organisations, accounts and regions dynamically
export type AWS = {
  account: (account: string) => AWS;
  role: (account: string) => AWS;
  region: (region: AwsRegion) => AWS;
  accessProvider: AccessProvider;
  sqs: SQSClient;
  cloudwatch: CloudWatchClient;
  cloudwatchLogs: CloudWatchLogsClient;
  dynamodb: DynamoDBClient;
  dynamodbstreams: DynamoDBStreamsClient;
  lambda: LambdaClient;
  iotsitewise: IoTSiteWiseClient;
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
