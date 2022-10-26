import { DataFetcher } from "../../../ports/DataFetcher";
import { CustomData } from "../../form/v1";
import { SqsMessage, Model, Update } from "./model";
import {
  ReceiveMessageCommand,
  ReceiveMessageCommandOutput,
} from "@aws-sdk/client-sqs";
import { AWS } from "cloudcanvas-types";

type Config<M, U> = Pick<DataFetcher<M, U>, "initialData"> & {
  customData: CustomData;
};

type Props<M, U> = {
  config: Config<M, U>;
  ports: {
    aws: AWS;
  };
};

export type StreamConfig = {
  alias: string;
};

export const makeController = (
  props: Props<Model, Update>
): DataFetcher<Model, Update> => {
  const queueUrl = props.config.customData.value;

  return {
    initialData: props.config.initialData,
    fetch: async () => {
      // Fetch messages from SQS queue and immediately make them visible again
      const response: ReceiveMessageCommandOutput =
        await props.ports.aws.sqs.send(
          new ReceiveMessageCommand({
            QueueUrl: queueUrl,
            VisibilityTimeout: 0,
          })
        );

      const messages = (response.Messages || []).map((m) => m.Body || "");

      return messages.map((message) => ({
        message,
        at: +new Date(),
      }));
    },
    reduce: (current, update) => {
      if (!update) return current;
      const endState = [...current, ...update];

      // Trim to 1000 records
      if (endState.length > 1000) {
        return endState.slice(-1000);
      } else {
        return endState;
      }
    },
  };
};
