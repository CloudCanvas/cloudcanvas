import React, { Ref, useEffect, useRef } from "react";

type Props = {
  children: React.ReactNode;
  selected: boolean;
};

const listener = (event: WheelEvent) => {
  if (!event.ctrlKey) {
    event.stopPropagation();
  }
};

export default (props: Props) => {
  const ref = useRef<HTMLDivElement | undefined>(undefined);

  useEffect(() => {
    if (props.selected) {
      ref.current?.addEventListener("wheel", listener);
    } else {
      ref.current?.removeEventListener("wheel", listener);
    }

    return () => ref.current?.removeEventListener("wheel", listener);
  }, [props.selected]);

  return (
    <div
      // @ts-ignore
      ref={ref}
      style={{
        display: "flex",
        flex: 1,
        overflow: "scroll",
        marginBottom: 3,
        cursor: "default",
        overscrollBehavior: props.selected ? "contain" : "auto",
      }}
      id="componentBody"
      className="componentBody"
    >
      {props.children}
    </div>
  );
};
