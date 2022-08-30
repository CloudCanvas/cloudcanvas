import { AWS } from "@cloudcanvas/types";
import { v4 } from "uuid";
import {
  OutputLogEvent,
  DescribeLogStreamsCommand,
  GetLogEventsCommand,
} from "@aws-sdk/client-cloudwatch-logs";
import { LogEntry, Model, Update } from "./model";
import { DataFetcher } from "../../../ports/DataFetcher";
import { CustomData } from "../../form";

/**
 * TODO This code is pretty nasty for now just to get working, would prefer to use
 * `aws logs tail --follow` if they had an SDK entrypoint. Have raised issue.
 */

const doLog = true;

const log = (msg: any) => {
  if (doLog) {
    log(msg);
  }
};

type Config<M, U> = Pick<DataFetcher<M, U>, "delay" | "initialData"> & {
  customData: CustomData;
};

type Props<M, U> = {
  config: Config<M, U>;
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

// No set logic for when a stream closes so just going with 12 mins for now
const logCloseCutoffEstimator = () => +new Date() - 1000 * 60 * 12;

export type StreamConfig = {
  functionName: string;
};

const makeCloudwatchLogStreamManager = ({
  aws,
  functionName,
}: Ports & StreamConfig): StreamManager => {
  const client = aws.cloudwatchLogs;

  let initial = true;

  let logStreamDict: {
    [logStreamName: string]: {
      nextToken: string | undefined;
      lastEventTime: number | undefined;
      createdAt: number;
      deleted: boolean;
    };
  } = {};

  const logGroupName = `/aws/lambda/${functionName}`;

  return {
    fetchRecords: async () => {
      log(`Polling for records from log group "${logGroupName}"`);

      // First get all log streams created since last call
      const streamsResponse = await client.send(
        new DescribeLogStreamsCommand({
          logGroupName: logGroupName,
          orderBy: "LastEventTime",
          descending: true,
          limit: 3,
        })
      );

      log(
        `${streamsResponse.logStreams?.length || 0} new log streams returned`
      );

      streamsResponse.logStreams?.forEach((sls) => {
        log(sls.logStreamName);
      });

      // Once we've called once we fetch more in future
      initial = false;

      const logStreams = (streamsResponse.logStreams || []).filter(
        (ls) => ls.logStreamName
      );

      // Add the streams to the dictionary for polling if not there already
      for (const stream of logStreams) {
        if (logStreamDict[stream.logStreamName!]) continue;

        log(`Adding new log stream`);
        logStreamDict[stream.logStreamName!] = {
          nextToken: undefined,
          lastEventTime: stream.lastEventTimestamp,
          createdAt: +new Date(),
          deleted: false,
        };
      }

      // Only use streams where we don't have a lastEventTime (i.e. just created),
      // where it wasn't deleted or where the lastEvent was after the cutoff to
      // save calls (probably closed for appending)
      const cutoffTime = logCloseCutoffEstimator();

      const streamsToQuery = Object.entries(logStreamDict).filter((d) => {
        return (
          !d[1].deleted &&
          (!d[1].lastEventTime || d[1].lastEventTime! > cutoffTime)
        );
      });

      log(`Querying ${streamsToQuery.length} log streams`);

      // Now for every log stream go and fetch a batch of log events
      const logMessagesResponse = await Promise.all(
        streamsToQuery.map(async (ls) => {
          const x = await client.send(
            new GetLogEventsCommand({
              logGroupName,
              logStreamName: ls[0],
              nextToken: ls[1].nextToken,
            })
          );

          const filteredEvents = (x.events || [])
            .filter((e) => e.timestamp)
            .sort((a, b) => a.timestamp! - b.timestamp!);

          return {
            events: filteredEvents,
            lastTimestamp:
              filteredEvents.length > 0
                ? filteredEvents[filteredEvents.length - 1].timestamp
                : undefined,
            token: x.nextForwardToken,
            stream: ls[0],
          };
        })
      );

      // Save the token for calling the same logStream next time
      for (const logMessageResponse of logMessagesResponse) {
        logStreamDict[logMessageResponse.stream] = {
          ...logStreamDict[logMessageResponse.stream],
          nextToken: logMessageResponse.token,
          lastEventTime: logMessageResponse.lastTimestamp,
        };
      }

      // Trim streams we manage
      for (const key of Object.keys(logStreamDict)) {
        // trim if we have not had an event since cutoff time
        if (
          logStreamDict[key].lastEventTime &&
          logStreamDict[key].lastEventTime! < cutoffTime
        ) {
          log(
            `Deleting log stream as no event since cutoff time (${logStreamDict[key].lastEventTime})`
          );

          logStreamDict[key].deleted = true;
          continue;
        }

        // trim if we have never had an event and it was created before cutoff time
        if (
          !logStreamDict[key].lastEventTime &&
          logStreamDict[key].createdAt! < cutoffTime
        ) {
          log(
            `Deleting log stream as no event since createdAt time (${logStreamDict[key].createdAt})`
          );

          logStreamDict[key].deleted = true;
        }
      }

      // Now flatten all events returned and order ascending
      const allEventsAscending = logMessagesResponse
        .flatMap((lmr) => lmr.events)
        .filter((e) => e.timestamp)
        .sort((a, b) => b.timestamp! - a.timestamp!)
        .map((r) => ({ ...r, id: v4() }));

      return allEventsAscending;
    },
    reset: async () => {
      initial = true;
      logStreamDict = {};
    },
  };
};

export const makeLambdaStreamController = (
  props: Props<Model, Update>
): DataFetcher<Model, Update> => {
  const logStreamManager = makeCloudwatchLogStreamManager({
    functionName: props.config.customData.value,
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
      return [...update, ...current];
    },
  };
};
