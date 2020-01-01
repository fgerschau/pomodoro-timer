export const timeout = (time: number) => new Promise(resolve => setTimeout(resolve, time));
// istanbul ignore next
const bell = Audio ? new Audio() : null;

// has to be called in an onClick function
// as a workaround for safari
export const initializeSound = () => {
  bell?.play();
};

const makeSound = () => {
  if (!Audio || !bell) return;
  bell.src = '/zen-bell.mp3';
  bell.play();
};

export const emitAlertNoise = async () => {
  navigator.vibrate = navigator.vibrate || (() => void(0));
  makeSound();
  navigator.vibrate(1000);
  await timeout(2050);
  navigator.vibrate(1000);
  await timeout(2050);
  navigator.vibrate(1000);
};
