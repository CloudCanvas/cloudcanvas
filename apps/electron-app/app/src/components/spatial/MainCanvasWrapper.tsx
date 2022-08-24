import React from "react";
import { observer } from "mobx-react-lite";
import { useStores } from "../../store";
import { MainCanvas } from "@cloudcanvas/components";

export const WINDOW_WIDTH = 1400;
export const WINDOW_HEIGHT = 900;

export const CANVAS_WIDTH = 100000;
export const CANVAS_HEIGHT = 100000;

export const CANVAS_CENTER = {
  x: Math.round(CANVAS_WIDTH / 2) + WINDOW_WIDTH * 0.5,
  y: Math.round(CANVAS_HEIGHT / 2) + WINDOW_HEIGHT * 0.5,
};

type MainProps = {
  children: any | any[];
};
export default observer((props: MainProps) => {
  const { component, layout } = useStores();

  console.log("rerednering canvas wrapper");

  return (
    <div
      id="canvasContainer"
      style={{
        width: `${CANVAS_WIDTH}px`,
        height: `${CANVAS_HEIGHT}px`,
        background: "white",
        border: "2px dashed black",
        position: "absolute",
      }}
      onClick={() => {}}>
      <MainCanvas
        state={{}}
        dispatch={{
          onCmdk: async (cmdkProps) => {
            const channel = new BroadcastChannel("app-data");
            channel.postMessage({
              type: "add-resource",
              location: {
                actualLocationX: cmdkProps.x,
                actualLocationY: cmdkProps.y,
              },
            });
          },
          setScale: async (scale) => {
            scale && layout.setScale(scale);
          },
          setLocation: async (location) => {
            console.log("location");
            console.log(location);
            layout.setLocation(location);
          },
          unselectAllComponents: async () => {
            if (component.selected) {
              component.updateAllComponents({
                selected: false,
              });
            }
          },
        }}>
        {props.children}
      </MainCanvas>
    </div>

    // <div
    //   id="container"
    //   cm-template="loudAlert"
    //   style={{
    //     height: "100%",
    //     width: "100%",
    //     position: "absolute",
    //     background: "#f6f4f4",
    //   }}>

    //   </div>
    // </div>
  );
});
