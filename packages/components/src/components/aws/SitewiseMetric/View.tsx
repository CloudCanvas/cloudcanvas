import React, { useEffect, useMemo } from "react";
import "./View.css";
import { createStreamMachine } from "../../../machines/dataFetcherMachine";
import { useMachine } from "@xstate/react";
import EmptyDataPlaceholder from "../../base/EmptyDataPlaceholder/EmptyDataPlaceholder";
import { Model, Update } from "./model";
import { makeController } from "./controller";
import { AwsComponentProps } from "../../../domain";
import { CustomData } from "../../form";
import LineChart from "@cloudscape-design/components/line-chart";
import { Box, Button } from "@cloudscape-design/components";

export default (props: AwsComponentProps<CustomData>) => {
  // Create the machine to manage streaming data.
  const streamMachine = useMemo(
    () =>
      createStreamMachine<Model, Update>({
        dataFetcher:
          props.dataFetcher ||
          makeController({
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
  return (
    <LineChart
      series={[
        {
          title: "Site 1",
          type: "line",
          data: [
            { x: new Date(1600963200000), y: 58020 },
            { x: new Date(1600964100000), y: 102402 },
            { x: new Date(1600965000000), y: 104920 },
            { x: new Date(1600965900000), y: 94031 },
            { x: new Date(1600966800000), y: 125021 },
            { x: new Date(1600967700000), y: 159219 },
            { x: new Date(1600968600000), y: 193082 },
            { x: new Date(1600969500000), y: 162592 },
            { x: new Date(1600970400000), y: 274021 },
            { x: new Date(1600971300000), y: 264286 },
            { x: new Date(1600972200000), y: 289210 },
            { x: new Date(1600973100000), y: 256362 },
            { x: new Date(1600974000000), y: 257306 },
            { x: new Date(1600974900000), y: 186776 },
            { x: new Date(1600975800000), y: 294020 },
            { x: new Date(1600976700000), y: 385975 },
            { x: new Date(1600977600000), y: 486039 },
            { x: new Date(1600978500000), y: 490447 },
            { x: new Date(1600979400000), y: 361845 },
            { x: new Date(1600980300000), y: 339058 },
            { x: new Date(1600981200000), y: 298028 },
            { x: new Date(1600982100000), y: 231902 },
            { x: new Date(1600983000000), y: 224558 },
            { x: new Date(1600983900000), y: 253901 },
            { x: new Date(1600984800000), y: 102839 },
            { x: new Date(1600985700000), y: 234943 },
            { x: new Date(1600986600000), y: 204405 },
            { x: new Date(1600987500000), y: 190391 },
            { x: new Date(1600988400000), y: 183570 },
            { x: new Date(1600989300000), y: 162592 },
            { x: new Date(1600990200000), y: 148910 },
            { x: new Date(1600991100000), y: 229492 },
            { x: new Date(1600992000000), y: 293910 },
          ],
          valueFormatter: function o(e) {
            return Math.abs(e) >= 1e9
              ? (e / 1e9).toFixed(1).replace(/\.0$/, "") + "G"
              : Math.abs(e) >= 1e6
              ? (e / 1e6).toFixed(1).replace(/\.0$/, "") + "M"
              : Math.abs(e) >= 1e3
              ? (e / 1e3).toFixed(1).replace(/\.0$/, "") + "K"
              : e.toFixed(2);
          },
        },
        {
          title: "Peak hours",
          type: "threshold",
          x: new Date(1600981800000),
        },
      ]}
      xDomain={[new Date(1600963200000), new Date(1600992000000)]}
      yDomain={[0, 500000]}
      i18nStrings={{
        filterLabel: "Filter displayed data",
        filterPlaceholder: "Filter data",
        filterSelectedAriaLabel: "selected",
        legendAriaLabel: "Legend",
        chartAriaRoleDescription: "line chart",
        xTickFormatter: (e) =>
          e
            .toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: !1,
            })
            .split(",")
            .join("\n"),
        yTickFormatter: undefined,
      }}
      ariaLabel="Single data series line chart"
      errorText="Error loading data."
      height={300}
      hideFilter
      hideLegend
      loadingText="Loading chart"
      recoveryText="Retry"
      xScaleType="time"
      xTitle="Time (UTC)"
      yTitle="Bytes transferred"
      empty={
        <Box textAlign="center" color="inherit">
          <b>No data available</b>
          <Box variant="p" color="inherit">
            There is no data available
          </Box>
        </Box>
      }
      noMatch={
        <Box textAlign="center" color="inherit">
          <b>No matching data</b>
          <Box variant="p" color="inherit">
            There is no matching data to display
          </Box>
          <Button>Clear filter</Button>
        </Box>
      }
    />
  );
};
