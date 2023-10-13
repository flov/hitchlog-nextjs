import { Comment } from './Comment';
import { Ride } from './Ride';

export type Location = {
  lat: number;
  lng: number;
  city?: string;
  country?: string;
  country_code?: string;
  place_id?: string | null;
  sanitized_address?: string;
};

export type Timestamp = { seconds: number; nanoseconds: number };

export type Trip = {
  age_at_trip: number;
  arrival: Date;
  average_speed: string;
  center: string;
  comments: Comment[];
  country_distances: Country[];
  created_at: Date;
  departure: Date;
  destination: Location;
  distance?: number;
  google_duration?: number;
  id: number | string;
  likes_count: number;
  origin: Location;
  rides: Ride[];
  to_param: string;
  total_distance: number;
  travelling_with: number;
  user: {
    username: string;
    md5_email: string;
    gender: 'male' | 'female' | 'non-binary' | null;
  };
  user_id: number;
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
