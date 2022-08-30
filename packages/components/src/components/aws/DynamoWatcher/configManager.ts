import { AWS } from "@cloudcanvas/types";
import { ListTablesCommand } from "@aws-sdk/client-dynamodb";
import { CustomData } from "../../form";

// TODO Cache the results
const fetchAllTables = async (aws: AWS): Promise<string[]> => {
  const tables: string[] = [];

  let lastEvaluatedTable: any | undefined = undefined;

  do {
    const response = await aws.dynamodb.send(
      new ListTablesCommand({
        ExclusiveStartTableName: lastEvaluatedTable,
      })
    );

    lastEvaluatedTable = response.LastEvaluatedTableName;

    tables.push(...(response.TableNames || []));
  } while (!!lastEvaluatedTable);

  return tables;
};

export const customDataFetcher = async (aws: AWS): Promise<CustomData[]> => {
  const tables = await fetchAllTables(aws);

  return tables.map((table) => ({
    label: table,
    value: table,
  }));
};
