import React, { forwardRef, useCallback, useRef, useContext } from 'react';

import TimeContext from '../context/TimeContext';

/**
 * @typedef {Object} RulerProps
 * @property {({ time, duration }: { time: number; duration: number }) => void} setTime - A function to update the time and duration.
 */
type RulerProps = {
  setTime: ({ time, duration }: { time: number; duration: number }) => void;
};

type Ref = HTMLDivElement | null;

const RULER_PADDING_LEFT: number = 16;

export const Ruler = React.memo(forwardRef<Ref, RulerProps>(({ setTime }, ref) => {
  // use ref to bind mouse move events
  const rulerRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef(false);
  const { time, duration } = useContext(TimeContext);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const currentTarget = e.currentTarget as HTMLDivElement;
    const rulerScrollLeft = rulerRef.current?.scrollLeft ?? 0;
    let diff = e.clientX - currentTarget.offsetLeft + rulerScrollLeft - RULER_PADDING_LEFT;

    if (diff > duration) {
      diff = duration;
    }

    if (diff < 0) {
      diff = 0;
    }

    const newPlayheadPosition = Math.round(diff / 10) * 10;
    if (newPlayheadPosition !== time) {
      setTime({ time: newPlayheadPosition, duration });
    }
  }, [time, duration, setTime]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const diff = e.clientX - e.currentTarget.offsetLeft - RULER_PADDING_LEFT + e.currentTarget.scrollLeft ;
    const newPlayheadPosition = Math.round(diff / 10) * 10;

    setTime({
      time: newPlayheadPosition > duration ? duration : newPlayheadPosition,
      duration
    });
    if (rulerRef.current) {
      isDragging.current = true;
      // bind mouse move on segment to avoid dragging out of the segment
      rulerRef.current.onmousemove = handleMouseMove;
      // listen for mouse up globally
      window.addEventListener('mouseup', handleMouseUp);
    }
  }, [duration, setTime]);

  const handleMouseUp = useCallback(() => {
    if (rulerRef.current) {
      rulerRef.current.onmousemove = null;
      isDragging.current = false;
    }
    window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const checkIfMouseHovering = (
    { clientX, clientY }: { clientX: number; clientY: number },
    rect: DOMRect
  ) => {
    if (clientX < rect.left || clientX > rect.right) {
      return false;
    }
    if (clientY < rect.top || clientY > rect.bottom) {
      return false;
    }

    return true;
  }

  // Except user mouse leave, will also be triggered when the component re-rendered
  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;

    // check if mouse is still hovering on the ruler
    const isHovered = checkIfMouseHovering(
      { clientX: e.clientX, clientY: e.clientY },
      e.currentTarget.getBoundingClientRect(),
    );

    if (!isHovered && rulerRef.current) {
      rulerRef.current.onmousemove = null;
      isDragging.current = false;
    }
  }, []);

  return (
    <div
      ref={(node) => {
        if (node) {
          rulerRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }
      }}
      className="px-4 py-2 min-w-0 
      border-b border-solid border-gray-700 
      overflow-x-auto overflow-y-hidden"
      data-testid="ruler"
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
    >
      <div
        data-testid="ruler-segment"
        className="w-[2000px] h-6 rounded-md bg-white/25"
        style={{ width: `${duration}px` }}
      />
    </div>
  );
}));
