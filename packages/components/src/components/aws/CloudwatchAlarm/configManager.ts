import { CustomData } from "../../form/v1";
import {
  DescribeAlarmsCommand,
  DescribeAlarmsCommandOutput,
} from "@aws-sdk/client-cloudwatch";
import { AWS } from "cloudcanvas-types";

const fetchAllAlarms = async (aws: AWS, prefix?: string): Promise<string[]> => {
  const response: DescribeAlarmsCommandOutput = await aws.cloudwatch.send(
    new DescribeAlarmsCommand({})
  );

  return [...(response.MetricAlarms || []), ...(response.CompositeAlarms || [])]
    .map((m) => m.AlarmName)
    .filter((m) => !!m) as string[];
};

export const customDataFetcher = async (
  aws: AWS,
  prefix?: string
): Promise<CustomData[]> => {
  const alarms = await fetchAllAlarms(aws, prefix);

  const sorted = alarms.sort((a, b) => a.localeCompare(b));

  return sorted.map((alarm) => ({
    label: alarm,
    value: alarm,
  }));
};
