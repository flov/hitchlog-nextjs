import { getAuth, signInWithPopup, AuthProvider } from 'firebase/auth';
import { Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { loginWithProvider, logOut, writeUserToFirebase } from '../db/users';
import { googleProvider } from '../utils/firebase';

export const CurrentUser = () => {
  const auth = getAuth();
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    writeUserToFirebase(user);
  }, [user]);

  if (loading) {
    return (
      <div>
        <p>Initialising User...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div>
        <p>
          Error: <span>{error.message}</span>
        </p>
      </div>
    );
  }
  if (user) {
    return (
      <div>
        <p>Current User: {user.email}</p>
        <Button onClick={logOut}>Log out</Button>
      </div>
    );
  }
  return (
    <Button onClick={() => loginWithProvider(googleProvider)}>
      Sign in with Google
    </Button>
  );
};
