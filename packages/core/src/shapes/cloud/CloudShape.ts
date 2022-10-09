import type { TLShape } from "@tldraw/core";

export interface CloudShape extends TLShape {
  type: "cloud";
  size: number[];
  awsProps?: any;
  customProps?: any;
}
