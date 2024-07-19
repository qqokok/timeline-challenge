import { forwardRef } from 'react';

type Ref = HTMLDivElement;

export const Ruler = forwardRef<Ref>((_, ref) => {
  // TODO: implement mousedown and mousemove to update time and Playhead position

  return (
    <div
      ref={ref}
      className="px-4 py-2 min-w-0 
      border-b border-solid border-gray-700 
      overflow-x-auto overflow-y-hidden"
      data-testid="ruler"
    >
      <div className="w-[2000px] h-6 rounded-md bg-white/25"></div>
    </div>
  );
});
