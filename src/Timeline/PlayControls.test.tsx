import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event'

import { PlayControls } from './PlayControls';

const mockPlayControlsProps = {
  timeControls: { time: 0, duration: 2000 },
  setTime: () => {},
}

describe('Test in PlayControls', () => {
  it('renders without crashing', () => {
    const { queryByTestId } = render(<PlayControls {...mockPlayControlsProps} />);
    expect(queryByTestId('play-controls')).toBeInTheDocument();
  });

  it('Changed on time will not exceed duration', async () => {
    const mockSetTime = jest.fn();
    const { getByTestId } = render(<PlayControls {...mockPlayControlsProps} setTime={mockSetTime} />);
    const timeInput = getByTestId('time');
    await userEvent.type(timeInput, '3000{enter}');
    expect(mockSetTime).toHaveBeenCalledWith({ time: 2000, duration: 2000 });
  });

  it('Changed on duration will reset time if it exceeds', async () => {
    const mockSetTime = jest.fn();
    const { getByTestId } = render(<PlayControls
      timeControls={{ time: 2000, duration: 2000 }}
      setTime={mockSetTime}
    />);
    const durationInput = getByTestId('max-time');
    await userEvent.type(durationInput, '1000{enter}');

    expect(mockSetTime).toHaveBeenCalledWith({ time: 1000, duration: 1000 });
  });
});