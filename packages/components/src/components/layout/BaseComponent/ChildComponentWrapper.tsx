import React, { Ref, useEffect, useRef } from "react";

type Props = {
  children: React.ReactNode;
  selected: boolean;
};
export default (props: Props) => {
  const ref = useRef<HTMLDivElement | undefined>(undefined);

  useEffect(() => {
    const listener = (event: any) => {
      if (!event.ctrlKey && props.selected) {
        event.stopPropagation();
      }
    };

    // This feels like I'm missing some knowledge of a cleaner way but fuck it, it'll do for now
    ref.current?.removeEventListener("wheel", listener);
    ref.current?.addEventListener("wheel", listener);
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
