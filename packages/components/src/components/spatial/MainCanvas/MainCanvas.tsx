import React, { useEffect, useState } from "react";
import renderer, { ZoomRenderer } from "./renderer";

export const WINDOW_WIDTH = 1400;
export const WINDOW_HEIGHT = 900;

export const CANVAS_WIDTH = 100000;
export const CANVAS_HEIGHT = 100000;

export const CANVAS_CENTER = {
  x: Math.round(CANVAS_WIDTH / 2) + WINDOW_WIDTH * 0.5,
  y: Math.round(CANVAS_HEIGHT / 2) + WINDOW_HEIGHT * 0.5,
};

export type MainCanvasProps = {
  state: {
    location?: number[];
    scale?: number[];
  };
  dispatch: {
    onCmdk: (pops: { x: number; y: number }) => void;
    setScale: (scale: number) => void;
    setLocation: (location: number[]) => void;
    unselectAllComponents: () => void;
  };
  children?: React.ReactNode;
};

export default (props: MainCanvasProps) => {
  const [direction, _setDirection] = useState(-1);
  const panSurface = React.useRef<ZoomRenderer | undefined>(undefined);

  window.addEventListener("keydown", (e) => {
    const isCtrled = e.ctrlKey || e.metaKey;
    const isCmdk = e.key === "k" && isCtrled;

    if (isCmdk) {
      props.dispatch.onCmdk({
        x: (panSurface.current?.getState().transformation.translateX || 0) * -1,
        y: (panSurface.current?.getState().transformation.translateX || 0) * -1,
      });
    }
  });

  useEffect(() => {
    const container = document.getElementById("container");

    if (!container) return;

    if (!panSurface.current) {
      panSurface.current = renderer({
        scaleSensitivity: 35,
        initialScale: 1,
        minScale: 0.1,
        maxScale: 100,
        element: container!.children[0] as any as HTMLElement,
      });

      // Right now the scale needs to be recorded and passed into all child components
      // for (let i = 0; i < 3; i++) {
      //   panSurface.current?.zoom({
      //     deltaScale: -1,
      //     x: CANVAS_CENTER.x + 1000,
      //     y: CANVAS_CENTER.y + 500,
      //   });
      // }
    }

    // instance.panBy({ originX: CANVAS_WIDTH / 2, originY: CANVAS_HEIGHT / 2 });
    if (props.state.location) {
      panSurface.current.panBy({
        originX: -props.state.location[0],
        originY: -props.state.location[1],
      });
    } else {
      panSurface.current.panBy({
        originX: -CANVAS_CENTER.x,
        originY: -CANVAS_CENTER.y,
      });
    }

    container!.addEventListener("wheel", (event) => {
      event.preventDefault();

      if (!event.ctrlKey) {
        panSurface.current?.panBy({
          originX: event.deltaX * direction,
          originY: event.deltaY * direction,
        });

        setTimeout(() => {
          const t = panSurface.current?.getState().transformation;
          if (!t) return;
          props.dispatch.setLocation([t.translateX * -1, t.translateY * -1]);
        }, 50);
      } else {
        panSurface.current?.zoom({
          deltaScale: Math.sign(event.deltaY) > 0 ? -1 : 1,
          x: event.pageX,
          y: event.pageY,
        });

        setTimeout(() => {
          const t = panSurface.current?.getState().transformation;
          if (!t) return;
          props.dispatch.setScale(t.scale);
        }, 50);
      }
    });

    container!.addEventListener("mousemove", (event) => {
      if (!event.shiftKey) {
        return;
      }
      event.preventDefault();
      panSurface.current?.panBy({
        originX: event.movementX,
        originY: event.movementY,
      });
    });
  }, []);

  return (
    <div
      id="container"
      cm-template="loudAlert"
      style={{
        height: "100%",
        width: "100%",
        position: "absolute",
        background: "#f6f4f4",
        overflow: "hidden",
      }}
    >
      <div
        id="canvasContainer"
        style={{
          width: `${CANVAS_WIDTH}px`,
          height: `${CANVAS_HEIGHT}px`,
          background: "white",
          border: "2px dashed black",
          position: "absolute",
          overflow: "hidden",
        }}
        onClick={() => {
          props.dispatch.unselectAllComponents();
        }}
      >
        {props.children}
      </div>
    </div>
  );
};
