export type DynamoData = {
  [key: string]: string | number | Object | boolean;
};

export type DynamoRecord = {
  id: string;
  at: Date;
  type: "INSERT" | "MODIFY" | "REMOVE";
  key: DynamoData;
  newImage?: DynamoData;
  oldImage?: DynamoData;
};

export type Update = DynamoRecord[];

export type Model = DynamoRecord[];
