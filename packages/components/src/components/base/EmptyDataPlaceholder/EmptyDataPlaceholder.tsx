import { centered } from "../../../utils/layoutUtils";
import { TextContent } from "@cloudscape-design/components";
import React from "react";

export default ({
  authorised,
  playing,
  message,
}: {
  authorised: boolean;
  playing: boolean;
  message?: string;
}) => {
  return (
    <div style={{ ...centered, flex: 1, padding: 16 }}>
      <TextContent>
        {!authorised && <p>Authorisation has expired, refresh to view</p>}
        {authorised && !playing && <p>Paused</p>}
        {authorised && playing && (
          <p>{message || "Listening for updates..."}</p>
        )}
      </TextContent>
    </div>
  );
};
