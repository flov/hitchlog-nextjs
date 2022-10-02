export type Ride = {
  id: number;
  title?: string;
  story?: string;
  experience?: EXPERIENCES;
  vehicle?: VEHICLES;
  waiting_time?: number;
  youtube?: string;
  gender?: GENDERS;
  number: number;
};

export type EXPERIENCES = 'very good' | 'good' | 'neutral' | 'bad' | 'very bad';
export const Experiences = ['very good', 'good', 'neutral', 'bad', 'very bad'];

export type VEHICLES =
  | 'car'
  | 'bus'
  | 'truck'
  | 'motorcycle'
  | 'plane'
  | 'boat';
export const Vehicles = ['car', 'bus', 'truck', 'motorcycle', 'plane', 'boat'];

export type GENDERS = 'male' | 'female' | 'mixed';
