import React, { useCallback, useRef, useState, useEffect } from "react";

type NumberInputFieldProps = {
  defaultValue: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  dataTestId: string;
}

const KEY_UP = 'ArrowUp';
const KEY_DOWN = 'ArrowDown';
const KEY_ENTER = 'Enter';
const KEY_ESC = 'Escape';

/**
 * Renders an input field for entering a number within a specified range.
 *
 * @param {Object} props - The component props.
 * @param {number} props.defaultValue - The default value of the input field.
 * @param {function} props.onChange - The callback function to be called when the value changes.
 * @param {number} props.min - The minimum allowed value for the input field.
 * @param {number} props.max - The maximum allowed value for the input field.
 * @param {number} props.step - The increment step for the input field.
 * @param {string} props.dataTestId - The data-testid attribute for the input field.
 * @return {JSX.Element} The rendered input field component.
 */
const NumberInputField = ({
  defaultValue,
  onChange,
  min,
  max,
  step,
  dataTestId,
}: NumberInputFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const isTyping = useRef(false);
  const [value, setValue] = useState(defaultValue);

  const validateValueAndOnChange = useCallback(() => {
    // round to nearest step
    const roundedValue = Math.round(value / step) * step;
    let onChangeValue = roundedValue;
    if (roundedValue < min) {
      onChangeValue = min
    } else if (roundedValue > max) {
      onChangeValue = max
    }

    if (onChangeValue !== value) {
      setValue(onChangeValue);
    }
    if (onChangeValue !== defaultValue) {
      onChange(onChangeValue);
    }
  }, [defaultValue, value, min, max, onChange]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const onChangeValue = Number(e.target.value);
      setValue(onChangeValue);
      // Keep on change event disabled while typing
      if (isTyping.current) return;

      onChange(onChangeValue);
    },
    [onChange],
  );

  const handleInputFocus = useCallback(() => {
    inputRef.current?.select();
  }, []);

  const handleInputBlur = useCallback(() => {
    isTyping.current = false;

    validateValueAndOnChange();
  }, [validateValueAndOnChange]);

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if ([KEY_ENTER, KEY_ESC].findIndex((key) => key === e.key) !== -1) {
        isTyping.current = false;
      } else {
        isTyping.current = true;
      }

      if (e.key === KEY_UP) {
        onChange(defaultValue + step > max ? max : defaultValue + step);
        // delay the selection after value changed
        setTimeout(() => inputRef.current?.select(), 0);
      }
      if (e.key === KEY_DOWN) {
        onChange(defaultValue - step > 0 ? defaultValue - step : 0);
        setTimeout(() => inputRef.current?.select(), 0);
      }

      if (e.key === KEY_ENTER) {
        // will trigger blur event and do onChange
        inputRef.current?.blur();
      }

      if (e.key === KEY_ESC) {
        setValue(defaultValue);
        // delay the blur action after value changed
        setTimeout(() => inputRef.current?.blur(), 0);
      }
    },
    [value, defaultValue, step, max, onChange],
  );

  const handleInputClick = useCallback(() => {
    isTyping.current = false;
    if (inputRef.current) {
      inputRef.current.select();
    }
  }, []);

  useEffect(() => {
    if (defaultValue !== value) {
      setValue(defaultValue);
    }
  }, [defaultValue]);

  return (
    <input
      ref={inputRef}
      type="number"
      data-testid={dataTestId}
      className="bg-gray-700 px-1 rounded"
      min={min}
      max={max}
      step={step}
      // trim leading zeros on display
      value={value.toString()}
      onChange={handleInputChange}
      onClick={handleInputClick}
      onKeyDown={handleInputKeyDown}
      onFocus={handleInputFocus}
      onBlur={handleInputBlur}
    />
  )
}

export default NumberInputField;
