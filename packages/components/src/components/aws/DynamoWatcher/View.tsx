import React, { useEffect, useMemo, useRef } from "react";
import { Inspector } from "react-inspector";
import "./View.css";
import { dateToLogStr } from "../../../services/DateService";
import { centeredRow, topAlignedRow } from "../../../utils/layoutUtils";
import TextContent from "@cloudscape-design/components/text-content";
import SpaceBetween from "@cloudscape-design/components/space-between";
import { diff, toSentenceCase } from "../../../utils/generalUtils";
import { createStreamMachine } from "../../../machines/dataFetcherMachine";
import { useMachine } from "@xstate/react";
import EmptyDataPlaceholder from "../../base/EmptyDataPlaceholder/EmptyDataPlaceholder";
import { DynamoRecord, Model, Update } from "./model";
import { makeDynamoStreamController } from "./controller";
import { AwsComponentProps } from "../../../domain";
import { CustomData } from "../../form";
import { useTrail, a } from "@react-spring/web";
// @ts-ignore
import { useIsVisible } from "react-is-visible";

export default (props: AwsComponentProps<CustomData>) => {
  // Create the machine to manage streaming data.
  const streamMachine = useMemo(
    () =>
      createStreamMachine<Model, Update>({
        dataFetcher:
          props.dataFetcher ||
          makeDynamoStreamController({
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

  return <View data={streamState.context.data} selected={props.selected} />;
};

export type ViewProps = {
  data: Model;
  selected: boolean;
};
export const View = ({ data, selected }: ViewProps) => {
  const bottomRef = useRef<HTMLDivElement | null>();

  const [atBottom, setAtBottom] = React.useState(true);
  const trail = useTrail(data.length, {
    config: { mass: 5, tension: 2000, friction: 200 },
    opacity: 1,
    // height: 70,
    from: { opacity: 0 },
    // from: { opacity: 0, height: 0 },
  });

  useEffect(() => {
    if (atBottom || !selected) {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [data.length]);

  return (
    <div style={{}}>
      {trail.map(({ ...style }, index) => (
        <a.div
          key={index}
          style={{
            ...style,
            background: index % 2 === 0 ? "white" : "#f2f2f2",
          }}
        >
          <a.div style={{ height: 70, display: "flex", alignItems: "center" }}>
            <Item key={data[index].id} r={data[index]} i={index} />
          </a.div>
        </a.div>
      ))}

      <AtBottomWatcher setAtBottom={setAtBottom} ref={bottomRef} />
    </div>
  );
};

const Item = React.memo(({ r, i }: { r: DynamoRecord; i: number }) => (
  <div
    key={r.id}
    style={{
      flex: 1,
      flexDirection: "row",
      willChange: "transform, opacity, height",
      minHeight: 50,
      ...centeredRow,
    }}
  >
    <div style={{ minWidth: 160 }}>
      <TextContent>
        <SpaceBetween direction="horizontal" size="xs">
          <p style={{ color: "gray" }}>{dateToLogStr(r.at)}</p>
          <p style={{ width: 70, paddingLeft: 20 }}>{toSentenceCase(r.type)}</p>
        </SpaceBetween>
      </TextContent>
    </div>

    <Inspector
      theme="chromeLight"
      table={false}
      data={
        r.type === "MODIFY" && r.oldImage && r.newImage
          ? { ...r.key, ...(diff(r.oldImage, r.newImage) || {}) }
          : r.newImage || r.key
      }
    />
  </div>
));

type AtBottomWatcherProps = {
  setAtBottom: (bottom: boolean) => void;
};
const AtBottomWatcher = React.forwardRef(
  (props: AtBottomWatcherProps, forwardRef) => {
    const innerRef = useRef<HTMLDivElement | null>(null);
    const isVisible = useIsVisible(innerRef);

    useEffect(() => {
      props.setAtBottom(isVisible);
    }, [isVisible]);

    return (
      // @ts-ignore
      <div ref={forwardRef} style={{ height: 10 }}>
        <div ref={innerRef} />
      </div>
    );
  }
);
