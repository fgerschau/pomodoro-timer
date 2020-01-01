import TimerStore from '../TimerStore';

jest.useFakeTimers();

jest.mock('../../utils', () => ({
  emitAlertNoise: jest.fn(),
}));

const { emitAlertNoise } = require('../../utils');


describe('TimerStore', () => {
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
    const timer = new TimerStore();
    expect(timer.timeLeft).toBe(initialValue);

    timer.startTimer();
    jest.advanceTimersByTime(2 * 60 * 1000);
    expect(timer.running).toBe(true);
    expect(timer.timeLeftFormatted).toBe('23:00')
    expect(timer.timeLeft).toBe(initialValue - 2 * 60 * 1000);

    timer.pauseTimer();
    jest.advanceTimersByTime(2 * 60);
    expect(timer.running).toBe(false);
    expect(timer.timeLeft).toBe(initialValue - 2 * 60 * 1000);

    timer.startTimer();
    jest.advanceTimersByTime(2 * 60 * 1000);
    expect(timer.running).toBe(true);
    expect(timer.timeLeft).toBe(initialValue - 4 * 60 * 1000);

    timer.resetTimer();
    jest.advanceTimersByTime(2 * 60 * 1000);
    expect(timer.running).toBe(false);
    expect(timer.timeLeft).toBe(initialValue);
  });

  it('doesn\'t show 60s', () => {
    const timer = new TimerStore();
    timer.startTimer();
    jest.advanceTimersByTime(100);
    expect(timer.timeLeftFormatted).toBe('25:00');
  });

  it('stops timer at 0', () => {
    const timer = new TimerStore();
    timer.startTimer();
    jest.advanceTimersByTime(50 * 60 * 1000);
    expect(timer.timeLeft).toBe(0);
  });

  it('emits a buzzing sound when time ends', () => {
    const vibrateMock = jest.fn();
    emitAlertNoise.mockImplementation(vibrateMock);
    const timer = new TimerStore();
    timer.startTimer();
    jest.advanceTimersByTime(25 * 60 * 1000);
    expect(vibrateMock).toHaveBeenCalledTimes(1);
    jest.resetAllMocks();
  });
});
