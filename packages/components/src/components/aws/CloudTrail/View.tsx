import { AwsComponentProps } from "../../../domain";
import { createStreamMachine } from "../../../machines/dataFetcherMachine";
import EmptyDataPlaceholder from "../../base/EmptyDataPlaceholder/EmptyDataPlaceholder";
import { CustomData } from "../../form/v1";
import LogEntries from "../../layout/LogEntries/LogEntries";
import ScrollFollower from "../../shared/ScrollFollower";
import "./View.css";
import { makeCloudTrailController } from "./controller";
import { Model, Update } from "./model";
import { useInterpret, useSelector } from "@xstate/react";
import React, { useEffect, useMemo } from "react";

export default React.memo((props: AwsComponentProps<CustomData>) => {
  // Create the machine to manage streaming data.
  const streamMachine = useMemo(
    () =>
      createStreamMachine<Model, Update>({
        dataFetcher:
          props.dataFetcher ||
          makeCloudTrailController({
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

  if (!hasData) {
    return (
      <EmptyDataPlaceholder
        playing={props.playing}
        authorised={props.authorised}
        message={"Listening for updates..."}
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
