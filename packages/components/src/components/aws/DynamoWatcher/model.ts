import BaseModel from "../shared/BaseModel";

export type DynamoData = {
  [key: string]: string | number | Object | boolean;
};

export interface DynamoRecord extends BaseModel {
  id: string;
  dType: "INSERT" | "MODIFY" | "REMOVE";
  key: DynamoData;
  newImage?: DynamoData;
  oldImage?: DynamoData;
}

export type Update = DynamoRecord[];

export type Model = DynamoRecord[];
