import React, { useEffect, useMemo } from "react";
import "./View.css";
import { createStreamMachine } from "../../../machines/dataFetcherMachine";
import { useInterpret, useMachine, useSelector } from "@xstate/react";
import EmptyDataPlaceholder from "../../base/EmptyDataPlaceholder/EmptyDataPlaceholder";
import { Model, Update } from "./model";
import { makeController } from "./controller";
import { AwsComponentProps } from "../../../domain";
import { CustomData } from "../../form";
import LineChart from "@cloudscape-design/components/line-chart";
import { Box } from "@cloudscape-design/components";

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

  const hasData = data && data.values.length > 0;

  if (!hasData) {
    return (
      <EmptyDataPlaceholder
        playing={props.playing}
        authorised={props.authorised}
        message="Listening for updates, metrics can take a few seconds to sync to Sitewise.."
      />
    );
  }

  // console.log("streamState.context.data");
  // console.log(streamState.context.data);

  console.log("Re-rendering sitewise watcher");

  return <View data={data} />;
};

export type ViewProps = {
  data: Model;
};
export const View = React.memo(({ data }: ViewProps) => {
  const min = Math.min(...data.values.map((d) => d.y));
  const max = Math.max(...data.values.map((d) => d.y));

  return (
    <div style={{ padding: 8, flex: 1, width: "100%", height: "100%" }}>
      <LineChart
        series={[
          {
            title: "",
            type: "line",
            data: data.values,
            // valueFormatter: function o(e) {
            //   return Math.abs(e) >= 1e9
            //     ? (e / 1e9).toFixed(1).replace(/\.0$/, "") + "G"
            //     : Math.abs(e) >= 1e6
            //     ? (e / 1e6).toFixed(1).replace(/\.0$/, "") + "M"
            //     : Math.abs(e) >= 1e3
            //     ? (e / 1e3).toFixed(1).replace(/\.0$/, "") + "K"
            //     : e.toFixed(2);
            // },
          },
          // {
          //   title: "Peak hours",
          //   type: "threshold",
          //   x: new Date(1600981800000),
          // },
        ]}
        xDomain={[data.from, data.to]}
        yDomain={[min > 0 ? 0 : min, max]}
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
        yTitle="Last hours data"
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
          </Box>
        }
      />
    </div>
  );
});
