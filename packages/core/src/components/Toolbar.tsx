import * as React from "react";
import { ArrowUpRight, Edit2, MousePointer, Square, X } from "react-feather";
import { machine } from "state/machine";
import styled from "stitches.config";

interface ToolbarProps {
  activeStates: string[];
  lastEvent: string;
}

const onToolSelect = (e: React.MouseEvent) => {
  machine.send("SELECTED_TOOL", { name: e.currentTarget.id });
};

const onReset = () => {
  machine.send("RESET");
};

export function Toolbar({ activeStates, lastEvent }: ToolbarProps) {
  return (
    <ToolbarContainer>
      <PrimaryTools>
        <PrimaryToolButton
          id="select"
          isActive={machine.isIn("select")}
          onClick={onToolSelect}
        >
          <Highlight>
            <MousePointer />
          </Highlight>
        </PrimaryToolButton>
        <PrimaryToolButton
          id="cloud"
          isActive={machine.isIn("cloud")}
          onClick={onToolSelect}
        >
          <HighlightNoPad>
            <svg viewBox="0 0 1024 1024">
              <g x1={80} y1={80}>
                <circle
                  cx="512"
                  cy="512"
                  r="512"
                  style={{
                    fill: machine.isIn("cloud") ? "#000" : "transparent",
                  }}
                />
                <path
                  d="M400.3 479.1c0 6.3.7 11.4 1.9 15.1 1.4 3.8 3.1 7.9 5.5 12.3.9 1.3 1.2 2.7 1.2 3.9 0 1.7-1 3.4-3.2 5.1l-10.7 7.1c-1.3.9-2.8 1.5-4.4 1.5-1.7 0-3.4-.9-5.1-2.4-2.3-2.5-4.3-5.1-6.1-8-1.9-3.3-3.7-6.6-5.3-10-13.3 15.7-30 23.5-50.1 23.5-14.3 0-25.7-4.1-34-12.2-8.3-8.2-12.6-19.1-12.6-32.7 0-14.5 5.1-26.2 15.5-35.1 10.4-8.9 24.2-13.3 41.7-13.3 5.8 0 11.8.5 18 1.4 6.3.9 12.8 2.2 19.6 3.8v-12.4c0-12.9-2.7-22-8-27.2-5.4-5.3-14.6-7.8-27.7-7.8-6 0-12.1.7-18.4 2.2s-12.4 3.4-18.4 5.8c-1.9.9-3.9 1.6-6 2.2-.9.3-1.8.4-2.7.5-2.4 0-3.6-1.7-3.6-5.3v-8.3c0-2.7.3-4.8 1.2-6 1.3-1.5 2.9-2.8 4.8-3.6 6-3.1 13.1-5.6 21.4-7.7 8.7-2.2 17.6-3.3 26.6-3.2 20.3 0 35.1 4.6 44.6 13.8 9.4 9.2 14.1 23.1 14.1 41.9v55.2l.2-.1zM331.2 505c5.6 0 11.4-1 17.5-3.1 6.1-2 11.6-5.8 16.2-10.9 2.7-3.2 4.8-6.8 5.8-10.9 1-4.1 1.7-9 1.7-14.8v-7.1c-5.2-1.3-10.4-2.2-15.7-2.9-5.3-.7-10.7-1-16-1-11.4 0-19.8 2.2-25.4 6.8-5.6 4.6-8.3 11.1-8.3 19.6 0 8 2 14 6.3 18 4.1 4.3 10 6.3 17.9 6.3zm136.7 18.4c-3.1 0-5.1-.5-6.5-1.7-1.4-1-2.6-3.4-3.6-6.6l-40-131.6c-.8-2.2-1.3-4.5-1.5-6.8 0-2.7 1.4-4.3 4.1-4.3h16.7c3.2 0 5.4.5 6.6 1.7 1.4 1 2.4 3.4 3.4 6.7l28.6 112.7 26.6-112.7c.9-3.4 1.9-5.6 3.2-6.7 2-1.3 4.4-1.9 6.8-1.7H526c3.2 0 5.5.5 6.8 1.7 1.3 1 2.6 3.4 3.2 6.7l26.9 114.1 29.5-114.1c1-3.4 2.2-5.6 3.4-6.7 2-1.3 4.3-1.9 6.6-1.7h15.9c2.7 0 4.3 1.4 4.3 4.3 0 .9-.2 1.7-.4 2.7-.3 1.5-.7 2.9-1.2 4.3l-41 131.6c-1 3.4-2.2 5.6-3.6 6.6-1.9 1.2-4.2 1.8-6.5 1.7h-14.7c-3.2 0-5.4-.5-6.8-1.7-1.3-1.2-2.5-3.4-3.2-6.8l-26.4-109.8L492.6 515c-.9 3.4-1.9 5.6-3.2 6.8-1.4 1.2-3.8 1.7-6.8 1.7l-14.7-.1zm218.8 4.6c-8.9 0-17.7-1-26.2-3.1-8.5-2-15.1-4.3-19.6-6.8-2.7-1.5-4.6-3.2-5.3-4.8-.7-1.5-1-3.1-1-4.8v-8.7c0-3.6 1.4-5.3 3.9-5.3 1 0 2 .2 3.1.5 1 .3 2.6 1 4.3 1.7 5.8 2.6 12.1 4.6 18.7 6 6.8 1.4 13.4 2 20.3 2 10.7 0 19.1-1.9 24.9-5.6 5.6-3.4 9-9.6 8.9-16.2.1-4.4-1.5-8.7-4.6-11.9-3.1-3.2-8.9-6.1-17.2-8.9l-24.7-7.7c-12.4-3.9-21.6-9.7-27.2-17.3-5.5-7.1-8.5-15.8-8.5-24.7 0-7.1 1.6-13.4 4.6-18.9 3.1-5.4 7.1-10.2 12.3-14 5.1-3.9 10.9-6.8 17.7-8.9 6.8-2 14-2.9 21.5-2.9 3.7 0 7.7.2 11.4.7 3.9.5 7.5 1.2 11.1 1.9 3.4.9 6.7 1.7 9.7 2.7 3.1 1 5.5 2 7.2 3.1 2 1 3.8 2.5 5.1 4.3 1.1 1.7 1.6 3.6 1.5 5.6v8c0 3.6-1.4 5.5-3.9 5.5-2.3-.3-4.5-1-6.5-2-10.3-4.5-21.4-6.8-32.7-6.6-9.7 0-17.4 1.5-22.7 4.8-5.3 3.2-8 8.2-8 15.1 0 4.8 1.7 8.9 5.1 12.1 3.4 3.2 9.7 6.5 18.7 9.4l24.2 7.6c12.2 3.9 21.1 9.4 26.4 16.4 5.3 7 7.8 15 7.8 23.8 0 7.3-1.5 14-4.4 19.8-3.1 5.8-7.2 10.9-12.4 15-5.3 4.3-11.6 7.3-18.9 9.5-7.9 2.4-15.9 3.6-24.6 3.6zm32.2 82.7c-56 41.4-137.4 63.3-207.4 63.3-98.1 0-186.5-36.3-253.2-96.6-5.3-4.8-.5-11.2 5.8-7.5 72.2 41.9 161.3 67.3 253.4 67.3 62.2 0 130.4-12.9 193.3-39.5 9.3-4.2 17.3 6.2 8.1 13zm23.3-26.5c-7.2-9.2-47.4-4.4-65.6-2.2-5.4.7-6.3-4.1-1.3-7.7 32-22.5 84.6-16 90.8-8.5 6.1 7.7-1.7 60.3-31.7 85.5-4.6 3.9-9 1.9-7-3.2 6.8-16.9 22-54.9 14.8-63.9z"
                  style={{ fill: machine.isIn("cloud") ? "#fff" : "#000" }}
                />
              </g>
            </svg>
          </HighlightNoPad>
        </PrimaryToolButton>
        <PrimaryToolButton
          id="eraser"
          isActive={machine.isIn("eraser")}
          onClick={onToolSelect}
        >
          <Highlight>
            <X />
          </Highlight>
        </PrimaryToolButton>
        <PrimaryToolButton
          id="pencil"
          isActive={machine.isIn("pencil")}
          onClick={onToolSelect}
        >
          <Highlight>
            <Edit2 />
          </Highlight>
        </PrimaryToolButton>
        <PrimaryToolButton
          id="box"
          isActive={machine.isIn("box")}
          onClick={onToolSelect}
        >
          <Highlight>
            <Square />
          </Highlight>
        </PrimaryToolButton>
        <PrimaryToolButton
          id="scrollbox"
          isActive={machine.isIn("scrollbox")}
          onClick={onToolSelect}
        >
          <Highlight>
            <Square />
          </Highlight>
        </PrimaryToolButton>
        <PrimaryToolButton
          id="arrow"
          isActive={machine.isIn("arrow")}
          onClick={onToolSelect}
        >
          <Highlight>
            <ArrowUpRight />
          </Highlight>
        </PrimaryToolButton>
      </PrimaryTools>
      <StatusBar>
        <div>
          <button onClick={onReset}>Reset</button>
          {activeStates
            .slice(1)
            .map((name) => {
              const state = name.split(".");
              return state[state.length - 1];
            })
            .join(" - ")}
        </div>
        <div>{lastEvent}</div>
      </StatusBar>
    </ToolbarContainer>
  );
}

