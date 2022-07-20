export type Ride = {
  id?: string;
  title?: string;
  story?: string;
  experience?: EXPERIENCES;
  tagList?: string[];
  vehicle?: VEHICLES;
  waitingTime?: number;
  youtube?: string;
  gender?: GENDERS;
};

export type EXPERIENCES = 'very good' | 'good' | 'neutral' | 'bad' | 'very bad';

export type VEHICLES =
  | 'car'
  | 'bus'
  | 'truck'
  | 'motorcycle'
  | 'plane'
  | 'boat';

export type GENDERS = 'male' | 'female' | 'mixed';