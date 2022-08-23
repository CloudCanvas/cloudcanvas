import * as React from "react";

import "./SvgContainer.css";

interface SvgContainerProps extends React.SVGProps<SVGSVGElement> {
  children: React.ReactNode;
}

export default (props: SvgContainerProps) => {
  return (
    <svg className="svgContainer">
      <g className="tl-centered-g">{props.children}</g>
    </svg>
  );
};
