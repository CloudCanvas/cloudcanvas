export type DynamoData = {
  [key: string]: string | number | Object | boolean;
};

export type DynamoRecord = {
  id: string;
  at: Date;
  type: "INSERT" | "MODIFY" | "REMOVE";
  key: Partial<DynamoRecord>;
  newImage?: Partial<DynamoRecord>;
  oldImage?: Partial<DynamoRecord>;
};

export type DynamoWatcherModel = DynamoRecord[];
