import { observable, action, computed } from 'mobx';
import {emitAlert, getNumberFromLocalStorage} from '../utils';

type ITimerState = 'break' | 'pomodoro';

export const pomodoroLengthKey = 'pomodoro-length';
export const breakLengthKey = 'break-length';

class TimerStore {
  private timerId: number = 0;
  private timerStartDate: number = Date.now();

  @observable public pomodoroLength: number = getNumberFromLocalStorage(pomodoroLengthKey) ?? 25 * 60 * 1000;
  @observable public breakLength: number = getNumberFromLocalStorage(breakLengthKey) ?? 5 * 60 * 1000;
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
    localStorage.setItem('break-length', `${ms}`);
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
    this.timeLeft = this.timerState === 'pomodoro' ? this.pomodoroLength : this.breakLength;
  }
}

export default TimerStore;
