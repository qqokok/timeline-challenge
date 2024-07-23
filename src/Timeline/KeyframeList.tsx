import React, { forwardRef } from 'react';

import { Segment } from "./Segment";

type RulerProps = {
  duration: number;
};

type Ref = HTMLDivElement;

const DEMO_SEGMENT_LIST = Array.from({ length: 10 });

export const KeyframeList = React.memo(forwardRef<Ref, RulerProps>(({ duration }, ref) => {
  // TODO: implement scroll sync with `Ruler` and `TrackList`

  return (
    <div
      ref={ref}
      className="px-4 min-w-0 overflow-auto"
      data-test-id="keyframe-list"
    >
      {DEMO_SEGMENT_LIST.map((_, index) => (
        <Segment key={index} duration={duration} />
      ))}
    </div>
  );
}));
