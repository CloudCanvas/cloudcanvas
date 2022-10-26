import { DataFetcher } from "../../../ports/DataFetcher";
import { CustomData } from "../../form/v1";
import { Alarm, Model, Update } from "./model";
import { DescribeAlarmsCommand } from "@aws-sdk/client-cloudwatch";
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
  const alarmName = props.config.customData.value;

  const aws = props.ports.aws;

  return {
    initialData: props.config.initialData,
    fetch: async () => {
      // TODO Get alarm statu
      const response = await aws.cloudwatch.send(
        new DescribeAlarmsCommand({
          AlarmNames: [alarmName],
        })
      );

      const alarm = response.MetricAlarms![0];

      return {
        status: (alarm.StateValue || "OK") as Alarm["status"],
        reason: alarm.StateReason,
      };
    },
    reduce: (current, update) => {
      if (!update) return current;

      return update;
    },
  };
};
