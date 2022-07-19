// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { Loader } from '@googlemaps/js-api-loader';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: 'AIzaSyCHCnUDEr21YboDgZctXoG4eLOj2x51YvM',
  authDomain: 'fir-test-4004d.firebaseapp.com',
  databaseURL:
    'https://fir-test-4004d-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'fir-test-4004d',
  storageBucket: 'fir-test-4004d.appspot.com',
  messagingSenderId: '276420004596',
  appId: '1:276420004596:web:a0c4e8184b14a7d1352ca1',
  measurementId: 'G-JLQRYWCFQ4',
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const database = getDatabase(firebaseApp);
export const auth = getAuth();
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const getLoader = (googleMapsKey: string) =>
  new Loader({
    apiKey: googleMapsKey,
    version: 'weekly',
    libraries: ['places'],
  });
