import React from "react";
import MainCanvas, { CANVAS_CENTER, MainCanvasProps } from "./MainCanvas";
import "bulma/css/bulma.css";
import BaseComponent from "../../layout/BaseComponent/BaseComponent";
import { dcp } from "../../layout/BaseComponent/BaseComponent.stories";
import { centered } from "../../../utils/layoutUtils";

export default {
  title: "components/spatial/MainCanvas",
  component: MainCanvas,
  argTypes: {
    backgroundColor: { control: "color" },
  },
};

const defaultProps: MainCanvasProps = {
  state: {},
  dispatch: {
    onCmdk: async () => {
      window.alert("cmdk");
    },
    setScale: async () => {
      console.log("setScale");
    },
    setLocation: async () => {
      console.log("setLocation");
    },
    unselectAllComponents: async () => {
      console.log("authorise");
    },
  },
};

// Create a master template for mapping args to render the DynamoWatcher component
const Template = (args: MainCanvasProps) => () => {
  let [selected, setSelected] = React.useState(dcp.state.component.selected);
  return (
    <div style={{ position: "relative", width: 1000, height: 1000 }}>
      <MainCanvas {...args}>
        <BaseComponent
          {...{
            ...dcp,
            state: {
              ...dcp.state,
              component: {
                ...dcp.state.component,
                selected: selected,
              },
            },
            dispatch: {
              ...dcp.dispatch,
              onSelection: () => setSelected(!selected),
            },
          }}
        >
          <div style={{ flex: 1 }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div
                style={{
                  height: 200,
                  width: "100%",
                  borderWidth: 3,
                  borderStyle: "solid",
                  borderColor: "black",
                  ...centered,
                }}
                key={i}
              >
                <h1>{i}</h1>
              </div>
            ))}
          </div>
        </BaseComponent>
      </MainCanvas>
    </div>
  );
};
// Reuse that template for creating different stories

export const CanvasWithAnItem = Template(defaultProps);

export const CanvasWithADifferentStartLocation = Template({
  ...defaultProps,
  state: {
    ...defaultProps.state,
    location: [CANVAS_CENTER.x - 400, CANVAS_CENTER.y - 100],
  },
});
