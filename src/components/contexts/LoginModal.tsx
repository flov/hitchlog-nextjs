import { Modal } from 'flowbite-react';
import {
  createContext,
  FC,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import Login from '../Login';

const LoginModalContext = createContext<{ toggleLoginModal: () => void }>({
  toggleLoginModal: () => {
    throw new Error(
      'To implement modal, wrap the app in a LoginModalProvider.'
    );
  },
});

export const LoginModalProvider: FC<{ children: JSX.Element }> = ({
  children,
}) => {
  const [loginModal, setLoginModal] = useState(false);
  const toggleLoginModal = useCallback(
    () => setLoginModal(!loginModal),
    [loginModal]
  );

  const contextValue = useMemo(
    () => ({ toggleLoginModal: toggleLoginModal }),
    [toggleLoginModal]
  );

  return (
    <LoginModalContext.Provider value={contextValue}>
      <Modal size="md" show={loginModal} onClose={toggleLoginModal}>
        <Modal.Header>Sign in to your account</Modal.Header>
        <Modal.Body>
          <Login toggleModal={toggleLoginModal} />
        </Modal.Body>
      </Modal>
      {children}
    </LoginModalContext.Provider>
  );
};

export const useLoginModal = () => {
  return useContext(LoginModalContext);
};

export default LoginModalProvider;
