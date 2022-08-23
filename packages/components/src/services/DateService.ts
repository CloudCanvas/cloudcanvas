import * as Fns from "date-fns";

export const dateToLogStr = (dt: Date) =>
  // Aug 06, 09:26:35.822 AM
  // Fns.format(dt, "MMM dd, HH:mm:ss.SSS aa");
  // 09:26:35.822
  // Fns.format(dt, "HH:mm:ss.SSS")
  // 09:26:35
  Fns.format(dt, "HH:mm:ss");
