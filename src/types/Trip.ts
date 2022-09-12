import { QueryDocumentSnapshot } from 'firebase/firestore';
import { EXPERIENCES, Ride } from './Ride';
import { NewUser } from './User';

export type Location = {
  lat?: number;
  lng?: number;
  city?: string;
  country?: string;
  countryCode?: string;
  placeId?: string;
};

export type Timestamp = { seconds: number; nanoseconds: number };

export type Trip = {
  id: number | string;
  arrival: Date;
  departure: Date;
  created_at: Date;
  origin: Location;
  destination: Location;
  google_duration?: number;
  rides: Ride[];
  distance?: number;
  travelling_with: number;
  user: NewUser;
};

export const tripConverter = {
  toFirestore: (data: Trip) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as Trip,
};
