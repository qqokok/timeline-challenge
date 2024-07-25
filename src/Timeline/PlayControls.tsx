import { useCallback } from "react";

import NumberInputField from '../components/NumberInputField';

/**
 * @typedef {Object} RulerProps
 * @property {{ time: number; duration: number }} timeControls - An object containing the current time and duration.
 * @property {({ time, duration }: { time: number; duration: number }) => void} setTime - A function to update the time and duration.
 */
type PlayControlsProps = {
  timeControls: { time: number; duration: number };
  setTime: ({ time, duration }: { time: number; duration: number }) => void;
};


const TIME_STEP_LENGTH = 10;
const DURATION_STEP_LENGTH = 10;

const TIME_MIN = 0;
const DURATION_MIN = 100;
const DURATION_MAX = 6000;

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
          min={TIME_MIN}
          max={duration}
          step={TIME_STEP_LENGTH}
          defaultValue={time}
          onChange={onTimeChange}
        />
      </fieldset>
      -
      <fieldset className="flex gap-1">
        <NumberInputField
          dataTestId="max-time"
          min={DURATION_MIN}
          max={DURATION_MAX}
          step={DURATION_STEP_LENGTH}
          defaultValue={duration}
          onChange={onDurationChange}
        />
        Duration
      </fieldset>
    </div>
  );
};
