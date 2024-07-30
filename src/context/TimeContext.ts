import { createContext } from 'react';

const TimeContext = createContext({
  time: 0,
  duration: 2000,
});

export default TimeContext