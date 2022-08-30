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
import { Model, Update } from "./model";
import { makeLambdaStreamController } from "./controller";
import { AwsComponentProps } from "../../../domain";
import { CustomData } from "../../form";

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
              delay: 1000,
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

  return <View data={streamState.context.data} />;
};

export type ViewProps = {
  data: Model;
};
export const View = ({ data }: ViewProps) => {
  return (
    <div
      style={{
        paddingTop: 0,
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {data?.map((r, i) => {
        return (
          <div
            key={r.id}
            style={{
              padding: 8,
              flexDirection: "row",
              borderRightWidth: 0,
              borderLeftWidth: 0,
              borderTopWidth: i === 0 ? 1 : 0,
              background: i % 2 === 0 ? "white" : "#f2f2f2",
              ...topAlignedRow,
            }}
          >
            <div style={{ minWidth: 160 }}>
              <TextContent>
                <SpaceBetween direction="horizontal" size="xs">
                  <p>
                    <small style={{ color: "rgb(22,25,31)" }}>
                      {dateToLogStr(new Date(r.timestamp!))}
                    </small>
                  </p>
                  <MessageOrObject msg={r.message || ""} />
                </SpaceBetween>
              </TextContent>
            </div>
          </div>
        );
      })}
    </div>
  );
};

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

const MessageOrObject = ({ msg }: { msg: string }) => {
  const { parsed, str } = tryParse(msg);

  if (parsed) {
    return <Inspector theme="chromeLight" table={false} data={parsed} />;
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
