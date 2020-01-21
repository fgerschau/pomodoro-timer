import TimerStore, {pomodoroLengthKey, breakLengthKey} from '../TimerStore';

jest.mock('../../utils', () => ({
  emitAlert: jest.fn(),
  getNumberFromLocalStorage: jest.fn(() => undefined),
}));

const { emitAlert, getNumberFromLocalStorage } = require('../../utils');

describe('TimerStore', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.resetAllMocks();

    jest.useFakeTimers();
    Date.now = jest.fn();
    emitAlert.mockImplementation(() => ({
      emitAlert: jest.fn(),
    }));
    getNumberFromLocalStorage.mockImplementation(((key: string): number | undefined => undefined));
  });

  it('has correct default values and setters work', () => {
    const timer = new TimerStore();
    // defaults
    expect(timer.timeLeft).toBe(25 * 60 * 1000);
    expect(timer.longBreakLength).toBe(10 * 60 * 1000);
    // setters
    timer.setMsLeft(0);
    expect(timer.timeLeft).toBe(0);
    timer.setLongBreakLength(15 * 60 * 1000);
    expect(timer.longBreakLength).toBe(15 * 60 * 1000);
  });

  it('formats the time left correctly', () => {
    const timer = new TimerStore();
    timer.setMsLeft(25 * 60 * 1000);
    expect(timer.timeLeftFormatted).toBe('25:00');
    timer.setMsLeft(1.1 * 60 * 1000);
    expect(timer.timeLeftFormatted).toBe('1:06');
  });

  it('starts, pauses, resumes and resets the timer', () => {
    const initialValue = 25 * 60 * 1000;
    const dateNowMock = jest.fn(() => initialValue);
    Date.now = dateNowMock;
    const timer = new TimerStore();
    expect(timer.timeLeft).toBe(initialValue);

    timer.startTimer();
    dateNowMock.mockImplementation(() => initialValue + (2 * 60 * 1000));
    jest.advanceTimersByTime(1000);

    expect(timer.running).toBe(true);
    expect(timer.timeLeftFormatted).toBe('23:00')
    expect(timer.timeLeft).toBe(initialValue - 2 * 60 * 1000);

    timer.pauseTimer();
    dateNowMock.mockImplementation(() => initialValue + (4 * 60 * 1000));
    jest.advanceTimersByTime(1000);
    expect(timer.running).toBe(false);
    expect(timer.timeLeft).toBe(initialValue - 2 * 60 * 1000);

    timer.startTimer();
    dateNowMock.mockImplementation(() => initialValue + (6 * 60 * 1000));
    jest.advanceTimersByTime(1000);
    expect(timer.running).toBe(true);
    expect(timer.timeLeft).toBe(initialValue - 4 * 60 * 1000);

    timer.resetTimer();
    dateNowMock.mockImplementation(() => initialValue + (8 * 60 * 1000));
    jest.advanceTimersByTime(1000);
    expect(timer.running).toBe(false);
    expect(timer.timeLeft).toBe(initialValue);
  });

  it('doesn\'t show 60s', () => {
    const dateNowMock = jest.fn(() => 25000);
    Date.now = dateNowMock;
    const timer = new TimerStore();
    timer.startTimer();
    dateNowMock.mockImplementation(() => 25100);
    jest.advanceTimersByTime(1000);
    expect(timer.timeLeftFormatted).toBe('25:00');
  });

  it('stops timer at initial time', () => {
    const dateNowMock = jest.fn(() => 0);
    Date.now = dateNowMock;
    const timer = new TimerStore();
    timer.startTimer();
    dateNowMock.mockImplementation(() => 25 * 60 * 1000);
    jest.advanceTimersByTime(1000);
    expect(timer.timeLeft).toBe(25 * 60 * 1000);
  });

  it('emits a buzzing sound when time ends', () => {
    const dateNowMock = jest.fn(() => 0);
    Date.now = dateNowMock;
    const vibrateMock = jest.fn();
    emitAlert.mockImplementation(vibrateMock);
    const timer = new TimerStore();
    timer.startTimer();
    dateNowMock.mockImplementation(() => 25 * 60 * 1000);
    jest.advanceTimersByTime(1000);
    expect(vibrateMock).toHaveBeenCalledTimes(1);
    jest.resetAllMocks();
  });

  it('sets the correct time (long break/break/pomodoro) when resetting timer', () => {
    const timer = new TimerStore();
    timer.resetTimer('break');
    expect(timer.timeLeft).toBe(5 * 60 * 1000);
    expect(timer.timerState).toBe('break');
    timer.resetTimer('pomodoro');
    expect(timer.timeLeft).toBe(25 * 60 * 1000);
    expect(timer.timerState).toBe('pomodoro');
    timer.resetTimer('long-break');
    expect(timer.timeLeft).toBe(10 * 60 * 1000);
    expect(timer.timerState).toBe('long-break');
  });

  it('sets pomodoro and timer length', () => {
    const timer = new TimerStore();
    timer.setPomodoroLength(0);
    expect(timer.pomodoroLength).toBe(0);
    timer.setBreakLength(0);
    expect(timer.breakLength).toBe(0);
  });

  it('does not start the timer if no time is left', () => {
    const dateNowMock = jest.fn(() => 0);
    Date.now = dateNowMock;
    const timer = new TimerStore();
    timer.startTimer();
    timer.startTimer();
    // should not start the timer twice
    expect(window.setInterval).toHaveBeenCalledTimes(1)

    dateNowMock.mockImplementation(() => 25 * 60 * 1000);
    jest.advanceTimersByTime(1000);
    expect(timer.running).toBe(false);

    timer.setMsLeft(0);
    timer.startTimer();
    expect(window.setInterval).toHaveBeenCalledTimes(1);
  });

  it('should read and set pomodoro and break length to local storage', () => {
    getNumberFromLocalStorage.mockImplementation((key: string): number | undefined => {
      if (key === breakLengthKey) return 0;
      if (key === pomodoroLengthKey) return 1;
      return;
    });
    let timer = new TimerStore();
    expect(timer.pomodoroLength).toBe(1);
    expect(timer.breakLength).toBe(0);

    getNumberFromLocalStorage.mockImplementation(() => undefined);
    timer = new TimerStore();
    expect(timer.pomodoroLength).toBe(25 * 60 * 1000);
    expect(timer.breakLength).toBe(5 * 60 * 1000);
  });
});
