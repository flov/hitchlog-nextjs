export const timeAgoInWords = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  const interval = Math.floor(seconds / 31536000);
  if (interval > 1) {
    return interval + ' years';
  }
  const interval2 = Math.floor(seconds / 2592000);
  if (interval2 > 1) {
    return interval2 + ' months';
  }
  const interval3 = Math.floor(seconds / 86400);
  if (interval3 > 1) {
    return interval3 + ' days';
  }
  const interval4 = Math.floor(seconds / 3600);
  if (interval4 > 1) {
    return interval4 + ' hours';
  }
  const interval5 = Math.floor(seconds / 60);
  if (interval5 > 1) {
    return interval5 + ' minutes';
  }
  return Math.floor(seconds) + ' seconds';
}
