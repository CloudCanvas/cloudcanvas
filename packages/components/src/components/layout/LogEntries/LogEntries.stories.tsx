import React from "react";
import LogEntries, { LogEntriesProps } from "./LogEntries";
import "bulma/css/bulma.css";
import SampleLogEntry from "./SampleLogEntry";
import BaseLogModel from "../../aws/shared/BaseModel";

export default {
  title: "components/layout/LogEntry",
  component: LogEntries,
  argTypes: {
    backgroundColor: { control: "color" },
  },
};

const defaultEntry = {
  at: +new Date(),
  message: "Here is a log entry.",
};

const defaultProps: LogEntriesProps = {
  state: {
    entries: [defaultEntry, defaultEntry],
  },
  dispatch: {
    selFn: () => console.log("selected"),
  },
};

// Create a master template for mapping args to render the DynamoWatcher component
const Template = (entries?: BaseLogModel[]) => () =>
  (
    <div
      className="template-wrapper"
      style={{
        width: "800px",
        height: "400px",
        overflow: "hidden",
        borderWidth: 3,
        borderRadius: 15,
        borderStyle: "solid",
        borderColor: "black",
      }}
    >
      <LogEntries
        {...{
          ...defaultProps,
          state: {
            ...defaultProps.state,
            entries: entries || defaultProps.state.entries,
          },
        }}
      />
    </div>
  );
// Reuse that template for creating different stories

export const StandarEntry = Template();

export const ReallyLongEntry = Template([
  {
    at: +new Date(),
    message: `Here is a really long entry with lots of text and a big JSON blob coming afterwards; ${JSON.stringify(
      SampleLogEntry
    )}`,
  },
  {
    at: +new Date(),
    message: `${JSON.stringify(SampleLogEntry)}`,
  },
]);
