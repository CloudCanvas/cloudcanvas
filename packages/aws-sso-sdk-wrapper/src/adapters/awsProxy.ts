import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBStreamsClient } from "@aws-sdk/client-dynamodb-streams";
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

const awsServiceList = ["s3", "dynamodb", "dynamodbstreams"];

const clientForService = (service: string, props: any): any => {
  switch (service) {
    case "s3":
      return new S3Client(props);
    case "dynamodb":
      return new DynamoDBClient(props);
    case "dynamodbstreams":
      return new DynamoDBStreamsClient(props);
    default:
      throw new Error("Unsupported client: " + service);
  }
};
