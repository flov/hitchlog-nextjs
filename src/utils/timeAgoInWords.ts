import moment from 'moment';
import { Timestamp } from '../types';

//unix timestamp to date
export const unixToDate = (unix: number) => {
  return moment.unix(unix).toDate();
};

export const timeAgoInWords = (timestamp: Timestamp) => {
  const date = moment.unix(timestamp.seconds);
  return moment(date).fromNow();
};
