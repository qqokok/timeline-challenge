import React, { forwardRef } from 'react';

import { Segment } from "./Segment";

type Ref = HTMLDivElement;

const DEMO_SEGMENT_LIST = Array.from({ length: 10 });

export const KeyframeList = React.memo(forwardRef<Ref>((_, ref) => {

  return (
    <div
      ref={ref}
      className="px-4 min-w-0 overflow-auto"
      data-testid="keyframe-list"
    >
      {DEMO_SEGMENT_LIST.map((_, index) => (
        <Segment key={index} />
      ))}
    </div>
  );
}));
