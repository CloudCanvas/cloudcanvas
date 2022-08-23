import React from "react";
import MainCanvas, { MainCanvasProps } from "./MainCanvas";
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
      console.log("authorise");
    },
    unselectAllComponents: async () => {
      console.log("authorise");
    },
  },
};

// Create a master template for mapping args to render the DynamoWatcher component
const Template =
  (args: MainCanvasProps, width: number | undefined = undefined) =>
  () => {
    let [selected, setSelected] = React.useState(dcp.state.component.selected);
    return (
      <div
        className="template-wrapper"
        style={{ maxWidth: width, height: "100%" }}
      >
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
            ContentComponent={() => (
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
                  >
                    <h1>{i}</h1>
                  </div>
                ))}
              </div>
            )}
          ></BaseComponent>
          {/* <div
            style={{
              width: 900,
              height: 500,
              position: "absolute",
              left: 0,
              right: 0,
              transform: "translate(51000px, 50500px)",
              background: "green",
              overflow: "scroll",
            }}
          ></div> */}
        </MainCanvas>
      </div>
    );
  };
// Reuse that template for creating different stories

export const CanvasWithAnItem = Template(defaultProps);
