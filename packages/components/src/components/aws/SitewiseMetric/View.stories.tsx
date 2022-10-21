import React from "react";
import SitewiseMetric, { View, ViewProps } from "./View";
import "bulma/css/bulma.css";
import { SampleData } from "./sampleData";

export default {
  title: "components/aws/SitewiseMetric",
  component: SitewiseMetric,
  argTypes: {
    backgroundColor: { control: "color" },
  },
};

// Create a master template for mapping args to render the SitewiseMetric component
const Template = (args: Pick<ViewProps, "data">) => () =>
  (
    <div
      style={{
        width: 900,
        height: 430,
        borderRadius: 3,
        borderWidth: 3,
        borderStyle: "solid",
      }}
    >
      <View {...args} selected={false} setSelected={() => {}} />
    </div>
  );

// Reuse that template for creating different stories
export const NoData = Template({
  data: { ...SampleData(), values: [] },
});

export const WithData = Template({
  data: SampleData(),
});
