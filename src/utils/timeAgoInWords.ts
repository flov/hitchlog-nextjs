import moment from 'moment';
import { Timestamp } from '../types';

//unix timestamp to date
export const unixToDate = (unix: number) => {
  return moment.unix(unix).toDate();
};

export const timeAgoInWords = (date: Date) => moment(date).fromNow();
