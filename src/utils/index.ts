import { EXPERIENCES } from "../db/trips";

export const experienceToColor = (experience: EXPERIENCES) => {
  switch (experience) {
    case 'good':
      return 'success';
    case 'very good':
      return 'success';
    case 'neutral':
      return 'warning';
    case 'bad':
      return 'failure';
    case 'very bad':
      return 'failure';
    default:
      return 'success';
  }
}