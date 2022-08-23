/**
 * Quickly adding some things here that can be impoved later
 */

import { LayoutManager } from "../ports/layout";

export const makeDirtyLayoutManager = (): LayoutManager => {
  return {
    getCanvasScale: () => {
      try {
        const canvasElement = document.getElementById("canvasContainer")!;

        const [scaleX, _a, _b, scaleY] = getComputedStyle(canvasElement)
          .transform.replace(/matrix\(|\)/g, "")
          .split(",");

        return {
          scaleX: 1 / parseFloat(scaleX),
          scaleY: 1 / parseFloat(scaleY),
        };
      } catch (err) {
        console.log(err);
        return {
          scaleX: 1,
          scaleY: 1,
        };
      }
    },
  };
};
