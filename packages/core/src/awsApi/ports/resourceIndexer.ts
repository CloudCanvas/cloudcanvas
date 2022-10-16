import { Credentials } from "@aws-sdk/types";

export interface Resource {
  resourceId: string;
  resourceType: "Lambda" | "DynamoDB";
  region: string;
}
export interface ResourceIndexer {
  index: (credentials: Credentials, region: string) => Promise<any>;
}
