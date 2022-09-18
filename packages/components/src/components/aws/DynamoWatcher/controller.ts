import { AWS } from "@cloudcanvas/types";
import {
  ListStreamsCommand,
  GetShardIteratorCommand,
  DescribeStreamCommand,
  GetRecordsCommand,
  GetRecordsCommandOutput,
  OperationType,
} from "@aws-sdk/client-dynamodb-streams";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { ShardIterator } from "aws-sdk/clients/dynamodbstreams";
import { DynamoRecord, Model, Update } from "./model";
import { DataFetcher } from "../../../ports/DataFetcher";
import { CustomData } from "../../form";
import BaseLogModel from "../shared/BaseModel";

const doLog = false;

const log = (msg: any) => {
  if (doLog) {
    log(msg);
  }
};

type Config<T, U> = Pick<DataFetcher<T, U>, "initialData"> & {
  customData: CustomData;
};

type Props<T, U> = {
  config: Config<T, U>;
  ports: {
    aws: AWS;
  };
};

type StreamManager = {
  fetchRecords: () => Promise<DynamoRecord[]>;
  reset: () => Promise<void>;
};

type Ports = {
  aws: AWS;
};

export type StreamConfig = {
  tableName: string;
  initialCalls?: number;
};

const makeDynamoDbStreamManager = ({
  aws,
  tableName,
  initialCalls,
}: Ports & StreamConfig): StreamManager => {
  let shardOffset: string | undefined = undefined;
  let streamArn: string | undefined = undefined;
  let initialCall = true;

  let shardDict: {
    [shardId: string]: {
      shardIterator?: ShardIterator;
      deleted?: boolean;
    };
  } = {};

  let deletedShards: {
    [shardId: string]: {};
  } = {};

  const client = aws.dynamodbstreams;

  const trimShards = () => {
    let shardIds = Object.keys(shardDict);

    for (const shardId of shardIds) {
      if (!shardDict[shardId].shardIterator) {
        console.log("deleting shard");
        deletedShards[shardId] = {};
        delete shardDict[shardId];
      }
    }
  };

  // At the start we want to fetch more times in a loop to flush the shards
  const fetchRecords = async (shardId: string, times: number) => {
    let shardIterator = shardDict[shardId].shardIterator;
    let loops = times;
    let records: GetRecordsCommandOutput["Records"] = [];
    do {
      const resp = await client.send(
        new GetRecordsCommand({
          ShardIterator: shardIterator,
          Limit: 1000,
        })
      );

      shardIterator = resp.NextShardIterator;
      records = [...records, ...(resp.Records || [])];
      loops--;
    } while (shardIterator && loops > 0);

    return {
      nextIterator: shardIterator,
      records,
      shardId,
    };
  };

  return {
    fetchRecords: async () => {
      // Instantiate the stream for the table if not already done
      if (!streamArn) {
        streamArn = (
          await client.send(
            new ListStreamsCommand({
              TableName: tableName,
            })
          )
        )?.Streams?.[0]?.StreamArn;

        if (!streamArn) throw new Error(`No stream arn on table ${tableName}`);
      }

      // Fetch all shards on the table using last executed shard offset
      const shards = await client.send(
        new DescribeStreamCommand({
          StreamArn: streamArn,
          ExclusiveStartShardId: shardOffset,
        })
      );

      // Populate new shards with empty iterator
      for (const shard of shards.StreamDescription?.Shards || []) {
        const shardId = shard.ShardId;
        if (!shardId) continue;

        if (shardDict[shardId]) continue;
        if (deletedShards[shardId]) continue;

        console.log(`Adding new shard`);
        shardDict[shardId] = {};
      }

      // Save shard offset
      shardOffset = shards.StreamDescription!.LastEvaluatedShardId;

      // Get shard iterator for new shards
      await Promise.all(
        Object.keys(shardDict).map(async (shardId) => {
          if (shardDict[shardId].shardIterator) {
            return;
          }
          const iterator = await client.send(
            new GetShardIteratorCommand({
              ShardId: shardId,
              ShardIteratorType: "LATEST",
              StreamArn: streamArn,
            })
          );

          shardDict[shardId].shardIterator = iterator.ShardIterator;
        })
      );

      //   For all shard iterators fetch new records
      const responses = await Promise.all(
        Object.keys(shardDict).map((shardId) => {
          // We're adding room here to flushg through some shards at the start if we need
          return fetchRecords(shardId, initialCall ? initialCalls || 2 : 1);
        })
      );

      // Update shard iterators (if null that shard is closed)
      for (const response of responses) {
        const { nextIterator, shardId } = response;
        shardDict[shardId].shardIterator = nextIterator;
      }

      // Trim empty ones
      trimShards();

      const records = responses.flatMap((r) => r.records).filter((r) => !!r);

      // Use the NewImage if available otherwise Keys. Old image only is not an option.
      const mapped = records.map(
        (r) =>
          ({
            at: +(r.dynamodb?.ApproximateCreationDateTime || new Date()),
            type: typeForOperation(r.eventName as any),
            key: r.dynamodb?.Keys ? unmarshall(r.dynamodb?.Keys) : undefined,
            newImage: r.dynamodb?.NewImage
              ? unmarshall(r.dynamodb?.NewImage)
              : undefined,
            oldImage: r.dynamodb?.OldImage
              ? unmarshall(r.dynamodb?.OldImage)
              : undefined,
          } as Omit<DynamoRecord, "message">)
      );

      const withMessage = mapped.map((m) => ({
        ...m,
        message: JSON.stringify(m.newImage || m.oldImage || m.key),
      }));

      const sorted = withMessage.sort((a, b) => +b.at - +a.at);

      initialCall = false;

      return sorted as DynamoRecord[];
    },
    reset: async () => {
      shardOffset = undefined;
      streamArn = undefined;
      initialCall = true;

      shardDict = {};
      deletedShards = {};
    },
  };
};

export const makeDynamoStreamController = (
  props: Props<Model, Update>
): DataFetcher<Model, Update> => {
  const streamManager = makeDynamoDbStreamManager({
    tableName: props.config.customData.value,
    aws: props.ports.aws,
  });

  return {
    initialData: props.config.initialData,
    fetch: async () => {
      const records = await streamManager.fetchRecords();
      return records;
    },
    reduce: (current, update) => {
      const newModel = [...current, ...update];
      return newModel;
      // if (newModel.length > 0) {
      //   return newModel.slice(newModel.length - 100);
      // } else {
      //   return newModel;
      // }
    },
  };
};

const typeForOperation = (op?: OperationType): BaseLogModel["type"] => {
  switch (op) {
    case "INSERT":
      return "okay";
    case "MODIFY":
      return "warning";
    case "REMOVE":
      return "warning";
    default:
      return "info";
  }
};
