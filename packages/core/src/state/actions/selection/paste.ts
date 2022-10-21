import { nanoid } from "nanoid";
import { Shape } from "shapes";
import type { Action } from "state/constants";

export const paste: Action = (data) => {
  const ID = `${data.page.id}-copied`;

  const copiedStr = localStorage.getItem(ID);

  if (!copiedStr) return;

  const selectedShapes: Shape[] = JSON.parse(copiedStr);

  const newShapes = selectedShapes.map((s) => ({
    ...s,
    id: nanoid(),
    point: [s.point[0] + 50, s.point[1] + 50],
  }));

  for (const shape of newShapes) {
    data.page.shapes[shape.id] = shape;
  }

  data.pageState.selectedIds = newShapes.map((ns) => ns.id);
};
