import React from "react";
import { Inspector } from "react-inspector";
import "./DynamoWatcher.css";
import { dateToLogStr } from "../../services/DateService";
import { topAlignedRow } from "../../utils/layoutUtils";
import TextContent from "@cloudscape-design/components/text-content";
import SpaceBetween from "@cloudscape-design/components/space-between";
import { DynamoWatcherModel } from "./model";
import { diff, toSentenceCase } from "../../utils/generalUtils";

export type DynamoWatcherComponent = {
  tableName: string;
};

export interface DynamoWatcherProps {
  data: DynamoWatcherModel;
}

export default (props: DynamoWatcherProps) => {
  return (
    <div
      style={{
        paddingTop: 0,
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {props.data?.map((r, i) => {
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
