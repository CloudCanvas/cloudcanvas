import React, { useEffect, useMemo } from "react";
import { Inspector } from "react-inspector";
import "./View.css";
import { dateToLogStr } from "../../../services/DateService";
import { topAlignedRow } from "../../../utils/layoutUtils";
import TextContent from "@cloudscape-design/components/text-content";
import SpaceBetween from "@cloudscape-design/components/space-between";
import { createStreamMachine } from "../../../machines/dataFetcherMachine";
import { useMachine } from "@xstate/react";
import EmptyDataPlaceholder from "../../base/EmptyDataPlaceholder/EmptyDataPlaceholder";
import { LogEntry, Model, Update } from "./model";
import { makeLambdaStreamController } from "./controller";
import { AwsComponentProps } from "../../../domain";
import { CustomData } from "../../form";
import ScrollFollower from "../../shared/ScrollFollower";

export default (props: AwsComponentProps<CustomData>) => {
  // Create the machine to manage streaming data.
  const streamMachine = useMemo(
    () =>
      createStreamMachine<Model, Update>({
        dataFetcher:
          props.dataFetcher ||
          makeLambdaStreamController({
            config: {
              customData: props.customProps,
              initialData: [],
            },
            ports: {
              aws: props.awsClient,
            },
          }),
        authorised: props.authorised,
        playing: props.playing,
      }),
    []
  );

  // @ts-ignore
  const [streamState, streamSend] = useMachine(streamMachine, {
    actions: {} as any,
  });

  useEffect(() => {
    if (props.playing) {
      streamSend("PLAYING");
    } else {
      streamSend("PAUSED");
    }
  }, [props.playing]);

  useEffect(() => {
    if (props.authorised) {
      streamSend("AUTHORISED");
    } else {
      streamSend("EXPIRED");
    }
  }, [props.authorised]);

  const hasData =
    streamState.context.data instanceof Array
      ? (streamState.context.data?.length || 0) > 0
      : !!streamState.context.data;

  if (!hasData) {
    return (
      <EmptyDataPlaceholder
        playing={props.playing}
        authorised={props.authorised}
      />
    );
  }

  return (
    <View
      data={streamState.context.data.slice(0, streamState.context.counter)}
      selected={props.selected}
      setSelected={() => props.setSelected(true)}
    />
  );
};

export type ViewProps = {
  data: Model;
  selected: boolean;
  setSelected: () => void;
};
export const View = ({ data, selected, setSelected }: ViewProps) => {
  return (
    <ScrollFollower dataCount={data.length} selected={selected}>
      {data.map((item, index) => (
        <div
          key={item.id}
          style={{
            display: "flex",
            alignItems: "center",
            background: index % 2 === 0 ? "white" : "#f2f2f2",
          }}
        >
          <Item key={item.id} r={item} selFn={setSelected} />
        </div>
      ))}
    </ScrollFollower>
  );
};

const Item = React.memo(({ r, selFn }: { r: LogEntry; selFn: () => void }) => {
  // TODO Use ReactCSSTransition stuff for this.
  const itemRef = React.useCallback((node: HTMLDivElement) => {
    if (!node) return;

    setTimeout(() => {
      node.className = `${node.className} item-enter`;
    }, 5);
  }, []);

  return (
    <div
      ref={itemRef}
      key={r.id}
      style={{
        padding: 8,
        flexDirection: "row",
        ...topAlignedRow,
      }}
      className="inspector item"
    >
      <TextContent>
        <SpaceBetween direction="horizontal" size="xs">
          <p>
            <small style={{ color: "rgb(22,25,31)" }}>
              {dateToLogStr(new Date(r.timestamp!))}
            </small>
          </p>
          <MessageOrObject msg={r.message || ""} selFn={selFn} />
        </SpaceBetween>
      </TextContent>
    </div>
  );
});

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
      <div onClick={selFn}>
        <Inspector theme="chromeLight" table={false} data={parsed} />
      </div>
    );
  } else {
    return (
      <TextContent>
        <p>
          <small style={{ color: "rgb(22,25,31)" }}>{str}</small>
        </p>
      </TextContent>
    );
  }
};
