import { AwsComponentProps } from "../../../domain";
import { createStreamMachine } from "../../../machines/dataFetcherMachine";
import Button from "../../basic/Button";
import { CustomData } from "../../form/v1";
import "./View.css";
import { makeController } from "./controller";
import { Model, Update } from "./model";
import { TextContent } from "@cloudscape-design/components";
import { useInterpret, useSelector } from "@xstate/react";
import React, { useEffect, useMemo } from "react";

export default (props: AwsComponentProps<CustomData>) => {
  const streamMachine = useMemo(
    () =>
      createStreamMachine<Model, Update>({
        dataFetcher:
          props.dataFetcher ||
          makeController({
            config: {
              customData: props.customProps,
              initialData: {
                status: "INSUFFICIENT_DATA",
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

  const resourceUrl = `https://${props.access.region}.console.aws.amazon.com/cloudwatch/home?region=${props.access.region}#alarmsV2:alarm/${props.customProps.value}`;

  return <View data={data} navigateTo={() => props.navigateTo(resourceUrl)} />;
};

export type ViewProps = {
  data: Model;
  navigateTo: () => void;
};

export const View = React.memo(({ data, navigateTo }: ViewProps) => {
  const [bgColor, textColor] = colorForStatus(data.status);
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: bgColor,
        padding: "16px",
        position: "relative",
      }}
    >
      <TextContent>
        <h1 style={{ color: textColor }}>{textForStatus(data.status)}</h1>
      </TextContent>
      <TextContent>
        <p style={{ color: textColor }}>{data.reason}</p>
      </TextContent>

      <div style={{ position: "absolute", bottom: 10, right: 10 }}>
        <Button onClick={navigateTo}>View in AWS console</Button>
      </div>
    </div>
  );
});

const colorForStatus = (status: Model["status"]) => {
  if (status === "ALARM") {
    return ["#f3d8d8", "black"];
  } else if (status === "INSUFFICIENT_DATA") {
    return ["#f0e4dc", "#cca387"];
  } else {
    return ["#ddeddf", "#8cbe8b"];
  }
};

const textForStatus = (status: Model["status"]) => {
  if (status === "ALARM") {
    return "Alarm 🚨";
  } else if (status === "INSUFFICIENT_DATA") {
    return "Insufficient data 🤔";
  } else {
    return "All good 👍";
  }
};
