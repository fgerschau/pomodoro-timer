import { observable, action, computed } from 'mobx';
import {emitAlertNoise} from '../utils';

class TimerStore {
  private timerId: number = 0;
  @observable public running: boolean = false;
  @observable public pomodoroLength: number = 25 * 60 * 1000;
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
    this.timerId = window.setInterval(() => {
      const newTimeLeft = this.timeLeft - 100;
      if (newTimeLeft <= 0) {
        clearInterval(this.timerId);
        this.timeLeft = 0;
        emitAlertNoise();
        return;
      }

      this.timeLeft = newTimeLeft;
    }, 100);
  }

  @action pauseTimer() {
    this.running = false;
    clearInterval(this.timerId);
  }

  @action resetTimer() {
    this.running = false;
    clearInterval(this.timerId);
    this.timeLeft = this.pomodoroLength;
  }
}

export default TimerStore;
