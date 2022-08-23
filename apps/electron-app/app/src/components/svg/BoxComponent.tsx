import { Component } from "@cloudcanvas/components/lib/domain/core";
import * as React from "react";
import SvgContainer from "./SvgContainer";

export interface BoxShape extends Component {
  type: "box";
  size: number[];
}

type Props = {
  size: number[];
  children?: React.ReactNode;
};

export const BASE_TAB_HGT = 40;
export const BoxComponent = ({ size, children }: Props) => {
  const box = React.useRef<HTMLElement | undefined | null>();
  const [containerSize, setContainerSize] = React.useState<{
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
        width: size[0],
        height: size[1],
      }}
      ref={(divElm) => (box.current = divElm)}>
      <SvgContainer>
        {/* <rect
          width={size[0]}
          height={size[1]}
          stroke="black"
          strokeWidth={3}
          strokeLinejoin="round"
          fill="none"
          rx={4}
          pointerEvents="all"></rect> */}

        <path
          d={`
          M0,10
          L0,${size[1] - 10}
          a10,10 0 0,0 10,10
          L${size[0] - 10},${size[1]}
          a10,10 0 0,0 10,-10
          L${size[0]},10
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
          x2={size[0]}
          y1={BASE_TAB_HGT}
          y2={BASE_TAB_HGT}
          stroke="black"
          strokeWidth={2}
        />

        {/* <rect
            width={size[0]}
            height={size[1] - BASE_TAB_HGT}
            y={BASE_TAB_HGT}
            stroke="black"
            strokeWidth={3}
            strokeLinejoin="round"
            fill="none"
            rx={4}
            pointerEvents="all"></rect> */}
      </SvgContainer>
      <div style={{ position: "absolute", top: 0, left: 0, ...containerSize }}>
        {children}
      </div>
    </div>
  );
};
