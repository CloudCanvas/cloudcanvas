import type { CustomShapeUtil } from "./CustomShapeUtil";
import { ArrowShape, ArrowUtil } from "./arrow";
import { BoxShape, BoxUtil } from "./box";
import { PencilShape, PencilUtil } from "./pencil";
import { ScrollBoxShape, ScrollBoxUtil } from "./scrollbox";
import { CloudShape, CloudUtil } from "./cloud";

export * from "./arrow";
export * from "./pencil";
export * from "./box";
export * from "./cloud";
export * from "./scrollbox";

export type Shape =
  | BoxShape
  | ArrowShape
  | PencilShape
  | ScrollBoxShape
  | CloudShape;

export const shapeUtils = {
  box: new BoxUtil(),
  cloud: new CloudUtil(),
  scrollbox: new ScrollBoxUtil(),
  arrow: new ArrowUtil(),
  pencil: new PencilUtil(),
};

export const getShapeUtils = <T extends Shape>(shape: T | T["type"]) => {
  if (typeof shape === "string")
    return shapeUtils[shape] as unknown as CustomShapeUtil<T>;
  return shapeUtils[shape.type] as unknown as CustomShapeUtil<T>;
};
