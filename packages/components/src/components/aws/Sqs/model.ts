import BaseLogModel from "../shared/BaseModel";

export interface SqsMessage extends BaseLogModel {}

export type Update = SqsMessage[];

export type Model = SqsMessage[];
