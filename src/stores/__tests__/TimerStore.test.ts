import TimerStore from '../TimerStore';

jest.useFakeTimers();

jest.mock('../../utils', () => ({
  emitAlertNoise: jest.fn(),
}));

const { emitAlertNoise } = require('../../utils');

jest.useFakeTimers();
describe('TimerStore', () => {
  beforeAll(() => {
    jest.clearAllTimers();
    Date.now = jest.fn();
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

  it('stops timer at 0', () => {
    const dateNowMock = jest.fn(() => 0);
    Date.now = dateNowMock;
    const timer = new TimerStore();
    timer.startTimer();
    dateNowMock.mockImplementation(() => 25 * 60 * 1000);
    jest.advanceTimersByTime(1000);
    expect(timer.timeLeft).toBe(0);
  });

  it('emits a buzzing sound when time ends', () => {
    const dateNowMock = jest.fn(() => 0);
    Date.now = dateNowMock;
    const vibrateMock = jest.fn();
    emitAlertNoise.mockImplementation(vibrateMock);
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
});
