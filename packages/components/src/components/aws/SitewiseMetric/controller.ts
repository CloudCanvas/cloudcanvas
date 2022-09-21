import { AWS } from "@cloudcanvas/types";
import { TimeSeriesData, Model, Update } from "./model";
import { DataFetcher } from "../../../ports/DataFetcher";
import { CustomData } from "../../form";
import {
  GetAssetPropertyAggregatesCommand,
  GetAssetPropertyValueHistoryCommand,
} from "@aws-sdk/client-iotsitewise";
import { SampleData } from "./sampleData";

const doLog = true;

const log = (msg: any) => {
  if (doLog) {
    log(msg);
  }
};

type Config<M, U> = Pick<DataFetcher<M, U>, "initialData"> & {
  customData: CustomData;
};

type Props<M, U> = {
  config: Config<M, U>;
  ports: {
    aws: AWS;
  };
};

type StreamManager = {
  fetchRecords: () => Promise<TimeSeriesData>;
  reset: () => Promise<void>;
};

type Ports = {
  aws: AWS;
};

export type StreamConfig = {
  alias: string;
};

const makeIotAliasStreamer = ({
  aws,
  alias,
}: Ports & StreamConfig): StreamManager => {
  const client = aws.iotsitewise;

  return {
    fetchRecords: async () => {
      // an hour ago
      const from = new Date(+new Date() - 1000 * 60 * 60);
      const to = new Date();

      console.log({
        aggregateTypes: ["AVERAGE"],
        startDate: from,
        endDate: to,
        propertyAlias: alias,
        resolution: "1m",
      });
      const data = await client.send(
        new GetAssetPropertyValueHistoryCommand({
          startDate: from,
          endDate: to,
          propertyAlias: alias,
        })
      );

      return {
        from,
        to,
        values:
          data.assetPropertyValueHistory?.map((av) => ({
            x: new Date(av.timestamp?.timeInSeconds! * 1000),
            y: av.value?.doubleValue ?? av.value?.integerValue! ?? 0,
          })) || [],
      };
    },
    reset: async () => {},
  };
};

export const makeController = (
  props: Props<Model, Update>
): DataFetcher<Model, Update> => {
  const dataManager = makeIotAliasStreamer({
    alias: props.config.customData.value,
    aws: props.ports.aws,
  });

  return {
    initialData: props.config.initialData,
    fetch: async () => {
      return await dataManager.fetchRecords();
    },
    reduce: (current, update) => {
      if (!update) return current;

      return update;
    },
  };
};
