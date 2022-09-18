import React, { useEffect, useMemo } from "react";
import "./View.css";
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
              initialData: {
                from: new Date(+new Date() - 1000 * 60 * 60),
                to: new Date(),
                values: [],
              },
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
        message="Listening for updates, logs can take a few seconds to sync to cloudwatch.."
      />
    );
  }

  return (
    <View
      data={streamState.context.data}
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
  // TODO Show chart
  return <div></div>;
};
