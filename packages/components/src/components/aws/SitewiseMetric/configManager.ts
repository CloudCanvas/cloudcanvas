import { AWS } from "@cloudcanvas/types";
import {
  ListTimeSeriesCommand,
  ListTimeSeriesCommandOutput,
} from "@aws-sdk/client-iotsitewise";
import { CustomData } from "../../form";

const fetchAllAliases = async (
  aws: AWS,
  prefix?: string
): Promise<string[]> => {
  const response: ListTimeSeriesCommandOutput = await aws.iotsitewise.send(
    new ListTimeSeriesCommand({
      aliasPrefix: prefix,
      maxResults: 50,
    })
  );

  return (response.TimeSeriesSummaries || []).map((t) => t.alias!);
};

export const customDataFetcher = async (
  aws: AWS,
  prefix?: string
): Promise<CustomData[]> => {
  const aliases = await fetchAllAliases(aws, prefix);

  const sorted = aliases.sort((a, b) => a.localeCompare(b));

  return sorted.map((alias) => ({
    label: alias,
    value: alias,
  }));
};
