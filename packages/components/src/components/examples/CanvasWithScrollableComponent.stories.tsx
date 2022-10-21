import React from "react";
import CanvasWithScrollableComponent from "./CanvasWithScrollableComponent";
import "bulma/css/bulma.css";

export default {
  title: "components/examples/CanvasWithScrollableComponent",
  component: CanvasWithScrollableComponent,
  argTypes: {
    backgroundColor: { control: "color" },
  },
};

// Create a master template for mapping args to render the DynamoWatcher component
const Template = () => () =>
  (
    <div style={{ position: "relative", width: 1200, height: 1000 }}>
      <CanvasWithScrollableComponent />
    </div>
  );

export const LiveCanvas = Template();
