import TimerStore from "../TimerStore";
import ConfigStore from "../ConfigStore";

const timerStoreMock = {
  startTimer: jest.fn(),
  pauseTimer: jest.fn(),
  resetTimer: jest.fn(),
  running: false,
  pomodoroLength: 25,
  timeLeft: 25,
  setMsLeft: jest.fn(),
  timeLeftFormatted: '0:00',
};

const configStore = {
  toggleLock: jest.fn(),
  locked: false,
};

export const useStores = ({
    timer: timerStoreMock,
});

export const useTimerStore = jest.fn((): Partial<TimerStore> => (timerStoreMock));

export const useConfigStore = jest.fn((): Partial<ConfigStore> => (configStore));
