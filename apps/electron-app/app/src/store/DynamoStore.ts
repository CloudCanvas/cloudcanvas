import {
  AccessCard,
  AccessPair,
  AwsRegion,
} from "@cloudcanvas/aws-sso-sdk-wrapper";
import { ListTablesCommand } from "@aws-sdk/client-dynamodb";
import { makeAutoObservable, runInAction } from "mobx";
import { AwsClient } from "../ports/aws";

const makeTableKey = (props: AccessPair) =>
  `${props.accountId}-${props.permissionSet}`;

export class DynamoStore {
  tableNameDict: {
    [accountIdAndRole: string]: string[]; // tables for this account and role
  } = {};

  constructor(private awsClient: AwsClient) {
    makeAutoObservable(this);
  }

  fetchTables = async (props: AccessCard): Promise<string[]> => {
    const key = makeTableKey(props);
    if (this.tableNameDict[key]) {
      return this.tableNameDict[key];
    }

    return await this.refreshTablesForAccount(props);
  };

  refreshTablesForAccount = async (props: {
    accountId: string;
    permissionSet: string;
    region: AwsRegion;
  }): Promise<string[]> => {
    const key = makeTableKey(props);

    const tables: string[] = [];
    let iteratorToken: any;

    do {
      const resp = await this.awsClient.aws
        .account(props.accountId)
        .role(props.permissionSet)
        .region(props.region)
        .dynamodb.send(
          new ListTablesCommand({
            ExclusiveStartTableName: iteratorToken,
            Limit: 100,
          })
        );

      iteratorToken = resp.LastEvaluatedTableName;
      tables.push(...(resp.TableNames || []));
    } while (iteratorToken);

    runInAction(() => (this.tableNameDict[key] = tables));

    return tables;
  };
}
