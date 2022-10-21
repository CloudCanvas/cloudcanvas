import { TLShapeUtil } from "@tldraw/core";
import * as React from "react";
import type { CloudShape } from "./CloudShape";

export const CloudIndicator = TLShapeUtil.Indicator<CloudShape>(({ shape }) => {
  return (
    <rect
      pointerEvents="none"
      width={shape.size[0]}
      height={shape.size[1]}
      fill="none"
      stroke="tl-selectedStroke"
      strokeWidth={0}
      rx={4}
    />
  );
});
