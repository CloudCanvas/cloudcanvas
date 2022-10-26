import SqsSampler, { View, ViewProps } from "./View";
import "bulma/css/bulma.css";
import React from "react";

export default {
  title: "components/aws/SqsSampler",
  component: SqsSampler,
  argTypes: {
    backgroundColor: { control: "color" },
  },
};

// Create a master template for mapping args to render the SqsSampler component
const Template = (args: Pick<ViewProps, "data">) => () =>
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
      <View {...args} selected={false} setSelected={() => {}} />
    </div>
  );

// Reuse that template for creating different stories
export const NoRecords = Template({ data: [] });

const sampleRecords = [
  {
    at: 1661846715963,
    message: JSON.stringify({ id: 1223, other: "Blah balh" }),
    timestamp: 1661846710504,
    id: Math.random() + "",
  },
  {
    at: 1661846715963,
    message: JSON.stringify({ id: 44, other: "More" }),
    timestamp: 1661846711651,
    id: Math.random() + "",
  },
  {
    at: 1661846715963,
    message: JSON.stringify({ id: 1, other: "Somethine else" }),
    timestamp: 1661846711711,
    id: Math.random() + "",
  },
  {
    at: 1661846715963,
    message: JSON.stringify({ id: 1, other: "hello" }),
    timestamp: 1661846711711,
    id: Math.random() + "",
  },
];

export const SampleDataLogs = Template({ data: sampleRecords });
