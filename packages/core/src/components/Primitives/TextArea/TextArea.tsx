import * as React from "react";
import { SmallIcon } from "../SmallIcon";
import styled from "stitches.config";

export interface TextAreaProps extends React.HTMLProps<HTMLTextAreaElement> {
  icon?: React.ReactElement;
  valid: boolean;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ icon, valid, ...rest }, ref) => {
    return (
      <StyledInputWrapper>
        <StyledTextArea
          {...rest}
          ref={ref}
          autoCorrect="off"
          spellCheck={"false"}
          style={{
            background: valid ? "#d7eddb" : undefined,
            color: valid ? "gray" : undefined,
          }}
        />
        {icon ? <StyledInputIcon>{icon}</StyledInputIcon> : null}
      </StyledInputWrapper>
    );
  }
);

const StyledInputWrapper = styled("div", {
  position: "relative",
  width: "100%",
  height: "min-content",
});

const StyledTextArea = styled("textarea", {
  color: "$text",
  border: "none",
  textAlign: "left",
  width: "100%",
  paddingLeft: "$3",
  paddingRight: "$6",
  backgroundColor: "$background",
  height: "60px",
  outline: "none",
  fontFamily: "$ui",
  fontSize: "$1",
  // "&:focus": {
  //   backgroundColor: "$hover",
  // },
  borderRadius: "$2",
});

const StyledInputIcon = styled(SmallIcon, {
  top: 0,
  right: 0,
  position: "absolute",
  paddingLeft: "$3",
  paddingRight: "$3",
  pointerEvents: "none",
  color: "$text",
});
