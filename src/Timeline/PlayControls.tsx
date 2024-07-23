import { useCallback } from "react";

import NumberInputField from '../components/NumberInputField';

type PlayControlsProps = {
  timeControls: { time: number; duration: number };
  setTime: ({ time, duration }: { time: number; duration: number }) => void;
};


const TIME_STEP_LENGTH = 10;
const DURATION_STEP_LENGTH = 10;



export const PlayControls = ({ timeControls: { time, duration }, setTime }: PlayControlsProps) => {

  const onDurationChange = useCallback(
    (newDuration: number) => {
      setTime({
        time: time > newDuration ? newDuration : time,
        duration: newDuration,
      });
    },
    [setTime, time],
  );

  const onTimeChange = useCallback(
    (newTime: number) => {
      setTime({
        time: newTime > duration ? duration : newTime,
        duration,
      });
    },
    [setTime, duration],
  );

  return (
    <div
      className="flex items-center justify-between border-b border-r border-solid border-gray-700 
 px-2"
      data-testid="play-controls"
    >
      <fieldset className="flex gap-1">
        Current
        <NumberInputField
          dataTestId="time"
          min={0}
          max={2000}
          step={TIME_STEP_LENGTH}
          defaultValue={time}
          onChange={onTimeChange}
        />
      </fieldset>
      -
      <fieldset className="flex gap-1">
        <NumberInputField
          dataTestId="max-time"
          min={100}
          max={6000}
          step={DURATION_STEP_LENGTH}
          defaultValue={duration}
          onChange={onDurationChange}
        />
        Duration
      </fieldset>
    </div>
  );
};
