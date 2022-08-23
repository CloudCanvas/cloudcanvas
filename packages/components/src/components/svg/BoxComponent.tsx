import * as React from "react";
import { BASE_TAB_HGT } from "../layout/BaseComponent";
import SvgContainer from "./SvgContainer";

type Props = {
  children?: React.ReactNode;
};

/**
 * A base container for a React component on the canvas.
 * @param
 * @returns
 */
export const BoxComponent = ({ children }: Props) => {
  const box = React.useRef<HTMLElement | undefined | null>();
  const [{ width, height }, setContainerSize] = React.useState<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0,
  });

  React.useEffect(() => {
    if (!box.current) return;

    setContainerSize({
      width: box.current.clientWidth,
      height: box.current.clientHeight,
    });
  }, [box.current]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
      ref={(divElm) => (box.current = divElm)}
    >
      <SvgContainer>
        <path
          d={`
          M0,10
          L0,${height - 10}
          a10,10 0 0,0 10,10
          L${width - 10},${height}
          a10,10 0 0,0 10,-10
          L${width},10
          a10,10 0 0,0 -10,-10
          L10,0
          a10,10 0 0,0 -10,10
          Z`}
          stroke="black"
          strokeWidth={3}
          fill="transparent"
        />
        <line
          x1={0}
          x2={width}
          y1={BASE_TAB_HGT}
          y2={BASE_TAB_HGT}
          stroke="black"
          strokeWidth={2}
        />
      </SvgContainer>
      <div style={{ position: "absolute", top: 0, left: 0, width, height }}>
        {children}
      </div>
    </div>
  );
};
