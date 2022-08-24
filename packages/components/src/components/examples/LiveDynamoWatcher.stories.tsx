import React from "react";
import { DynamoWatcherProps } from "../aws";
import LiveDynamoWatcher from "./LiveDynamoWatcher";

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
        width: 600,
        height: 400,
        borderRadius: 3,
        borderWidth: 3,
        borderStyle: "solid",
        overflow: "scroll",
      }}
    >
      <LiveDynamoWatcher />
    </div>
  );

export const LiveWatcher = Template();
