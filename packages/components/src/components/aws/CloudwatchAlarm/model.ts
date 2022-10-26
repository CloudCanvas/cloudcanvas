export interface Alarm {
  status: "ALARM" | "INSUFFICIENT_DATA" | "OK";
  reason?: string;
}

export type Update = Alarm;
export type Model = Alarm;
