import {
  where,
  collectionGroup,
  getDocs,
  doc,
  query,
  collection,
  getDoc,
} from 'firebase/firestore';
import { EXPERIENCES, Trip, Ride } from '../types';
import { db } from '../utils/firebase';
import { getTrip } from './trips';

export const getTripsByExperience = async (experience: EXPERIENCES) => {
  const ridesQuery = query(
    collectionGroup(db, 'rides'),
    where('experience', '==', experience)
  );
  const querySnapshot = await getDocs(ridesQuery);
  let trips: Trip[] = [];
  for (let idx = 0; idx < querySnapshot.docs.length; idx++) {
    const ride = querySnapshot.docs[idx].data();
    const tripDoc = await getDoc(doc(db, 'trips', String(ride.trip_id)));
    trips.push({ ...tripDoc.data(), id: tripDoc.id });
  }
  return trips;
};
