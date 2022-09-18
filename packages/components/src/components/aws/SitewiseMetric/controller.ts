import { AWS } from "@cloudcanvas/types";
import { TimeSeriesData, Model, Update } from "./model";
import { DataFetcher } from "../../../ports/DataFetcher";
import { CustomData } from "../../form";
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
      // TODO Fetch data for the last hour for the alias
      return SampleData();
    },
    reset: async () => {},
  };
};

export const makeLambdaStreamController = (
  props: Props<Model, Update>
): DataFetcher<Model, Update> => {
  const logStreamManager = makeIotAliasStreamer({
    alias: props.config.customData.value,
    aws: props.ports.aws,
  });

  return {
    initialData: props.config.initialData,
    fetch: async () => {
      return await logStreamManager.fetchRecords();
    },
    reduce: (current, update) => {
      return update;
    },
  };
};
