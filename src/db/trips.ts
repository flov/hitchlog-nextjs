import { addDoc, collection, orderBy, query } from 'firebase/firestore';
import { collectionData } from 'rxfire/firestore';
import { startWith } from 'rxjs';
import { db } from '../utils/firebase';

export const tripsRef = query(collection(db, 'trips'), orderBy('createdAt'));
export const trips = collectionData(tripsRef, { idField: 'id' }).pipe(
  startWith([])
);

export const createTrip = async (trip: any) => {
  const doc = await addDoc(collection(db, 'trips'), trip);
  console.log({ doc });
};
