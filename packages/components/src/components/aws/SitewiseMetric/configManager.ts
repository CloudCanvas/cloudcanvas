import { AWS } from "@cloudcanvas/types";
import { ListAssetModelsCommand } from "@aws-sdk/client-iotsitewise";
import { CustomData } from "../../form";

const fetchAllMetrics = async (aws: AWS): Promise<string[]> => {
  const metrics: string[] = [];

  let marker: any | undefined = undefined;

  do {
    const response = await aws.iotsitewise.send(
      new ListAssetModelsCommand({
        nextToken: marker,
      })
    );

    marker = response.NextMarker;

    metrics.push(...(response.Functions || []).map((f) => f.FunctionName!));
  } while (!!marker);

  return metrics;
};

export const customDataFetcher = async (aws: AWS): Promise<CustomData[]> => {
  const metrics = await fetchAllMetrics(aws);

  const sortedMetrics = metrics.sort((a, b) => a.localeCompare(b));

  console.log("sortedMetrics");
  console.log(sortedMetrics);

  return sortedMetrics.map((functionName) => ({
    label: functionName,
    value: functionName,
  }));
};
