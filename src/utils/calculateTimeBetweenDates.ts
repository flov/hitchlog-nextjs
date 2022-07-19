export const calculateTimeBetweenDates = (departed: string | Date, arrived: string | Date) => {
  const diff = new Date(arrived).getTime() - new Date(departed).getTime();
  const diffSeconds = diff / 1000;
  const minutes = Math.floor((diffSeconds % 3600) / 60);
  const hours = Math.floor(diffSeconds / 3600);
  return `${hours}h ${minutes}m`;
};
