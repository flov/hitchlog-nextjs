import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { FirebaseAppProvider } from 'reactfire';
import { firebaseConfig } from '../src/utils/firebase';
import { createContext, Dispatch, SetStateAction, useState } from 'react';
import { UserCredential } from 'firebase/auth';

type UserContextType = {
  user: UserCredential | null;
  setUser: Dispatch<SetStateAction<UserCredential>>;
} | null;

export const UserContext = createContext<UserContextType>(null);

function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState(null);
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <UserContext.Provider value={{ user, setUser }}>
        <Component {...pageProps} />
      </UserContext.Provider>
    </FirebaseAppProvider>
  );
}

export default MyApp;
