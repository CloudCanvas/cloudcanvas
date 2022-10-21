import type { ScrollBoxShape } from "./ScrollBoxShape";
import { HTMLContainer, TLShapeUtil } from "@tldraw/core";
import * as React from "react";

export const ScrollBoxComponent = TLShapeUtil.Component<
  ScrollBoxShape,
  HTMLDivElement
>(({ shape, events, isGhost, meta, isEditing }, ref) => {
  const color = meta.isDarkMode ? "white" : "black";

  return (
    <HTMLContainer ref={ref} {...events}>
      <div
        style={{
          width: shape.size[0],
          height: shape.size[1],
          borderWidth: 3,
          borderColor: color,
          borderStyle: "solid",
          borderRadius: 4,
          opacity: isGhost ? 0.3 : 1,
          pointerEvents: "all",
          background: "transparent",
          overflow: "scroll",
        }}
        onWheel={(e) => {
          e.stopPropagation();
        }}
        onScroll={(e) => {
          e.stopPropagation();
        }}
      >
        {/* <div style={{ width: '100%', height: '100%', overflowY: 'scroll' }}> */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => (
          <div
            key={`scrollBox-${i}`}
            style={{ paddingTop: 16, paddingBottom: 16 }}
          >
            <p>Element {i}</p>
          </div>
        ))}
        {/* </div> */}
      </div>
    </HTMLContainer>
  );
});
