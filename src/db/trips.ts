import {
  addDoc,
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  endBefore,
  getDoc,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore';
import { collectionData } from 'rxfire/firestore';
import { startWith } from 'rxjs';
import { Ride, Trip } from '../types';
import { db } from '../utils/firebase';

const limitNumber = 12;

export const tripsRef = query(
  collection(db, 'trips'),
  orderBy('createdAt', 'desc'),
  limit(limitNumber)
);

export const paginatedTripsRef = query(
  collection(db, 'trips'),
  where('id', '>', 600),
  orderBy('id'),
  limit(limitNumber)
);

export const nextTripsRef = (lastDoc: any) => {
  return query(
    collection(db, 'trips'),
    orderBy('createdAt'),
    startAfter(lastDoc),
    limit(limitNumber)
  );
};

export const prevTripsRef = (firstDoc: any) => {
  return query(
    collection(db, 'trips'),
    orderBy('createdAt'),
    endBefore(firstDoc),
    limitToLast(limitNumber)
  );
};

export const trips = collectionData(tripsRef, { idField: 'id' }).pipe(
  startWith([])
);

export const createTrip = async (trip: Trip) => {
  const doc = await addDoc(collection(db, 'trips'), trip);
  console.log({ doc });
};

export const addRideData = async (
  trip: Trip,
  rideData: Ride,
  index: number
) => {
  const { rides } = trip;
  // Todo: update this to reflect the new data structure
  // rides[index] = rideData;
  // return await updateDoc(doc(db, 'trips', trip.id), {
  //   rides: rides,
  // });
};

export const getTrip = async (id: string) => {
  const tripSnapshot = await getDoc(doc(db, 'trips', id));
  return { ...tripSnapshot.data(), id: tripSnapshot.id } as Trip;
};

export const getRidesForTrip = async (id: string) => {
  const ridesRef = query(
    collectionGroup(db, 'rides'),
    where('tripId', '==', Number(id))
  );
  const querySnapshot = await getDocs(ridesRef);
  const rides: Ride[] = [];
  querySnapshot.forEach((doc) => {
    rides.push({ ...doc.data(), id: doc.id });
  });
  return rides;
};

export const getTripsByExperience = async (experience: string) => {
  const tripsRef = query(
    collectionGroup(db, 'trips'),
    where('rideExperiences', 'array-contains', experience),
    limit(limitNumber)
  );
  const querySnapshot = await getDocs(tripsRef);
  console.log(querySnapshot.docs.length);
  const trips = await Promise.all(
    querySnapshot.docs.map(async (doc) => {
      return { ...doc.data(), id: doc.id };
    })
  );
  return trips;
};

export const getTrips = async () => {
  const q = query(
    collection(db, 'trips'),
    orderBy('createdAt', 'desc'),
    limit(limitNumber)
  );
  const querySnapshot = await getDocs(q);
  const trips: Trip[] = [];
  querySnapshot.forEach((doc) => {
    trips.push({ id: doc.id, ...doc.data() } as Trip);
  });
  return trips;
};

export const deleteTrip = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'trips', id));
  } catch (err) {
    console.log(err);
  }
};
