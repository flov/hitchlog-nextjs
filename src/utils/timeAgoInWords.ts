import moment from "moment";

export const timeAgoInWords = (date: Date) => {
  moment().subtract(3, 'days').calendar();  // Last Tuesday at 10:10 AM
}
