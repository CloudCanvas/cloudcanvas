import { AWS } from "cloudcanvas-types";
import { ListFunctionsCommand } from "@aws-sdk/client-lambda";
import { CustomData } from "../../form";

// TODO Cache the results
const fetchAllFunctions = async (aws: AWS): Promise<string[]> => {
  const functions: string[] = [];

  let marker: any | undefined = undefined;

  do {
    const response = await aws.lambda.send(
      new ListFunctionsCommand({
        Marker: marker,
      })
    );

    marker = response.NextMarker;

    functions.push(...(response.Functions || []).map((f) => f.FunctionName!));
  } while (!!marker);

  return functions;
};

export const resourceFetcher = async (aws: AWS): Promise<CustomData[]> => {
  const functions = await fetchAllFunctions(aws);

  const sortedNames = functions.sort((a, b) => a.localeCompare(b));

  return sortedNames.map((functionName) => ({
    label: functionName,
    value: functionName,
  }));
};
