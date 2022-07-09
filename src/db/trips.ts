import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  orderBy,
  query,
} from 'firebase/firestore';
import { collectionData } from 'rxfire/firestore';
import { startWith } from 'rxjs';
import { db } from '../utils/firebase';

export const tripsRef = query(
  collection(db, 'trips'),
  orderBy('createdAt', 'desc')
);
export const trips = collectionData(tripsRef, { idField: 'id' }).pipe(
  startWith([])
);

export const createTrip = async (trip: any) => {
  const doc = await addDoc(collection(db, 'trips'), trip);
  console.log({ doc });
};

export const getTrip = async (id: string) => {
  const tripSnapshot = await getDoc(doc(db, 'trips', id));
  if (tripSnapshot.exists()) {
    console.log('trip exists');
    return tripSnapshot.data();
  } else {
    return tripSnapshot.data();
    console.log("Trip doesn't exist");
  }
};

// get single document from firestore
export const fetchTrip = async (id: string) => {
  const docRef = doc(db, `trips/${id}`);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
};

export const deleteTrip = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'trips', id));
  } catch (err) {
    console.log(err);
  }
};

export type Location = {
  lat: number;
  lng: number;
  city: string;
  country: string;
  countryCode: string;
  placeId: string;
};

export type Trip = {
  arrival: string;
  createdAt: { seconds: number; nanoseconds: number };
  destination: Location;
  googleDuration: number;
  id: string;
  origin: Location;
  rides: string;
  start: string;
  totalDistance: number;
};

export const tripsMock: Trip[] = [
  {
    arrival: '2022-12-12T16:05',
    createdAt: { seconds: 1657044695, nanoseconds: 398000000 },
    destination: {
      lng: 9.9936818,
      city: 'Hamburg',
      countryCode: 'DE',
      country: 'Germany',
      placeId: 'ChIJuRMYfoNhsUcRoDrWe_I9JgQ',
      lat: 53.5510846,
    },
    googleDuration: 11812,
    id: 'YdLh1F2ECvH9PuY2EThl',
    origin: {
      lat: 52.52000659999999,
      countryCode: 'DE',
      lng: 13.404954,
      country: 'Germany',
      city: 'Berlin',
      placeId: 'ChIJAVkDPzdOqEcRcDteW0YgIQQ',
    },
    rides: '3',
    start: '2022-12-12T12:00',
    totalDistance: 288.967,
  },
  {
    arrival: '2020-12-12T17:00',
    createdAt: { seconds: 1657053541, nanoseconds: 57000000 },
    destination: {
      city: 'Bremen',
      country: 'Germany',
      lat: 53.07929619999999,
      countryCode: 'DE',
      placeId: 'ChIJNePuDBAosUcRUd83-VyI6MI',
      lng: 8.8016937,
    },
    googleDuration: 13971,
    id: 'MJncCFCLzTehEkM5i7v4',
    origin: {
      countryCode: 'DE',
      placeId: 'ChIJUTAoz9NGqEcRCGpRR5dAFJA',
      city: 'Schönefeld',
      lng: 13.5110672,
      country: 'Germany',
      lat: 52.36471040000001,
    },
    rides: '3',
    start: '2020-12-12T12:00',
    totalDistance: 397.613,
  },
];
