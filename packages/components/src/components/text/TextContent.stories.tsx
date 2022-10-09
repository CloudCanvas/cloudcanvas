import React from "react";
import TextContent from "./TextContent";
import { sampleOrgs } from "../../utils/storyUtils";

export default {
  title: "components/text/TextContent",
  component: TextContent,
  argTypes: {
    backgroundColor: { control: "color" },
  },
};

// Reuse that template for creating different stories
export const Examples = () => (
  <div>
    <h1>
      <TextContent>h1 Header</TextContent>
    </h1>

    <h2>
      <TextContent>h2 Header</TextContent>
    </h2>

    <h3>
      <TextContent>h3 Header</TextContent>
    </h3>

    <p>
      <TextContent>p paragaph</TextContent>
    </p>
  </div>
);
