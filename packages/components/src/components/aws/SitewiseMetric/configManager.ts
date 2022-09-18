import { AWS } from "@cloudcanvas/types";
import {
  ListTimeSeriesCommand,
  ListTimeSeriesCommandOutput,
} from "@aws-sdk/client-iotsitewise";
import { CustomData } from "../../form";

const fetchAllAliases = async (aws: AWS): Promise<string[]> => {
  const aliases: string[] = [];

  let nextToken: any | undefined = undefined;

  do {
    const response: ListTimeSeriesCommandOutput = await aws.iotsitewise.send(
      new ListTimeSeriesCommand({
        nextToken,
        maxResults: 250,
      })
    );

    nextToken = response.nextToken;

    console.log("nextToken");
    console.log(nextToken);

    console.log(aliases.length);

    aliases.push(...(response.TimeSeriesSummaries || []).map((t) => t.alias!));
  } while (!!nextToken);

  return aliases;
};

export const customDataFetcher = async (aws: AWS): Promise<CustomData[]> => {
  const aliases = await fetchAllAliases(aws);

  const sorted = aliases.sort((a, b) => a.localeCompare(b));

  console.log("sorted");
  console.log(sorted);

  return sorted.map((alias) => ({
    label: alias,
    value: alias,
  }));
};
