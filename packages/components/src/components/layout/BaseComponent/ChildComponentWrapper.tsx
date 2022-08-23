import React, { Ref } from "react";

type Props = {
  children: React.ReactNode;
};
export default React.forwardRef((props: Props, ref: Ref<HTMLDivElement>) => {
  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        flex: 1,
        overflow: "scroll",
        marginBottom: 3,
        cursor: "default",
      }}
      id="componentBody"
      className="componentBody"
    >
      {props.children}
    </div>
  );
});
