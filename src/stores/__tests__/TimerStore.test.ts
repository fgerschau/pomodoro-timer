import TimerStore from '../TimerStore';

jest.mock('../../utils', () => ({
  emitAlert: jest.fn(),
}));

const { emitAlert } = require('../../utils');

describe('TimerStore', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.resetAllMocks();

    jest.useFakeTimers();
    Date.now = jest.fn();
    emitAlert.mockImplementation(() => ({
      emitAlert: jest.fn(),
    }));
  });

  it('has correct default values and setters work', () => {
    const timer = new TimerStore();
    expect(timer.timeLeft).toBe(25 * 60 * 1000);
    timer.setMsLeft(0);
    expect(timer.timeLeft).toBe(0);
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

  it('sets the correct time (pause/pomodoro) when resetting timer', () => {
    const timer = new TimerStore();
    timer.resetTimer('break');
    expect(timer.timeLeft).toBe(5 * 60 * 1000);
    expect(timer.timerState).toBe('break');
    timer.resetTimer('pomodoro');
    expect(timer.timeLeft).toBe(25 * 60 * 1000);
    expect(timer.timerState).toBe('pomodoro');
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
});
