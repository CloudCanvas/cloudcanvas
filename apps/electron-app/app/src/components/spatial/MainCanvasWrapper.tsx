import React, { useEffect, useState } from "react";
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
  const [location, setLocation] = useState<number[] | undefined>(undefined);

  useEffect(() => {
    // Only done once on load then the canvas manages the location
    setLocation(layout.location || [CANVAS_CENTER.x, CANVAS_CENTER.y]);
  }, []);

  if (!location) {
    return null;
  }

  return (
    <MainCanvas
      state={{
        location: location,
      }}
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
          layout.setLocation(location);
        },
        unselectAllComponents: async () => {
          if (component.selected) {
            component.updateAllComponents({
              state: { selected: false },
            });
          }
        },
      }}>
      {props.children}
    </MainCanvas>
  );
});
