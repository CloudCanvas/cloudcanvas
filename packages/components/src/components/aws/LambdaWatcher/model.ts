import { OutputLogEvent } from "@aws-sdk/client-cloudwatch-logs";

export type LogEntry = OutputLogEvent & { id: string };

export type Update = LogEntry[];
export type Model = LogEntry[];
