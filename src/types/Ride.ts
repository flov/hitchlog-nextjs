export type Ride = {
  id: number;
  title?: string;
  story?: string;
  experience?: EXPERIENCES;
  vehicle?: VEHICLE;
  waiting_time?: number;
  youtube?: string;
  gender?: GENDERS;
  number: number;
  tags: string[];
  photo?: Photo;
  photo_caption: string;
  likes: number;
  already_liked?: boolean;
};

export type Photo = {
  url: string;
  small: Small;
  thumb: Thumb;
};

export type Small = {
  url: string;
};

export type Thumb = {
  url: string;
};

export type EXPERIENCES = 'very good' | 'good' | 'neutral' | 'bad' | 'very bad';
export const Experiences = ['very good', 'good', 'neutral', 'bad', 'very bad'];

export type VEHICLE = 'car' | 'bus' | 'truck' | 'motorcycle' | 'plane' | 'boat';
export const Vehicles = ['car', 'bus', 'truck', 'motorcycle', 'plane', 'boat'];

export type GENDERS = 'male' | 'female' | 'mixed';
