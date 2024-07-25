import { render } from '@testing-library/react';
import NumberInputField from './NumberInputField';
import userEvent from '@testing-library/user-event'

const mockInputProps = {
  defaultValue: 0,
  onChange: () => {},
  min: 0,
  max: 2000,
  step: 10,
  dataTestId: 'number-input',
}

describe('Test in NumberInputField', () => {
  it('renders without crashing', () => {
    const { queryByTestId } = render(<NumberInputField {...mockInputProps} />);
    expect(queryByTestId(mockInputProps.dataTestId)).toBeInTheDocument()
  });

  it('typing enter will call onChange with correct value', async () => {
    const mockOnChange = jest.fn();
    const { getByTestId } = render(<NumberInputField {...mockInputProps} onChange={mockOnChange} />);
    const input = getByTestId(mockInputProps.dataTestId);
    await userEvent.type(input, '300{enter}');

    expect(mockOnChange).toHaveBeenCalledWith(300);
    expect(input).not.toHaveFocus();
  })

  it('Will call onChange when input is blurred', async () => {
    const mockOnChange = jest.fn();
    const { getByTestId } = render(<NumberInputField {...mockInputProps} onChange={mockOnChange} />);
    const input = getByTestId(mockInputProps.dataTestId);
    await userEvent.type(input, '300');
    input.blur();
    expect(mockOnChange).toHaveBeenCalledWith(300);
  })

  it('Typing in input will not call onChange', async () => {
    const mockOnChange = jest.fn();
    const { getByTestId } = render(<NumberInputField {...mockInputProps} onChange={mockOnChange} />);
    const input = getByTestId(mockInputProps.dataTestId);
    await userEvent.type(input, '300');
    expect(mockOnChange).not.toHaveBeenCalled();
  })

  it('Typing arrow up and arrow down will onChange a step different from default', async () => {
    const mockOnChange = jest.fn();
    const { getByTestId } = render(<NumberInputField {...mockInputProps} onChange={mockOnChange} />);
    const input = getByTestId(mockInputProps.dataTestId);
    await userEvent.type(input, '{arrowup}');
    expect(mockOnChange).toHaveBeenCalledWith(mockInputProps.defaultValue + mockInputProps.step);

    // arrow down will minus a step
    await userEvent.type(input, '{arrowdown}');
    expect(mockOnChange).toHaveBeenCalledWith(mockInputProps.defaultValue);
  })

  it('Typing escape will revert to the original value and lose focus', async () => {
    const mockOnChange = jest.fn();
    const { getByTestId } = render(<NumberInputField {...mockInputProps} onChange={mockOnChange} />);
    const input = getByTestId(mockInputProps.dataTestId);
    await userEvent.type(input, '300{escape}');


    expect(mockOnChange).not.toHaveBeenCalled();
    expect(input).toHaveValue(mockInputProps.defaultValue);
    expect(input).not.toHaveFocus();
  })

  it('Typing duration over max will revert to the max value', async () => {
    const mockOnChange = jest.fn();
    const { getByTestId } = render(<NumberInputField {...mockInputProps} onChange={mockOnChange} />);
    const input = getByTestId(mockInputProps.dataTestId);
    await userEvent.type(input, '3000{enter}');
    expect(mockOnChange).toHaveBeenCalledWith(mockInputProps.max);
  });

  it('Typing duration under min will revert to the min value', async () => {
    const mockOnChange = jest.fn();
    const minimum = 100
    const { getByTestId } = render(<NumberInputField
      {...mockInputProps}
      onChange={mockOnChange}
      min={minimum}
    />);
    const input = getByTestId(mockInputProps.dataTestId);
    await userEvent.type(input, '10{enter}');
    expect(mockOnChange).toHaveBeenCalledWith(minimum);
  });

  it('Decimal values are automatically rounded to the nearest integer', async () => {
    const mockOnChange = jest.fn();
    const { getByTestId } = render(<NumberInputField {...mockInputProps} onChange={mockOnChange} />);
    const input = getByTestId(mockInputProps.dataTestId);
    await userEvent.type(input, '105.5{enter}');
    expect(mockOnChange).toHaveBeenCalledWith(110);
  })

  it('Negative values are automatically adjusted to the minimum allowed value', async () => {
    const mockOnChange = jest.fn();
    const { getByTestId } = render(<NumberInputField {...mockInputProps} onChange={mockOnChange} />);
    const input = getByTestId(mockInputProps.dataTestId);
    await userEvent.type(input, '-1{enter}');
    expect(input).toHaveValue(mockInputProps.min);
  })

  it('Invalid inputs (non-numeric) revert to the previous valid value', async () => {
    const mockOnChange = jest.fn();
    const { getByTestId } = render(<NumberInputField {...mockInputProps} onChange={mockOnChange} />);
    const input = getByTestId(mockInputProps.dataTestId);
    await userEvent.type(input, 'abc{enter}');
    expect(input).toHaveValue(mockInputProps.defaultValue);
  })
});