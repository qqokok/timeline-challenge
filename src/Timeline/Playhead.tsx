import { useEffect, useRef, useCallback, useState } from "react";

type PlayheadProps = {
  time: number;
  rulerRef: React.RefObject<HTMLDivElement>;
};

const RULER_PADDING_LEFT: number = 16;

export const Playhead = ({ time, rulerRef }: PlayheadProps) => {
  const [, forceUpdate] = useState(0);
  const playheadRef = useRef<HTMLDivElement>();

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
    let isHidden = playheadPosition < -RULER_PADDING_LEFT || (playheadPosition + RULER_PADDING_LEFT) > clientWidth;
  
    if (isHidden) {
      playheadRef.current.classList.add('hidden');
    } else {
      playheadRef.current.classList.remove('hidden');
      playheadRef.current.style.transform = `translateX(calc(${playheadPosition}px - 50%))`;
    }
  };

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
  }, [rulerRef, playheadRef.current]);

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
