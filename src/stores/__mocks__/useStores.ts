import TimerStore from "../TimerStore";

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

export const useStores = ({
    timer: timerStoreMock,
});

export const useTimerStore = jest.fn((): Partial<TimerStore> => (timerStoreMock));
