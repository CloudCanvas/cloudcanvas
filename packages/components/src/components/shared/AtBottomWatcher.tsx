import React, { useEffect, useRef } from "react";
// @ts-ignore
import { useIsVisible } from "react-is-visible";

export type AtBottomWatcherProps = {
  setAtBottom: (bottom: boolean) => void;
};

/**
 * Notifies the parent if it is out of view
 */
const AtBottomWatcher = React.forwardRef(
  (props: AtBottomWatcherProps, forwardRef) => {
    const innerRef = useRef<HTMLDivElement | null>(null);

    const isVisible = useIsVisible(innerRef);

    useEffect(() => {
      props.setAtBottom(isVisible);
    }, [isVisible]);

    return (
      // @ts-ignore
      <div ref={forwardRef} style={{ height: 20 }} className="at-bottom">
        <div ref={innerRef} />
      </div>
    );
  }
);

export default AtBottomWatcher;
