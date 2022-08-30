import { CloudWatchClient } from "@aws-sdk/client-cloudwatch";
import { CloudWatchLogsClient } from "@aws-sdk/client-cloudwatch-logs";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBStreamsClient } from "@aws-sdk/client-dynamodb-streams";
import { LambdaClient } from "@aws-sdk/client-lambda";
import { S3Client } from "@aws-sdk/client-s3";
import { AccessPair, AccessProvider, AWS } from "@cloudcanvas/types";

type Execution = {
  account?: string;
  role?: string;
  region?: string;
  service?: string;
  send?: string;
  accessProvider?: string;
  isAccessProvider?: string;
  command?: any;
  ssoUrl?: string;
};

const awsServiceCatalog = [
  { service: "s3", client: S3Client },
  { service: "cloudwatch", client: CloudWatchClient },
  { service: "cloudwatchLogs", client: CloudWatchLogsClient },
  { service: "dynamodb", client: DynamoDBClient },
  { service: "dynamodbstreams", client: DynamoDBStreamsClient },
  { service: "lambda", client: LambdaClient },
];
const awsServiceList = awsServiceCatalog.map((a) => a.service);

export const createAWSProxy = (accessProvider: AccessProvider): AWS => {
  const execution: any = (
    chain: Partial<Execution>,
    executionStep?: keyof Execution | keyof AccessProvider
  ) => {
    return new Proxy(() => {}, {
      get(_target, prop): any {
        if (awsServiceList.includes(prop as string)) {
          return execution({ ...chain, service: prop }, prop);
        }

        if (prop === "accessProvider") {
          return execution({ ...chain, isAccessProvider: true }, prop);
        }

        return execution(chain, prop);
      },
      apply(_target, _thisArg, args) {
        const step = executionStep!;

        if (chain.isAccessProvider) {
          // @ts-ignore Nasty as f*ck!
          return accessProvider[executionStep](...args);
        }

        if (step !== "send") {
          return execution({
            ...chain,
            [step]: args[0],
          });
        }

        if (!chain.account || !chain.role) {
          throw new Error("No access provided");
        }

        let accessPair: AccessPair = {
          accountId: chain.account,
          permissionSet: chain.role,
        };

        // We do not force an SSO session refresh when we call the client libraries.
        // This ensures that the user is not unexpectedly presented a login screen.
        return accessProvider.lightAuthorise(accessPair).then((x) => {
          return clientForService(chain.service!, {
            credentials: x.credentials,
            region: chain.region! || x.defaultRegion,
          }).send(args[0]);
        });
      },
    });
  };

  return execution({}) as any;
};

const clientForService = (service: string, props: any): any => {
  const serviceCatalog = awsServiceCatalog.find(
    (asc) => asc.service === service
  );

  if (!serviceCatalog) {
    throw new Error("Unsupported client: " + service);
  }

  return new serviceCatalog.client(props);
};
