import { DynamoDBClient, ListTablesCommand } from "@aws-sdk/client-dynamodb";
import {
  LambdaClient,
  ListFunctionsCommand,
  ListFunctionsCommandOutput,
} from "@aws-sdk/client-lambda";
import { Credentials } from "aws-sdk";
import { ListTablesOutput } from "aws-sdk/clients/dynamodb";
import { Resource, ResourceIndexer } from "../ports";

const fetchAllFunctions = async (client: LambdaClient): Promise<Resource[]> => {
  const results: string[] = [];

  let nextToken = undefined;

  do {
    const resp: ListFunctionsCommandOutput = await client.send(
      new ListFunctionsCommand({
        Marker: nextToken,
      })
    );

    nextToken = resp.NextMarker;
    results.push(...(resp.Functions || []).map((f) => f.FunctionArn!));
  } while (nextToken);

  let region = await client.config.region();

  return results.map((f) => ({
    resourceId: f,
    resourceType: "Lambda",
    region: region,
  }));
};

const fetchAllTables = async (client: DynamoDBClient): Promise<Resource[]> => {
  const results: string[] = [];

  let nextToken = undefined;

  do {
    const resp: ListTablesOutput = await client.send(
      new ListTablesCommand({
        ExclusiveStartTableName: nextToken,
      })
    );

    nextToken = resp.LastEvaluatedTableName;
    results.push(...(resp.TableNames || []));
  } while (nextToken);

  let region = await client.config.region();

  return results.map((f) => ({
    resourceId: f,
    resourceType: "DynamoDB",
    region: region,
  }));
};

export const makeResourceGroupsTagManager = (): ResourceIndexer => {
  return {
    index: async (credentials, region) => {
      const functions = await fetchAllFunctions(
        new LambdaClient({
          region,
          credentials,
        })
      );
      const tables = await fetchAllTables(
        new DynamoDBClient({
          region,
          credentials,
        })
      );

      return [...functions, ...tables];
    },
  };
};

// const exec = async () => {
//   const manager = makeResourceGroupsTagManager();

//   const credentials = new Credentials({
//     accessKeyId: "ASIA2GJOLN27ISVVHHV3",
//     secretAccessKey: "Ugkd2hxR4MdNFYyie8hlKUCRGcvnLTnksvoB7U6m",
//     sessionToken:
//       "IQoJb3JpZ2luX2VjEEwaDmFwLXNvdXRoZWFzdC0yIkcwRQIhALuqhH2HAj6nvOFLDyKde+5uVKE2xFhJ2CuCDkgwUtXRAiAInh1mBbqH98FbXhGfq8Clu/E+nuEIdQUjweJqnUgLuiqWAwgVEAAaDDcwMDcxMzc1ODM5OCIMr4iFL0mYmh3DRyujKvMCIChye95Hg4OPALcXHZiNN2HpBXMjT0H/tzUaLr/aVnd2w+JMsU17IABCnK4TeMVKqiHrRjeXvJ9MNklWZowQxcaBRnK70QTIteZJmlEahNN4/xFHEYw8QdtjcqXF4ZeUBh5czWW38U157hnAJD0QuTyw605G/15fqUzCAuODUi6rtsrFyW0MMZj5awMGXI76Y9BWz9req2QS7onB6BZe2SP8bV4weUUBHP1q3aVm/o/ktxaWxIo2Qq3Y6TT3Swb1+noYtg+Q37Q+kqFjsARDEBPbT3RyU1nVl72CvdpN+xcq+2ZP1H0HAfFuOOJM4RTmNvGiz3jdzutEM3VofvsgTPw1cHSI6KaZjP7yAE3yUXWllRJOliTUcFpMBRaLTFUGbtRqrPYuFcAYXyE/aMa0N5GBlUjvyndI2pZnCt8U1gLWUQS3WEuzMQAP4T+KB8E1ZtokezxD0RSva05a05mZZEfPJ1otg3CHLVYzlcrYfxm5iLownK+AmgY6pgH81yeKrASDmgsHST3O7yvh1CzieRFwn8EMKDzrw5793AmBIfiYLHyzAsUZG0ea0rYNiM+vPrRkoc3EU3FLsXvLVJUdGuyZ9gqgyA6yf+vUWUCk5B8Dy1q5I7J/3PS2aH900TAyXqZKmXs3FYhfRyRK320jJkHXxLtU0CCSdEvW/3KkZBN7m7Ujmik5O2uJxyA8mie1BkeIrfqFQykjRC6DhrVwW104",
//   });

//   const resources = await manager.index(credentials, "ap-southeast-2");

//   console.log(resources);
// };

// exec();
