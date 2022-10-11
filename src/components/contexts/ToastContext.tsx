import { Toast } from 'flowbite-react';
import React, {
  FC,
  createContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useContext,
} from 'react';
import { createPortal } from 'react-dom';
import { v4 as uuidv4 } from 'uuid';
import { HiCheck } from 'react-icons/hi';

type ToastProps = {
  addToast: (content: string, options?: {}) => void;
};

const ToastsContext = createContext<ToastProps>({
  addToast: () => {
    throw new Error('To add a toast, wrap the app in a ToastsProvider.');
  },
});

type Toast = {
  id: string;
  content: string;
  autoDismiss: boolean;
  remove: () => void;
};

export const ToastsProvider: FC<{ children: JSX.Element }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (content: string, options = { autoDismiss: true }) => {
      const id = uuidv4();

      const toast = {
        id,
        content,
        ...options,
        remove: () => setToasts((toasts) => toasts.filter((t) => t.id !== id)),
      };

      setToasts((toasts) => [...toasts, toast]);
    },
    []
  );

  const contextValue = useMemo(() => ({ addToast }), [addToast]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return (
    <ToastsContext.Provider value={contextValue}>
      {children}
      {mounted
        ? createPortal(
            <div className="absolute z-50 ml-auto mr-auto text-center top-4 right-4">
              {toasts.map((toast) => (
                <MyToast key={toast.id} {...toast} />
              ))}
            </div>,
            document.getElementById('portal') as Element
          )
        : null}
    </ToastsContext.Provider>
  );
};

const MyToast: FC<Toast> = ({ content, autoDismiss, remove }) => {
  useEffect(() => {
    if (autoDismiss) {
      const timeoutHandle = setTimeout(remove, 5000);

      return () => clearTimeout(timeoutHandle);
    }
  }, [autoDismiss, remove]);

  return (
    <div className="mb-4">
      <Toast color="success">
        <div className="inline-flex items-center justify-center w-8 h-8 text-green-500 bg-green-100 rounded-lg shrink-0 dark:bg-green-800 dark:text-green-200">
          <HiCheck className="w-5 w-24 h-5" />
        </div>
        <div className="ml-3 text-sm font-normal">{content}</div>
        <div className="flex items-center ml-auto space-x-2">
          <Toast.Toggle />
        </div>
      </Toast>
    </div>
  );
};

export const useToasts = () => {
  return useContext(ToastsContext);
};

export default ToastsProvider;
