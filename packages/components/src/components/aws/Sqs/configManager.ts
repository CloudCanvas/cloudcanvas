import { CustomData } from "../../form/v1";
import {
  ListQueuesCommand,
  ListQueuesCommandOutput,
} from "@aws-sdk/client-sqs";
import { AWS } from "cloudcanvas-types";

const fetchAllQueues = async (aws: AWS, prefix?: string): Promise<string[]> => {
  console.log("fetching queues");
  try {
    const response: ListQueuesCommandOutput = await aws.sqs.send(
      new ListQueuesCommand({})
    );
    console.log("response");
    console.log(response);

    return (response.QueueUrls || []).filter((m) => !!m) as string[];
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const customDataFetcher = async (
  aws: AWS,
  prefix?: string
): Promise<CustomData[]> => {
  const queues = await fetchAllQueues(aws, prefix);

  const sorted = queues.sort((a, b) => a.localeCompare(b));

  return sorted.map((queue) => ({
    label: queue,
    value: queue,
  }));
};
