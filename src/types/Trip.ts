import { Ride } from './Ride';
import { Comment } from './Comment';

export type Location = {
  lat: number;
  lng: number;
  city?: string;
  country?: string;
  country_code?: string;
  place_id: string | null;
  sanitized_address: string;
};

export type Timestamp = { seconds: number; nanoseconds: number };

export type Trip = {
  id: number | string;
  to_param: string;
  arrival: Date;
  departure: Date;
  created_at: Date;
  google_duration?: number;
  distance?: number;
  travelling_with: number;
  age_at_trip: number;
  average_speed: string;
  country_distances: Country[];
  origin: Location;
  destination: Location;
  rides: Ride[];
  total_distance: number;
  user: { username: string; md5_email: string; gender: string };
  comments: Comment[];
};

export type TripUser = {
  username: string;
  md5_email: string;
  gender: string;
};

export type Country = {
  country_code: string;
  country: string;
  distance: number;
};
