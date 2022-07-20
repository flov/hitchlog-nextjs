import { AuthProvider, getAuth, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, googleProvider } from '../utils/firebase';

export const createUser = async (userData: any, uid: string) => {
  console.log({ userData });
  const d = await setDoc(doc(db, 'users', uid), userData);
};

export const getUser = async (id: string) => {
  const userSnapshot = await getDoc(doc(db, 'users', String(id)));
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

export const signInWithGoogle = () => {
  return loginWithProvider(googleProvider);
};

export const loginWithProvider = async (provider: AuthProvider) => {
  const auth = getAuth();
  try {
    const { user } = await signInWithPopup(auth, provider);
  } catch (e) {
    console.log(e);
  }
};

export const logOut = async () => {
  const auth = getAuth();
  try {
    await signOut(auth);
  } catch (error) {
    console.log(error);
  }
};
