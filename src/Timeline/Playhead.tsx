import { useEffect, useRef, useCallback, useState, useContext } from "react";

import TimeContext from "../context/TimeContext";

/**
 * @typedef {Object} PlayheadProps
 * @property {number} time - A number representing the current time.
 * @property {React.RefObject<HTMLDivElement>} rulerRef - A reference to the ruler element used for positioning the playhead.
 */
type PlayheadProps = {
  rulerRef: React.RefObject<HTMLDivElement>;
};

const RULER_PADDING_LEFT: number = 16;

export const Playhead = ({ rulerRef }: PlayheadProps) => {
  const [, forceUpdate] = useState(0);
  const playheadRef = useRef<HTMLDivElement>();
  const { time } = useContext(TimeContext);

  const handleRefPlayhead = useCallback((node: HTMLDivElement) => {
    if (node) {
      playheadRef.current = node;
    }
    forceUpdate((i) => i + 1);
  }, []);

  const resolvePlayheadPosition = (rulerNode: EventTarget | null) => {
    if (!rulerNode || !playheadRef.current) return;

    const { scrollLeft, clientWidth } = rulerNode as HTMLDivElement;

    let playheadPosition = time - scrollLeft;
    // count if playhead is out of bounds based on ruler's padding
    let isHidden = playheadPosition < -RULER_PADDING_LEFT || (playheadPosition + RULER_PADDING_LEFT) > clientWidth;
  
    if (isHidden) {
      playheadRef.current.classList.add('hidden');
    } else {
      playheadRef.current.classList.remove('hidden');
      playheadRef.current.style.transform = `translateX(calc(${playheadPosition}px - 50%))`;
    }
  };

  // resolve playhead position during ruler scroll
  const handleRulerScroll = (e: Event) => {
    window.requestAnimationFrame(() => resolvePlayheadPosition(e.target));
  };

  useEffect(() => {
    if (rulerRef.current && playheadRef.current) {
      rulerRef.current.addEventListener('scroll', handleRulerScroll);
    }

    return () => {
      if (rulerRef.current) {
        rulerRef.current.removeEventListener('scroll', handleRulerScroll);
      }
    };
  }, [rulerRef, playheadRef.current, time]);

  // resolve playhead position on time changed
  useEffect(() => {
    if (rulerRef.current) {
      resolvePlayheadPosition(rulerRef.current);
    }
  }, [time]);

  return (
    <div
      ref={handleRefPlayhead}
      className="absolute left-[316px] h-full border-l-2 border-solid border-yellow-600 z-10"
      data-testid="playhead"
      style={{ transform: `translateX(calc(${time}px - 50%))` }}
    >
      <div className="absolute border-solid border-[5px] border-transparent border-t-yellow-600 -translate-x-1.5" />
    </div>
  );
};
