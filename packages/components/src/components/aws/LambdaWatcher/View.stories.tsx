import React from "react";
import LambdaWatcher, { View, ViewProps } from "./View";

export default {
  title: "components/aws/LambdaWatcher",
  component: LambdaWatcher,
  argTypes: {
    backgroundColor: { control: "color" },
  },
};

// Create a master template for mapping args to render the LambdaWatcher component
const Template = (args: ViewProps) => () =>
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
      <View {...args} />
    </div>
  );

// Reuse that template for creating different stories
export const NoRecords = Template({ data: [] });
