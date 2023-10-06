import Cookies from 'js-cookie';
import {
  Dispatch,
  FC,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import axios from '../../config/axios';
import { authenticateToken } from '../../db/users';
import { User } from '../../types';

type AuthProps = {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  setCurrentUser: Dispatch<SetStateAction<null>>;
};

const AuthContext = createContext<AuthProps>({
  currentUser: null,
  isAuthenticated: false,
  isLoading: false,
  logout: () => {},
  setCurrentUser: () => {},
});

export const AuthProvider: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('authToken');
    if (token && currentUser === null) {
      setIsLoading(true);
      authenticateToken(token)
        .then((res) => {
          setCurrentUser(res.data);
        })
        .catch((err) => {
          Cookies.remove('authToken');
        });

      setIsLoading(false);
    }
  }, [currentUser]);

  const logout = () => {
    const token = Cookies.get('authToken');

    axios
      .delete('/users/sign_out')
      .then(() => {
        Cookies.remove('authToken');
        setCurrentUser(null);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!currentUser,
        setCurrentUser,
        currentUser,
        isLoading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const ProtectedRoute: FC<{ children: JSX.Element }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (
    isLoading ||
    (!isAuthenticated && window.location.pathname !== '/login')
  ) {
    return <div>Loading...</div>;
  }
  return children;
};

export const useAuth = () => useContext(AuthContext);
