import { useState, useRef, useEffect } from "react";
import { Playhead } from "./Playhead";
import { Ruler } from "./Ruler";
import { TrackList } from "./TrackList";
import { KeyframeList } from "./KeyframeList";
import { PlayControls } from "./PlayControls";

import useSyncScroll from "../hooks/useSyncScroll";

import TimeContext from "../context/TimeContext";

export const Timeline = () => {
  const [timeControls, setTime] = useState({
    time: 0,
    duration: 2000,
  });
  const trackListRef = useRef<HTMLDivElement>(null);
  const keyframeListRef = useRef<HTMLDivElement>(null);
  const rulerRef = useRef<HTMLDivElement>(null);

  const { registerScrollSync: registerVerticalScrollSync  } = useSyncScroll({ vertical: true });
  const { registerScrollSync: registerHorizontalScrollSync } = useSyncScroll({ horizontal: true });
  
  useEffect(() => {
    if (trackListRef.current && keyframeListRef.current) {
      registerVerticalScrollSync({
        nodes: [trackListRef.current, keyframeListRef.current],
      });
    }

    if (rulerRef.current && keyframeListRef.current) {
      registerHorizontalScrollSync({
        nodes: [rulerRef.current, keyframeListRef.current],
      });
    }
  }, []);

  return (
    <TimeContext.Provider value={timeControls}>
      <div
        className="relative h-[300px] w-full grid grid-cols-[300px_1fr] grid-rows-[40px_1fr]
      bg-gray-800 border-t-2 border-solid border-gray-700"
        data-testid="timeline"
      >
        <PlayControls timeControls={timeControls} setTime={setTime} />
        <Ruler
          setTime={setTime}
          ref={rulerRef}
        />
        <TrackList ref={trackListRef} />
        <KeyframeList ref={keyframeListRef}  />
        <Playhead rulerRef={rulerRef} />
      </div>
    </TimeContext.Provider>
  );
};
