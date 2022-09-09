import BaseModel from "../shared/BaseModel";

export interface LogEntry extends BaseModel {
  id: string;
}

export type Update = LogEntry[];
export type Model = LogEntry[];
