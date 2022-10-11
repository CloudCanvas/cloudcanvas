import * as React from "react";
import { Panel } from "../Primitives/Panel";
import styled from "stitches.config";
import { PageMenu } from "./PageMenu";
import { Menu } from "./Menu/Menu";
import { AccountMenu } from "./AccountMenu";

interface TopPanelProps {
  readOnly: boolean;
  showPages: boolean;
}

export function _TopPanel({ showPages }: TopPanelProps) {
  return (
    <StyledUI>
      <StyledTopPanel>
        {showPages && (
          <Panel side="left" id="TD-MenuPanel">
            <Menu readOnly={false} />
            <AccountMenu />
            {showPages && <PageMenu />}
          </Panel>
        )}
        <StyledSpacer />
      </StyledTopPanel>
    </StyledUI>
  );
}

const StyledUI = styled("div", {
  position: "absolute",
  top: 0,
  left: 0,
  height: "100%",
  width: "100%",
  padding: "8px 8px 0 8px",
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  zIndex: 101,
  pointerEvents: "none",
  "& > *": {
    pointerEvents: "all",
  },
});

const StyledTopPanel = styled("div", {
  width: "100%",
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  display: "flex",
  flexDirection: "row",
  pointerEvents: "none",
  "& > *": {
    pointerEvents: "all",
  },
});

const StyledSpacer = styled("div", {
  flexGrow: 2,
  pointerEvents: "none",
});

export const TopPanel = React.memo(_TopPanel);
