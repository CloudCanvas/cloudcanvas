import React, { useEffect, useRef } from "react";
import AtBottomWatcher from "./AtBottomWatcher";

export type ViewProps = {
  dataCount: number;
  selected: boolean;
  children: React.ReactNode;
};

/**
 * Follows the scroll of the container if certain conditins are met
 * @returns
 */
export const ScrollFollower = ({
  children,
  dataCount,
  selected,
}: ViewProps) => {
  const bottomRef = useRef<HTMLDivElement | null>();

  const [atBottom, setAtBottom] = React.useState(true);

  /**
   * Here we can't use scrollIntoView as it messes with the parent view scroll which is horrle.
   * So we have to use
   */
  useEffect(() => {
    if (atBottom || !selected) {
      const location = bottomRef.current?.getBoundingClientRect();
      // bottomRef.current?.scrollIntoView({
      //   behavior: "smooth",
      //   block: "nearest",
      //   inline: "nearest",
      // });
      console.log(`Scroll to ${location?.y}`);
      // TODO Need to send this request to the owner of scroll really
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
