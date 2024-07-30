import { useContext } from "react";

import TimeContext from "../context/TimeContext";

export const Segment = () => {
  const { duration } = useContext(TimeContext);

  return (
    <div
      className="w-[2000px] py-2"
      data-testid="segment"
      style={{ width: `${duration}px` }}
    >
      <div className="h-6 rounded-md bg-white/10"></div>
    </div>
  );
};
