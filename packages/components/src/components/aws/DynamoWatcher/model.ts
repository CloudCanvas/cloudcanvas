import BaseLogModel from "../shared/BaseModel";

export type DynamoData = {
  [key: string]: string | number | Object | boolean;
};

export interface DynamoRecord extends BaseLogModel {
  id: string;
  dType: "INSERT" | "MODIFY" | "REMOVE";
  key: DynamoData;
  newImage?: DynamoData;
  oldImage?: DynamoData;
}

export type Update = DynamoRecord[];

export type Model = DynamoRecord[];
