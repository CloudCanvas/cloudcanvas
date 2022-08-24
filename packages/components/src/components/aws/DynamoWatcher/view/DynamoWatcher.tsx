import React, { useEffect, useMemo } from "react";
import { Inspector } from "react-inspector";
import "./DynamoWatcher.css";
import { dateToLogStr } from "../../../../services/DateService";
import { topAlignedRow } from "../../../../utils/layoutUtils";
import TextContent from "@cloudscape-design/components/text-content";
import SpaceBetween from "@cloudscape-design/components/space-between";
import { diff, toSentenceCase } from "../../../../utils/generalUtils";
import { createStreamMachine } from "../../../../machines/dataFetcherMachine";
import { useMachine } from "@xstate/react";
import EmptyDataPlaceholder from "../../../base/EmptyDataPlaceholder/EmptyDataPlaceholder";
import { DynamoWatcherModel, DynamoWatcherUpdate } from "../model";
import { makeDynamoStreamDataFetcher } from "../controller/dynamoStreamDataFetcher";
import { AwsComponentProps } from "../../../../domain";

export type DynamoWatcherProps = AwsComponentProps;

export default (props: DynamoWatcherProps) => {
  // Create the machine to manage streaming data.
  const streamMachine = useMemo(
    () =>
      createStreamMachine<DynamoWatcherModel, DynamoWatcherUpdate>({
        dataFetcher:
          props.dataFetcher ||
          makeDynamoStreamDataFetcher({
            config: {
              tableName: props.customProps.tableName,
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

  return <DynamoWatcherView data={streamState.context.data} />;
};

export type DynamoWatcherViewProps = {
  data: DynamoWatcherModel;
};
export const DynamoWatcherView = ({ data }: DynamoWatcherViewProps) => {
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
              borderBottomWidth: 1,
              borderStyle: "dotted",
              borderColor: "lightgray",
              ...topAlignedRow,
            }}
          >
            <div style={{ minWidth: 160 }}>
              <TextContent>
                <SpaceBetween direction="horizontal" size="xs">
                  <p style={{ color: "gray" }}>{dateToLogStr(r.at)}</p>
                  <p style={{ width: 70, paddingLeft: 20 }}>
                    {toSentenceCase(r.type)}
                  </p>
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
        );
      })}
    </div>
  );
};
