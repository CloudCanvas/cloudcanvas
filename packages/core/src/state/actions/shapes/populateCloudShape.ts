import { TLBoundsCorner, TLPointerInfo } from "@tldraw/core";
import { shapeUtils } from "shapes";
import type { Action } from "state/constants";
import { mutables } from "state/mutables";

export const populateCloudShape: Action = (data, payload: TLPointerInfo) => {
  const { page, pageState } = data;

  pageState.selectedIds.forEach((id) => {
    page.shapes[id].isGenerated = true;
  });
};
