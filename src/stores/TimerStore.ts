import { observable, action, computed } from 'mobx';
import {emitAlertNoise} from '../utils';

type ITimerState = 'break' | 'pomodoro';

class TimerStore {
  private timerId: number = 0;
  private timerStartDate: number = Date.now();

  @observable public timerState: ITimerState = 'pomodoro';
  @observable public pomodoroLength: number = 25 * 60 * 1000;
  @observable public breakLength: number = 5 * 60 * 1000;

  @observable public running: boolean = false;

  @observable public timeLeft: number = this.pomodoroLength;

  @action setMsLeft(ms: number) {
    this.timeLeft = ms;
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
    this.running = true;
    this.timerStartDate = Date.now();

    this.timerId = window.setInterval(() => {
      const newTimeLeft = this.timeLeft - (Date.now() - this.timerStartDate);
      this.timerStartDate = Date.now();
      if (newTimeLeft <= 0) {
        clearInterval(this.timerId);
        this.timeLeft = 0;
        emitAlertNoise();
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
