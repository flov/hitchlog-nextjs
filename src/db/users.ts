import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';

export const createUser = async (userData: any, uid: string) => {
  console.log({ userData });
  const d = await setDoc(doc(db, 'users', uid), userData);
};

export const getUser = async (id: string) => {
  const userSnapshot = await getDoc(doc(db, 'users', id));
  return userSnapshot.data();
};

export const writeUserToFirebase = async (user: any) => {
  if (user) {
    const userData = user.providerData[0];
    const firebaseUser = await getUser(userData.uid);
    if (!firebaseUser) {
      createUser(userData, user.uid);
    }
  }
};