const ToolbarContainer = styled("div", {
  display: "grid",
  gridTemplateColumns: "1fr",
  gridTemplateRows: "auto auto",
  gridRowGap: "$5",
  position: "fixed",
  bottom: "0",
  width: "100%",
  zIndex: "100",
});

const PrimaryTools = styled("div", {
  display: "flex",
  width: "fit-content",
  borderRadius: "100px",
  border: "1px solid $border",
  overflow: "hidden",
  padding: "$2",
  justifySelf: "center",
  backgroundColor: "$background",
});

const Highlight = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%",
  padding: 10,
  borderRadius: "100%",
  transition: "background-color .025s",
});

const HighlightNoPad = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%",
  padding: 3,
  borderRadius: "100%",
  transition: "background-color .025s",
});

const PrimaryToolButton = styled("button", {
  cursor: "pointer",
  width: "40px",
  height: "40px",
  padding: 2,
  margin: 0,
  background: "none",
  backgroundColor: "none",
  border: "none",
  color: "$text",

  variants: {
    isActive: {
      true: {
        color: "$background",
        [`& > ${Highlight}`]: {
          backgroundColor: "$text",
        },
      },
      false: {
        [`&:hover > ${Highlight}`]: {
          backgroundColor: "$hover",
        },
        "&:active": {
          color: "$background",
        },
        [`&:active > ${Highlight}`]: {
          backgroundColor: "$text",
        },
      },
    },
  },
});

const StatusBar = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "8px 12px",
  borderTop: "1px solid $border",
  fontSize: "$1",
  fontWeight: "$1",
  backgroundColor: "$background",
  overflow: "hidden",
  whiteSpace: "nowrap",

  "& button": {
    background: "none",
    border: "1px solid $text",
    borderRadius: 3,
    marginRight: "$3",
    fontFamily: "inherit",
    fontSize: "inherit",
    cursor: "pointer",
  },
});
