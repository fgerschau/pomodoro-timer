[time-to-first-render-timer]
const timerEntry = performance.getEntriesByName('timer-screen')[0];
if (timerEntry) {
  return timerEntry.startTime;
}
