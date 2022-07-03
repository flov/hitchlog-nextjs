import { getAuth, signInWithPopup, AuthProvider, signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
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
        <button onClick={logOut}>Log out</button>
      </div>
    );
  }
  return (
    <button onClick={() => loginWithProvider(provider)}>
      Sign in with Google
    </button>
  );
};
