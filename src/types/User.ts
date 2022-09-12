export type User = {
  displayName: string;
  admin?: boolean;
  providerId?: string;
  email: string;
  createdAt?: string;
  gender?: string;
  uid?: string;
  dateOfBirth?: string;
  name?: string;
  beWelcomeUser?: string;
  languages?: string;
  photoURL?: string;
  location?: UserLocation;
};

export type NewUser = {
  user_id: number;
  username: string;
  gender: string;
};

export type UserLocation = {
  lng: number;
  lat: number;
  country: string;
  city: string;
  countryCode: string;
};
