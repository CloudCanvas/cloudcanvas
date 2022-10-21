import React from "react";
import LiveDynamoWatcher from "./LiveDynamoWatcher";
import "bulma/css/bulma.css";

export default {
  title: "components/examples/LiveDynamoWatcher",
  component: LiveDynamoWatcher,
  argTypes: {
    backgroundColor: { control: "color" },
  },
};

// Create a master template for mapping args to render the DynamoWatcher component
const Template = () => () =>
  (
    <div
      style={{
        width: 1000,
        height: 100,
        overflow: "scroll",
      }}
    >
      <LiveDynamoWatcher />
    </div>
  );

export const LiveWatcher = Template();
