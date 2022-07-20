import { QueryDocumentSnapshot } from 'firebase/firestore';
import { Ride } from './Ride';

export type Location = {
  lat: number;
  lng: number;
  city: string;
  country: string;
  countryCode: string;
  placeId: string;
};

export type Timestamp = { seconds: number; nanoseconds: number };

export type Trip = {
  arrival?: Timestamp;
  createdAt?: Timestamp;
  destination?: Location;
  googleDuration?: number;
  id?: string;
  origin?: Location;
  rides?: Ride[];
  departure?: Timestamp;
  totalDistance?: number;
  uid?: string;
};

export const tripConverter = {
  toFirestore: (data: Trip) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as Trip,
};