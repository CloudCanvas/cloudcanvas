import { AWS } from "@cloudcanvas/types";

import { Model, Update } from "./model";
import { DataFetcher } from "../../../ports/DataFetcher";

type Config<T, U> = Pick<DataFetcher<T, U>, "delay" | "initialData"> & {
  functionName: string;
};

type Props<T, U> = {
  config: Config<T, U>;
  ports: {
    aws: AWS;
  };
};

type StreamManager = {
  fetchRecords: () => Promise<string[]>;
  reset: () => Promise<void>;
};

type Ports = {
  aws: AWS;
};

export type StreamConfig = {
  functionName: string;
};

const makeCloudwatchLogStreamManager = ({
  aws,
  functionName,
}: Ports & StreamConfig): StreamManager => {
  // TODO Fettch CW here
  const client = aws.dynamodbstreams;

  return {
    fetchRecords: async () => {
      // todo fetch recprds
      console.log(functionName);
      return [];
    },
    reset: async () => {},
  };
};

export const makeLambdaStreamController = (
  props: Props<Model, Update>
): DataFetcher<Model, Update> => {
  const logStreamManager = makeCloudwatchLogStreamManager({
    functionName: props.config.functionName,
    aws: props.ports.aws,
  });

  return {
    delay: props.config.delay,
    initialData: props.config.initialData,
    fetch: async () => {
      const records = await logStreamManager.fetchRecords();
      return records;
    },
    reduce: (current, update) => {
      return [...current, ...update];
    },
  };
};
