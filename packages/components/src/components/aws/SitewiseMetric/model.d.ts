import BaseModel from "../shared/BaseModel";
export interface LogEntry extends BaseModel {
    id: string;
}
export declare type Update = LogEntry[];
export declare type Model = LogEntry[];
