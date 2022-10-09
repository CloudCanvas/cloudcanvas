import React from "react";
// import { Meta } from "@storybook/react/types-6-0";
// import { Story } from "@storybook/react";
import Command, { AddResourceProps } from "./addResource";
import { sampleOrgs } from "../../../utils/storyUtils";
import { componentCatalog } from "../../../domain";

export default {
  title: "components/form/v2/Command",
  component: Command,
  argTypes: {
    backgroundColor: { control: "color" },
  },
};

const defaultProps: AddResourceProps = {
  componentCatalog: componentCatalog,
  organisations: sampleOrgs,
  credentials: [
    {
      defaultRegion: "eu-central-1",
      nickname: "My Play Account",
      accessKeyId: "1234567",
    },
    {
      defaultRegion: "ap-southeast-2",
      nickname: "My Work Account",
      accessKeyId: "34567890",
    },
  ],
  // dataFetcher: async (_comp, _access, prefix) => {
  //   console.log(`fetching with prefix: ${prefix}`);
  //   await new Promise((resolve) => setTimeout(resolve, 1000));
  //   return [1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => ({
  //     label: `Table ${i}`,
  //     value: `Table ${i}`,
  //   }));
  // },
  onAddShape: (shape) => {
    console.log("Added a shape");
    console.log(shape);
  },
};

// Create a master template for mapping args to render the DynamoWatcher component
const Template = (args: AddResourceProps) => () => <Command {...args} />;

// Reuse that template for creating different stories
export const StandardResourceForm = Template(defaultProps);
