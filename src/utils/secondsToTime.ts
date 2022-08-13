export const secondsToTime = (seconds: number | null) => {
  if (!seconds) return '';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secondsLeft = seconds % 60;
  return `${hours}h ${minutes}m ${secondsLeft}s`;
};

export const durationDiffToString = (durationDiff: number) => {
  if (durationDiff < 0) {
    return `${secondsToTime(-durationDiff)} slower than google maps`;
  } else {
    return `${secondsToTime(durationDiff)} faster than google maps`;
  }
};
