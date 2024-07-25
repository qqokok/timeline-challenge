import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event'

import { Timeline } from './Timeline';

const RUlER_PADDING_LEFT: number = 16;

describe('Test in Timeline', () => {
  let spy: jest.SpyInstance;
  beforeEach(() => {
    spy = jest.spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback: FrameRequestCallback): number => { callback(0); return 0; });
  });

  it('renders without crashing', () => {
    const { queryByTestId } = render(<Timeline />);
    expect(queryByTestId('timeline')).toBeInTheDocument();
  });

  it('Horizontal scroll sync works on KeyframeList and Ruler', async () => {
    const { getByTestId } = render(<Timeline />);
    const ruler = getByTestId('ruler');
    const keyframeList = getByTestId('keyframe-list');
    expect(keyframeList).toBeInTheDocument();
    expect(ruler).toBeInTheDocument();

    await fireEvent.scroll(ruler, { target: { scrollLeft: 100 } });

    expect(keyframeList.scrollLeft).toBe(100);
  });

  it('Vertical scroll sync works on TrackList and KeyframeList', async () => {
    const { getByTestId } = render(<Timeline />);
    const trackList = getByTestId('track-list');
    const keyframeList = getByTestId('keyframe-list');
    expect(trackList).toBeInTheDocument();
    expect(keyframeList).toBeInTheDocument();

    await fireEvent.scroll(trackList, { target: { scrollTop: 100 } });

    expect(keyframeList.scrollTop).toBe(100);
  });

  it('Change on time will reset playhead position', async () => {
    const { getByTestId } = render(<Timeline />);
    const playhead = getByTestId('playhead');
    const timeInput = getByTestId('time');
    await userEvent.type(timeInput, '200{enter}');
    
    expect(playhead.style.transform).toBe('translateX(calc(200px - 50%))');
  });


  it('Change on duration will reset ruler scroll length', async () => {
    const { getByTestId } = render(<Timeline />);
    const rulerSegment = getByTestId('ruler-segment'); 
    const durationInput = getByTestId('max-time');
    await userEvent.type(durationInput, '500{enter}');

    expect(rulerSegment.style.width).toBe('500px');
  })

  it('Mouse down on ruler will reset playhead position', async () => {
    const { getByTestId } = render(<Timeline />);
    const playhead = getByTestId('playhead');
    const ruler = getByTestId('ruler');
    fireEvent.mouseDown(ruler, { clientX: 100 + RUlER_PADDING_LEFT });

    expect(playhead.style.transform).toBe('translateX(calc(100px - 50%))');
  })

  it('Mouse down and mouse move on ruler will change playhead position', async () => {
    const { getByTestId } = render(<Timeline />);
    const playhead = getByTestId('playhead');
    const ruler = getByTestId('ruler');
    const rulerSegment = getByTestId('ruler-segment');
    fireEvent.mouseDown(ruler, { clientX: 100 + RUlER_PADDING_LEFT, clientY: 0 });
    fireEvent.mouseMove(rulerSegment, { clientX: 200, clientY: 0 });
    fireEvent.mouseUp(ruler);
    expect(playhead.style.transform).toBe('translateX(calc(200px - 50%))');
  })


  afterEach(() => {
    spy.mockRestore();
  });
})