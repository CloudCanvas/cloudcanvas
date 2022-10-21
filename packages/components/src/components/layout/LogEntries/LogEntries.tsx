import React, { useEffect, useId } from "react";
import { Icon } from "@cloudscape-design/components";
import { Inspector } from "react-inspector";
import { dateToLogStr } from "../../../services/DateService";
import BaseLogModel from "../../aws/shared/BaseModel";
import { useSpring, animated } from "@react-spring/web";
import "./LogEntries.css";

export type LogEntries = {
  at: number;
  /**
   * Small piece of text to highlight it
   */
  highlightText?: string;
  /**
   * The type of message. Default is info
   */
  type?: "info" | "warning" | "error";
  message: string;
};

export type LogEntriesProps = {
  state: {
    entries: BaseLogModel[];
  };
  dispatch: {
    selFn: () => void;
  };
};

export default React.memo((props: LogEntriesProps) => {
  const { entries } = props.state;

  const id = useId();

  return (
    <table className="aws-ui__table">
      <thead style={{ height: 0 }}>
        <tr>
          <td style={{ width: 24 }}></td>
          <td style={{ width: 80 }}></td>
          <td style={{ minWidth: 140 }}></td>
          <td style={{ width: 16 }}></td>
        </tr>
      </thead>

      <tbody>
        {entries.map((entry, i) => (
          <LogEntry entry={entry} i={i} key={`${id}-${i}`} />
        ))}
      </tbody>
    </table>
  );
});

const LogEntry = React.memo(
  ({ entry, i }: { entry: BaseLogModel; i: number }) => {
    const [expanded, setExpanded] = React.useState(false);

    const [open, toggle] = React.useState(false);
    const springProps = useSpring({
      scale: open ? 1 : 0.99,
      opacity: open ? 1 : 0,
      height: open ? 32 : 0,
    });

    const [width, setWidth] = React.useState(0);

    const onClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      event.stopPropagation();
      setExpanded(!expanded);
    };

    const rowRef = React.useCallback((node: HTMLTableRowElement) => {
      setWidth(node?.getBoundingClientRect().width);
    }, []);

    useEffect(() => {
      toggle(true);
    }, []);

    return (
      <animated.tr
        className={`awsui-table-row item ${
          i % 2 === 1 ? "awsui-table-row--odd" : ""
        }`}
        style={springProps}
        ref={rowRef}
      >
        <td>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 32,
            }}
            onClick={onClick}
          >
            <span
              style={{
                transform: expanded ? "rotate(180deg)" : "rotate(90deg)",
                transition: "transform 0.1s ease-in-out",
              }}
            >
              <Icon name="caret-up" />
            </span>
          </span>
        </td>
        <td style={{ overflow: "visible", width: 80 }}>
          <span>
            <span className="logs__log-events-table__cell" onClick={onClick}>
              <span className="logs__log-events-table__timestamp-cell">
                {dateToLogStr(new Date(entry.at))}
              </span>
            </span>
            {expanded && (
              <div
                className="logs__log-events-table__formatted-message"
                style={{
                  width: width,
                  transition: "height 0.2s ease-in-out",
                }}
                data-testid="logs__log-events-table__formatted-message"
              >
                <div className="logs__log-events-table__content">
                  <MessageOrObject msg={entry.message} selFn={() => {}} />
                </div>
              </div>
            )}
          </span>
        </td>
        <td style={{ minWidth: 140 }}>
          <span
            className="logs__log-events-table__cell logs__log-events-table__cell_message logs__log-events-table__cursor-text"
            onClick={onClick}
          >
            {entry.highlightText ? (
              <span className={`pill ${entry.type || "info"}-pill`}>
                {entry.highlightText}
              </span>
            ) : null}
            <span data-testid="logs__log-events-table__message">
              {entry.message}
            </span>
          </span>
        </td>
        <td></td>
      </animated.tr>
    );
  }
);

const tryParse = (possibleJSON: string) => {
  try {
    const parsed = JSON.parse(possibleJSON);
    return {
      parsed,
      str: possibleJSON,
    };
  } catch (err) {
    return {
      parsed: undefined,
      str: possibleJSON,
    };
  }
};

const MessageOrObject = ({
  msg,
  selFn,
}: {
  msg: string;
  selFn: () => void;
}) => {
  const { parsed, str } = tryParse(msg);

  if (parsed) {
    return (
      <div onClick={selFn} className="logs__log-events-table__inspector">
        <Inspector
          theme="chromeLight"
          table={false}
          data={parsed}
          expandLevel={1}
        />
      </div>
    );
  } else {
    return <div>{msg}</div>;
  }
};
