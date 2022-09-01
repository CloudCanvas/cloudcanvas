import React, { useEffect, useRef } from "react";
import AtBottomWatcher from "./AtBottomWatcher";

export type ViewProps = {
  dataCount: number;
  selected: boolean;
  children: React.ReactNode;
};

export const ScrollFollower = ({
  children,
  dataCount,
  selected,
}: ViewProps) => {
  const bottomRef = useRef<HTMLDivElement | null>();

  const [atBottom, setAtBottom] = React.useState(true);

  useEffect(() => {
    if (atBottom || !selected) {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [dataCount]);

  return (
    <div style={{ width: "100%" }}>
      {children}

      <AtBottomWatcher setAtBottom={setAtBottom} ref={bottomRef} />
    </div>
  );
};

export default ScrollFollower;
