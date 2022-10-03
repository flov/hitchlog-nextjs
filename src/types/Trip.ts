import { Ride } from './Ride';

export type Location = {
  lat?: number;
  lng?: number;
  city?: string;
  country?: string;
  country_code?: string;
  placeId?: string;
};

export type Timestamp = { seconds: number; nanoseconds: number };

export type Trip = {
  id: number | string;
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
  user: { username: string; gender: string };
};

export type Country = {
  country_code: string;
  country: string;
  distance: number;
};
