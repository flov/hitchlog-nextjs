import { where, collectionGroup, getDocs, query } from 'firebase/firestore';
import { EXPERIENCES, Trip } from '../types';
import { db } from '../utils/firebase';

export const getTripsByExperience = async (experience: EXPERIENCES) => {
  const ridesQuery = query(
    collectionGroup(db, 'rides'),
    where('experience', '==', experience)
  );
  const querySnapshot = await getDocs(ridesQuery);
  let trips: Trip[] = [];
  // for (let idx = 0; idx < querySnapshot.docs.length; idx++) {
  // const ride = querySnapshot.docs[idx].data();
  // const tripDoc = await getDoc(doc(db, 'trips', String(ride.tripId)));
  // trips.push({ ...tripDoc.data(), id: tripDoc.id });
  // }
  return trips;
};
