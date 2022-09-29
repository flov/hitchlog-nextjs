import {
  createContext,
  Dispatch,
  FC,
  ReactElement,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import Cookies from 'js-cookie';
import { User } from '../../types';
import axios from 'axios';
import { API_URL } from '../../config';

type AuthProps = {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  setUser: Dispatch<SetStateAction<null>>;
};
const AuthContext = createContext<AuthProps>({
  currentUser: null,
  isAuthenticated: false,
  isLoading: false,
  logout: () => {},
  setUser: () => {},
});

export const AuthProvider: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('authToken');
    if (token && user === null) {
      setIsLoading(true);
      axios
        .get(`${API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: 'application/json',
          },
        })
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          Cookies.remove('authToken');
        });

      setIsLoading(false);
    }
  }, []);

  const logout = () => {
    const token = Cookies.get('authToken');

    axios
      .delete(`${API_URL}/users/sign_out`, {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: 'application/json',
        },
      })
      .then(() => {
        Cookies.remove('authToken');
        setUser(null);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        setUser,
        currentUser: user,
        isLoading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const ProtectRoute: FC<{ children: JSX.Element }> = ({ children }) => {
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
