export type User = {
  id: number;
  username: string;
  email: string;
  gender: string;
  about_you: string;
  languages?: string;
  // location?: UserLocation;
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
  country_code: string;
};
