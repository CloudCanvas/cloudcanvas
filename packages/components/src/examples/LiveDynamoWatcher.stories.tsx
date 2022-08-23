import React from "react";
import LiveDynamoWatcher from "./LiveDynamoWatcher";

export default {
  title: "components/examples/LiveDynamoWatcher",
  component: LiveDynamoWatcher,
  argTypes: {
    backgroundColor: { control: "color" },
  },
};

// Create a master template for mapping args to render the DynamoWatcher component
// const Template: Story = <LiveDynamoWatcher />;

// export const DynamoWatcherExample = Template.bind({});
const DynamoWatcherExample = {
  args: {},
};

DynamoWatcherExample.args = {};
