import { DataFetcher } from "../../../ports/DataFetcher";
import { CustomData } from "../../form/v1";
import { LogEntry, Model, Update } from "./model";
import {
  CloudTrailClient,
  LookupEventsCommand,
} from "@aws-sdk/client-cloudtrail";
import { AWS } from "cloudcanvas-types";

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
  fetchRecords: () => Promise<LogEntry[]>;
  reset: () => Promise<void>;
};

type Ports = {
  aws: AWS;
};

export type StreamConfig = {
  trail: string;
};

const makeCloudTrailManager = ({
  aws,
  trail,
}: Ports & StreamConfig): StreamManager => {
  let from = new Date(+new Date() - 1000 * 60 * 5);
  const client: CloudTrailClient = aws.cloudtrail;

  return {
    fetchRecords: async () => {
      const to = new Date();

      console.log("fetching cloudtrail events");
      console.log({
        StartTime: from,
        EndTime: to,
        MaxResults: 50,
      });
      // Fetch event history from the cloudtrai
      const eventHistory = await client.send(
        new LookupEventsCommand({
          // StartTime: from,
          // EndTime: to,
          MaxResults: 50,
        })
      );

      console.log("eventHistory");
      console.log(eventHistory);

      from = to;

      return [] as LogEntry[];
    },
    reset: async () => {
      from = new Date();
    },
  };
};

export const makeCloudTrailController = (
  props: Props<Model, Update>
): DataFetcher<Model, Update> => {
  const streamManager = makeCloudTrailManager({
    aws: props.ports.aws,
    trail: props.config.customData.value,
  });

  return {
    initialData: props.config.initialData,
    fetch: async () => {
      const records = await streamManager.fetchRecords();
      return records;
    },
    reduce: (current, update) => {
      if (!update) return current;

      const newModel = [...current, ...update];
      return newModel;
    },
  };
};
