import React from "react";
import Button from "./Button";

export default {
  title: "components/basic/Button",
  component: Button,
  argTypes: {
    backgroundColor: { control: "color" },
  },
};

// Reuse that template for creating different stories
export const Examples = () => (
  <div>
    <h1>
      <Button>Do something</Button>
    </h1>
  </div>
);
