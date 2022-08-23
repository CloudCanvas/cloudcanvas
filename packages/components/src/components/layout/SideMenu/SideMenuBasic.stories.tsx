import React from "react";
import { BaseStory } from "../../../utils/storyUtils";
import SideMenuBasic, { SideMenuBasicProps } from "./SideMenuBasic";

export default {
  title: "components/layout/SideMenuBasic",
  component: SideMenuBasic,
  argTypes: {
    backgroundColor: { control: "color" },
  },
};

const defaultProps: SideMenuBasicProps = {};

// Create a master template for mapping args to render the DynamoWatcher component
const Template = (args: SideMenuBasicProps) => () =>
  (
    <BaseStory>
      <SideMenuBasic {...args} />
    </BaseStory>
  );
// Reuse that template for creating different stories

export const StandardMenu = Template(defaultProps);
