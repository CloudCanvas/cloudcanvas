export type DynamoRecord = {
  [key: string]: string | number | Object | boolean;
};

export type Response = {
  at: Date;
  type: "INSERT" | "MODIFY" | "REMOVE";
  key: Partial<DynamoRecord>;
  newImage?: Partial<DynamoRecord>;
  oldImage?: Partial<DynamoRecord>;
};

export type StreamManager = {
  fetchRecords: () => Promise<Response[]>;
  reset: () => Promise<void>;
};
