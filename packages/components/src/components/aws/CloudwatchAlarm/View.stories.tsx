import SitewiseMetric, { View, ViewProps } from "./View";
import "bulma/css/bulma.css";
import React from "react";

export default {
  title: "components/aws/CloudwatchAllarm",
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
      <View {...args} />
    </div>
  );

// Reuse that template for creating different stories
export const Okay = Template({
  data: { status: "OK" },
});

export const InsufficientData = Template({
  data: { status: "INSUFFICIENT_DATA", reason: "No data bro..." },
});

export const Alarm = Template({
  data: { status: "ALARM", reason: "You havee hit your account quota." },
});

export const AlarmLongReason = Template({
  data: {
    status: "ALARM",
    reason:
      "You have hit your account quota for some obscure reason that is very like AWS but we won't really give you any proper information on it and you'll have to dig really deeply to figure out what is going on and in the meantimee your customers will be getting really pisseed and everyone will think your a dumbass for not being able to figire it out like weren't you supposeed to test all this stuff hahaha.",
  },
});
