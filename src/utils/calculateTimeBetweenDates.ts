export const calculateTimeBetweenDates = (start: string, end: string) => {
  const diff = new Date(end).getTime() - new Date(start).getTime();
  const diffSeconds = diff / 1000;
  const seconds = Math.floor(diffSeconds % 60);
  const minutes = Math.floor((diffSeconds % 3600) / 60);
  const hours = Math.floor(diffSeconds / 3600);
  return `${hours}h ${minutes}m`;
};
