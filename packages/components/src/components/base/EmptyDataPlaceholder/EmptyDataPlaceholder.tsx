import { TextContent } from "@cloudscape-design/components";
import React from "react";
import { centered } from "../../../utils/layoutUtils";

export default ({
  authorised,
  playing,
}: {
  authorised: boolean;
  playing: boolean;
}) => {
  return (
    <div style={{ ...centered, flex: 1 }}>
      <TextContent>
        {!authorised && <p>Authorisation has expired, refresh to view</p>}
        {authorised && !playing && <p>Paused</p>}
        {authorised && playing && <p>Listening for updates...</p>}
      </TextContent>
    </div>
  );
};
