export const secondsToTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secondsLeft = seconds % 60;
  return `${hours}h ${minutes}m ${secondsLeft}s`;
}

// secondsToTime(secs: number) {
//   const hours = Math.floor(secs / (60 * 60));
//   const divisor_for_minutes = secs % (60 * 60);
//   const minutes = Math.floor(divisor_for_minutes / 60);
//   const divisor_for_seconds = divisor_for_minutes % 60;
//   const seconds = Math.ceil(divisor_for_seconds);
//   const time = `${hours}h ${minutes}m ${seconds}s`;
//   return time;
// }