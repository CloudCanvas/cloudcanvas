import React, { useEffect, useMemo } from "react";
import "./View.css";
import { createStreamMachine } from "../../../machines/dataFetcherMachine";
import { useInterpret, useSelector } from "@xstate/react";
import EmptyDataPlaceholder from "../../base/EmptyDataPlaceholder/EmptyDataPlaceholder";
import { Model, Update } from "./model";
import { makeController } from "./controller";
import { CustomData } from "../../form/v1";
import LineChart from "@cloudscape-design/components/line-chart";
import { Box } from "@cloudscape-design/components";
import { AWS } from "@cloudcanvas/types";

export default ({ data }: { data: Model }) => {
  // const streamMachine = useMemo(
  //   () =>
  //     createStreamMachine<Model, Update>({
  //       dataFetcher: makeController({
  //         customData: customData,
  //         initialData: {
  //           from: new Date(+new Date() - 1000 * 60 * 60),
  //           to: new Date(),
  //           values: [],
  //         },
  //         aws,
  //       }),
  //       authorised: true,
  //       playing: true,
  //     }),
  //   []
  // );

  // const service = useInterpret(
  //   // @ts-ignore
  //   streamMachine,
  //   {
  //     actions: {} as any,
  //   }
  // );

  // const data = useSelector(service, (state) => state.context.data);

  // useEffect(() => {
  //   if (props.playing) {
  //     service.send("PLAYING");
  //   } else {
  //     service.send("PAUSED");
  //   }
  // }, [props.playing]);

  // useEffect(() => {
  //   if (props.authorised) {
  //     service.send("AUTHORISED");
  //   } else {
  //     service.send("EXPIRED");
  //   }
  // }, [props.authorised]);

  const hasData = data && data.values.length > 0;

  if (!hasData) {
    return (
      <EmptyDataPlaceholder
        // playing={props.playing}
        // authorised={props.authorised}
        playing={true}
        authorised={true}
        message="Listening for updates, metrics can take a few seconds to sync to Sitewise.."
      />
    );
  }

  return <View data={data} />;
};

export type ViewProps = {
  data: Model;
};
export const View = React.memo(({ data }: ViewProps) => {
  const [height, setHeight] = React.useState(0);
  const min = Math.min(...data.values.map((d) => d.y));
  const max = Math.max(...data.values.map((d) => d.y));

  const divRef = React.useRef<HTMLDivElement | null>();

  useEffect(() => {
    // TODO Deal with resize
    if (divRef.current) {
      setHeight(divRef.current.getBoundingClientRect().height - 40);
    }
  }, []);

  return (
    <div
      style={{
        padding: 8,
        paddingTop: 16,
        flex: 1,
        width: "100%",
        height: "100%",
      }}
      ref={(ref) => (divRef.current = ref)}
    >
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
        ]}
        xDomain={[data.from, data.to]}
        yDomain={[min > 0 ? 0 : min, max + 1]}
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
        height={height}
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
