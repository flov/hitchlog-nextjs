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


export const tripsRef = query(
  collection(db, 'trips'),
  orderBy('createdAt', 'desc'),
  limit(25)
);

export const paginatedTripsRef = query(
  collection(db, 'trips'),
  where('id', '>', 600),
  orderBy('id'),
  limit(25)
);

export const nextTripsRef = (lastDoc: any) => {
  return query(
    collection(db, 'trips'),
    orderBy('createdAt'),
    startAfter(lastDoc),
    limit(25)
  );
};

export const prevTripsRef = (firstDoc: any) => {
  return query(
    collection(db, 'trips'),
    orderBy('createdAt'),
    endBefore(firstDoc),
    limitToLast(25)
  );
};

export const trips = collectionData(tripsRef, { idField: 'id' }).pipe(
  startWith([])
);

export const createTrip = async (trip: any) => {
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
  const userSnapshot = await getDoc(doc(db, 'trips', id));
  return { ...userSnapshot.data(), id: userSnapshot.id } as Trip;
};

export const getRidesForTrip = async (id: string) => {
  const ridesRef = query(
    collectionGroup(db, 'rides'),
    where('trip_id', '==', id)
  );
  const querySnapshot = await getDocs(ridesRef);
  const rides: Ride[] = [];
  querySnapshot.forEach((doc) => {
    rides.push({ ...doc.data(), id: doc.id });
  });
  return rides;
};

export const getTripsForExperience = async (experience: string) => {
  const ridesRef = query(
    collectionGroup(db, 'rides'),
    where('experience', '==', experience)
  );
  const querySnapshot = await getDocs(ridesRef);
  const trip_ids: string[] = [];
  querySnapshot.forEach((doc) => {
    trip_ids.push(...doc.data()['trip_id']);
  });
  return trip_ids;
};

export const getTrips = async () => {
  const q = query(
    collection(db, 'trips'),
    orderBy('createdAt', 'desc'),
    limit(50)
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