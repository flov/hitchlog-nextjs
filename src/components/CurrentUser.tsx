import { getAuth, signInWithPopup, AuthProvider, signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { createUser, getUser, writeUserToFirebase } from '../db/users';
import { provider } from '../utils/firebase';

const loginWithProvider = async (provider: AuthProvider) => {
  const auth = getAuth();
  try {
    const { user } = await signInWithPopup(auth, provider);
  } catch (e) {
    console.log(e);
  }
};
const logOut = async () => {
  const auth = getAuth();
  try {
    await signOut(auth);
  } catch (error) {
    console.log(error);
  }
};

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
        <p>Error: {error}</p>
      </div>
    );
  }
  if (user) {
    return (
      <div>
        <p>Current User: {user.email}</p>
        <button
          className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          onClick={logOut}
        >
          Log out
        </button>
      </div>
    );
  }
  return (
    <button
      className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
      onClick={() => loginWithProvider(provider)}
    >
      Sign in with Google
    </button>
  );
};
