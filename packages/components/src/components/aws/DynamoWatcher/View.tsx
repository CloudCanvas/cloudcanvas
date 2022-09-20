import React, { useEffect, useMemo } from "react";
import "./View.css";
import { createStreamMachine } from "../../../machines/dataFetcherMachine";
import { useInterpret, useMachine, useSelector } from "@xstate/react";
import EmptyDataPlaceholder from "../../base/EmptyDataPlaceholder/EmptyDataPlaceholder";
import { Model, Update } from "./model";
import { makeDynamoStreamController } from "./controller";
import { AwsComponentProps } from "../../../domain";
import { CustomData } from "../../form";
import ScrollFollower from "../../shared/ScrollFollower";
import LogEntries from "../../layout/LogEntries/LogEntries";

export default React.memo((props: AwsComponentProps<CustomData>) => {
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

  const service = useInterpret(
    // @ts-ignore
    streamMachine,
    {
      actions: {} as any,
    }
  );

  const data = useSelector(service, (state) => state.context.data);

  useEffect(() => {
    if (props.playing) {
      service.send("PLAYING");
    } else {
      service.send("PAUSED");
    }
  }, [props.playing]);

  useEffect(() => {
    if (props.authorised) {
      service.send("AUTHORISED");
    } else {
      service.send("EXPIRED");
    }
  }, [props.authorised]);

  const hasData = data instanceof Array ? (data?.length || 0) > 0 : !!data;

  console.log("re rendering dyanmo watcher");

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
      data={data}
      selected={props.selected}
      setSelected={() => props.setSelected(true)}
    />
  );
});

export type ViewProps = {
  data: Model;
  selected: boolean;
  setSelected: () => void;
};
export const View = React.memo(({ data, selected, setSelected }: ViewProps) => {
  return (
    <ScrollFollower dataCount={data.length} selected={selected}>
      <LogEntries
        state={{
          entries: data,
        }}
        dispatch={{ selFn: setSelected }}
      />
    </ScrollFollower>
  );
});
