import axios from '../config/axios';

export const getTripsWithQuery = async (query: any) => {
  return axios.get('/trips', { params: query });
};

export const getRandomTrips = async (
  type: 'videos' | 'stories' | 'photos' | '' = ''
) => axios.get('/trips/latest', { params: type ? { [type]: true } : {} });

export const gettrip = async (trip_id: any) => axios.get(`/trips/${trip_id}`);

export const getTripsByLocation = async (
  north_lat: number,
  south_lat: number,
  west_lng: number,
  east_lng: number
) =>
  axios.get(`/trips`, {
    params: {
      q: {
        from_lat_gt: south_lat,
        from_lat_lt: north_lat,
        from_lng_gt: west_lng,
        from_lng_lt: east_lng,
      },
    },
  });

export const getTrip = async (trip_id: any) => axios.get(`/trips/${trip_id}`);
export const createTrip = (payload: any) => axios.post(`/trips`, payload);
export const deleteTrip = (id: number) => axios.delete(`/trips/${id}`);
export const updateTrip = (payload: any) =>
  axios.put(`/trips/${payload.id}`, payload);
export const updateRide = (payload: any) =>
  axios.patch(`/rides/${payload.id}`, payload);
