import { DynamoWatcherModel } from "@cloudcanvas/components/lib/components/aws/model";
import {
  AccessCard,
  StreamManager,
  makeDynamoDbStreamManager,
} from "@cloudcanvas/aws-sso-sdk-wrapper";
import { makeAutoObservable } from "mobx";
import { AwsClient } from "../ports/aws";

const makeTableKey = (props: AccessCard & { tableName: string }) =>
  `${props.accountId}-${props.permissionSet}-${props.region}-${props.tableName}`;

export class DynamoStreamStore {
  streamManagerDict: {
    [key: string]: {
      streamManager: StreamManager;
      lastAccess: Date;
    };
  } = {};

  constructor(private awsClient: AwsClient) {
    makeAutoObservable(this, {
      streamManagerDict: false,
    });
  }

  fetchRecords = async (
    props: AccessCard & { tableName: string }
  ): Promise<DynamoWatcherModel> => {
    const key = makeTableKey(props);

    const twoHoursAgo = new Date(+new Date() - 3600000 * 2);

    // If it has not been called for an hour then ditch the last stream
    // TODO Notify the customer of the reset
    if (
      !this.streamManagerDict[key] ||
      this.streamManagerDict[key].lastAccess < twoHoursAgo
    ) {
      this.streamManagerDict[key] = {
        streamManager: makeDynamoDbStreamManager({
          ...props,
          aws: this.awsClient.aws,
        }),
        lastAccess: new Date(),
      };
    } else {
      this.streamManagerDict[key] = {
        streamManager: this.streamManagerDict[key].streamManager,
        lastAccess: new Date(),
      };
    }

    const newRecords = await this.streamManagerDict[
      key
    ].streamManager.fetchRecords();

    return newRecords.map((r) => ({ ...r, id: Math.random() + "" }));
  };
}
