import { forwardRef } from 'react';

import { Segment } from "./Segment";

type Ref = HTMLDivElement;

export const KeyframeList = forwardRef<Ref>((_, ref) => {
  // TODO: implement scroll sync with `Ruler` and `TrackList`

  return (
    <div className="px-4 min-w-0 overflow-auto" data-testid="keyframe-list">
      <Segment />
      <Segment />
      <Segment />
      <Segment />
      <Segment />
      <Segment />
      <Segment />
      <Segment />
      <Segment />
      <Segment />
    </div>
  );
});
