import BaseLogModel from "../shared/BaseModel";

export interface LogEntry extends BaseLogModel {
  id: string;
}

export type Update = LogEntry[];
export type Model = LogEntry[];
