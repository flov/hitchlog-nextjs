export type User = {
  id: number;
  email: string;
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
  location: UserLocation;
};

export type UserLocation = {
  name?: string;
  country_code?: string;
  lng?: number;
  lat?: number;
  country?: string;
  city?: string;
};
