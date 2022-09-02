import React, { useEffect, useMemo, useRef } from "react";
import { Inspector } from "react-inspector";
import "./View.css";
import { dateToLogStr } from "../../../services/DateService";
import { centeredRow } from "../../../utils/layoutUtils";
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
import ScrollFollower from "../../shared/ScrollFollower";

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
            background: index % 2 === 0 ? "#f2f2f2" : "white",
          }}
        >
          <Item key={item.id} r={item} selFn={setSelected} />
        </div>
      ))}
    </ScrollFollower>
  );
};

const Item = React.memo(
  ({ r, selFn }: { r: DynamoRecord; selFn: () => void }) => {
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
          flex: 1,
          flexDirection: "row",
          willChange: "transform, opacity",
          padding: 8,
          paddingTop: 16,
          paddingBottom: 16,
          ...centeredRow,
        }}
        className="inspector item"
      >
        <TextContent>
          <SpaceBetween direction="horizontal" size="xs">
            <p style={{ color: "gray" }}>{dateToLogStr(r.at)}</p>
            <p style={{ width: 70, paddingLeft: 20 }}>
              {toSentenceCase(r.type)}
            </p>
          </SpaceBetween>
        </TextContent>

        <div onClick={() => selFn()}>
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
      </div>
    );
  }
);
