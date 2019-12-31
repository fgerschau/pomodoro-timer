import { observable, action, computed } from 'mobx';

class TimerStore {
  private timerId: number = 0;
  @observable public running: boolean = false;
  @observable public pomodoroLength: number = 25 * 60 * 1000;
  @observable public timeLeft: number = this.pomodoroLength;

  @action setMsLeft(ms: number) {
    this.timeLeft = ms;
  }

  @computed get timeLeftFormatted() {
    const hours = Math.floor(this.timeLeft / 60 / 1000);
    const minutes = `0${((this.timeLeft % 60000) / 1000).toFixed(0)}`.slice(-2);
    return `${hours}:${minutes}`;
  }

  @action startTimer() {
    this.running = true;
    this.timerId = window.setInterval(() => {
      this.timeLeft = this.timeLeft - 100;
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
