import { useState, useRef, useEffect } from "react";
import { Playhead } from "./Playhead";
import { Ruler } from "./Ruler";
import { TrackList } from "./TrackList";
import { KeyframeList } from "./KeyframeList";
import { PlayControls } from "./PlayControls";

import useSyncScroll from "../hooks/useSyncScroll";

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
    <div
      className="relative h-[300px] w-full grid grid-cols-[300px_1fr] grid-rows-[40px_1fr] 
    bg-gray-800 border-t-2 border-solid border-gray-700"
      data-testid="timeline"
    >
      <PlayControls timeControls={timeControls} setTime={setTime} />
      <Ruler duration={timeControls.duration} ref={rulerRef} />
      <TrackList ref={trackListRef} />
      <KeyframeList duration={timeControls.duration} ref={keyframeListRef}  />
      <Playhead time={timeControls.time} rulerRef={rulerRef} />
    </div>
  );
};
