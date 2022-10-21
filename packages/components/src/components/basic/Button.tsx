import { Button, ButtonProps } from "@cloudscape-design/components";
import React from "react";
import "../../base.css";

export default (props: ButtonProps) => {
  return <Button {...props}>{props.children}</Button>;
};
