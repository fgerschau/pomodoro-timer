import { observable, action, computed } from 'mobx';
import {emitAlert, getNumberFromLocalStorage} from '../utils';

type ITimerState = 'break' | 'long-break' | 'pomodoro';

export const pomodoroLengthKey = 'pomodoro-length';
export const breakLengthKey = 'break-length';
export const longBreakLengthKey = 'long-break-length';

class TimerStore {
  private timerId: number = 0;
  private timerStartDate: number = Date.now();

  @observable public pomodoroLength: number = getNumberFromLocalStorage(pomodoroLengthKey) ?? 25 * 60 * 1000;
  @observable public breakLength: number = getNumberFromLocalStorage(breakLengthKey) ?? 5 * 60 * 1000;
  @observable public longBreakLength: number = getNumberFromLocalStorage(longBreakLengthKey) ?? 10 * 60 * 1000;
  @observable public timerState: ITimerState = 'pomodoro';
  @observable public running: boolean = false;
  @observable public timeLeft: number = this.pomodoroLength;

  @action setMsLeft(ms: number) {
    this.timeLeft = ms;
  }

  @action setPomodoroLength(ms: number) {
    this.pomodoroLength = ms;
    localStorage.setItem(pomodoroLengthKey, `${ms}`);
  }

  @action setBreakLength(ms: number) {
    this.breakLength = ms;
    localStorage.setItem(breakLengthKey, `${ms}`);
  }

  @action setLongBreakLength(ms: number) {
    this.longBreakLength = ms;
    localStorage.setItem(longBreakLengthKey, `${ms}`);
  }

  @computed get timeLeftFormatted() {
    let minutes = Math.floor(this.timeLeft / 60 / 1000);
    let seconds = (this.timeLeft % 60000) / 1000;
    if (seconds.toFixed(0) === '60') {
      minutes++;
      seconds = 0;
    }

    const formattedSeconds = `0${seconds.toFixed(0)}`.slice(-2);
    return `${minutes}:${formattedSeconds}`;
  }

  @action startTimer() {
    if (this.timeLeft <=0 || this.running) return;
    this.running = true;
    this.timerStartDate = Date.now();

    this.timerId = window.setInterval(() => {
      const newTimeLeft = this.timeLeft - (Date.now() - this.timerStartDate);
      this.timerStartDate = Date.now();
      if (newTimeLeft <= 0) {
        this.resetTimer();
        emitAlert();
        return;
      }

      this.timeLeft = newTimeLeft;
    }, 1000);
  }

  @action pauseTimer() {
    this.running = false;
    clearInterval(this.timerId);
    this.timerStartDate = Date.now();
  }

  @action resetTimer(state?: ITimerState) {
    this.running = false;
    clearInterval(this.timerId);
    this.timerState = state ?? this.timerState;

    switch(this.timerState) {
      case 'pomodoro':
        this.timeLeft = this.pomodoroLength;
        break;
      case 'break':
        this.timeLeft = this.breakLength;
        break;
      case 'long-break':
        this.timeLeft = this.longBreakLength;
        break;
    }
  }
}

export default TimerStore;
