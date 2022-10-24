import { id } from "../../../utils/generalUtils";
import CloudTrail, { View, ViewProps } from "./View";
import "bulma/css/bulma.css";
import React from "react";

export default {
  title: "components/aws/CloudTrail",
  component: CloudTrail,
  argTypes: {
    backgroundColor: { control: "color" },
  },
};

// Create a master template for mapping args to render the CloudTrail component
const Template = (args: ViewProps) => () =>
  (
    <div
      style={{
        width: 600,
        height: 400,
        borderRadius: 3,
        borderWidth: 3,
        borderStyle: "solid",
      }}
    >
      <View {...args} />
    </div>
  );

// Reuse that template for creating different stories
export const NoRecords = Template({
  data: [],
  selected: false,
  setSelected: () => {},
});
