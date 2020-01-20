export const timeout = (time: number) => new Promise(resolve => setTimeout(resolve, time));
// istanbul ignore next
const bell = Audio ? new Audio() : null;

// has to be called in an onClick function
// as a workaround for safari
export const initializeNotifications = () => {
  // istanbul ignore next
  if (bell) {
    bell.play();
    bell.src = '/zen-bell.mp3';
  }

  if (window.Notification?.permission === 'default') {
    window.Notification?.requestPermission();
  }
};

const makeSound = () => {
  if (!Audio || !bell) return;
  bell.play();
};

export const emitAlert = async () => {
  navigator.vibrate = navigator.vibrate || (() => void(0));
  makeSound();
  if (window.Notification?.permission === 'granted') {
    new window.Notification('Time is over!');
  }

  navigator.vibrate(1000);
  await timeout(2050);
  navigator.vibrate(1000);
  await timeout(2050);
  navigator.vibrate(1000);
};

export const getNumberFromLocalStorage = (key: string): number | undefined => {
  const item = localStorage.getItem(key) as string;
  const value = parseInt(item, 10);
  if (isNaN(value)) return;
  return value;
};
