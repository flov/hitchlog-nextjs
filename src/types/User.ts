import { EXPERIENCES, VEHICLES } from './Ride';

export type User = {
  id: number;
  email: string;
  md5_email: string;
  username: string;
  gender: 'male' | 'female' | 'non-binary';
  about_you?: string;
  languages?: string[];
  hitchhiked_kms: number;
  number_of_trips: number;
  number_of_rides: number;
  created_at: string;
  age: number;
  cs_user?: string;
  be_welcome_user?: string;
  trustroots?: string;
  location?: UserLocation;
};

export type UserLocation = {
  formatted_address?: string;
  country_code?: string;
  lng?: number;
  lat?: number;
  country?: string;
  city?: string;
};

export type Geomap = {
  distances: Record<string, number>;
  trip_count: Record<string, number>;
};

export type ExperienceKey =
  | 'very_good'
  | 'good'
  | 'neutral'
  | 'bad'
  | 'very_bad';

export type ExperiencesRecord = Record<ExperienceKey, number>;

export type Profile = {
  id: number;
  age: number;
  md5_email: string;
  username: string;
  gender: 'male' | 'female' | 'non-binary';
  about_you: string;
  languages: string;
  hitchhiked_countries: Record<string, number>;
  hitchhiked_kms: number;
  number_of_rides: number;
  number_of_trips: number;
  number_of_stories: number;
  number_of_comments: number;
  created_at: string;
  cs_user: string;
  trustroots: string;
  be_welcome_user: string;
  average_speed: string;
  average_waiting_time: number;
  location: UserLocation;
  travelling_with: TravellingWith;
  experiences: ExperiencesRecord;
  vehicles: VEHICLES;
  age_of_trips: number[][];
};

export type TravellingWith = {
  alone: number;
  in_pairs: number;
  with_three: number;
  with_four: number;
};
