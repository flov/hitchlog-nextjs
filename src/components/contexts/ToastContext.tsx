import { Toast } from 'flowbite-react';
import { AnimatePresence, motion } from 'framer-motion';
import React, {
  FC,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { HiCheck, HiExclamation, HiX } from 'react-icons/hi';
import { v4 as uuidv4 } from 'uuid';

type ToastProps = {
  addToast: (
    content: string,
    appearance?: 'success' | 'error' | 'warning' | undefined
  ) => void;
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
  appearance: string;
  remove: () => void;
};

export const ToastsProvider: FC<{ children: JSX.Element }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((content: string, appearance = 'success') => {
    const id = uuidv4();

    const toast = {
      id,
      content,
      autoDismiss: true,
      appearance: appearance || 'success',
      remove: () => setToasts((toasts) => toasts.filter((t) => t.id !== id)),
    };

    setToasts((toasts) => [...toasts, toast]);
  }, []);

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
            <AnimatePresence>
              {toasts.map((toast) => (
                <motion.div
                  key={toast.id}
                  initial={{ opacity: 0, y: 50, scale: 0.3 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  <MyToast key={toast.id} {...toast} />
                </motion.div>
              ))}
            </AnimatePresence>,
            document.getElementById('portal') as Element
          )
        : null}
    </ToastsContext.Provider>
  );
};

const MyToast: FC<Toast> = ({ content, appearance, autoDismiss, remove }) => {
  useEffect(() => {
    if (autoDismiss) {
      const timeoutHandle = setTimeout(remove, 10000);

      return () => clearTimeout(timeoutHandle);
    }
  }, [autoDismiss, remove]);

  return (
    <div className="mb-4 border border-gray-600 rounded-lg">
      <Toast>
        {appearance === 'success' && (
          <div className="inline-flex items-center justify-center w-8 h-8 text-green-500 bg-green-100 rounded-lg shrink-0 dark:bg-green-800 dark:text-green-200">
            <HiCheck className="w-5 w-24 h-5" />
          </div>
        )}
        {appearance === 'error' && (
          <div className="inline-flex items-center justify-center w-8 h-8 text-red-500 bg-red-100 rounded-lg shrink-0 dark:bg-red-800 dark:text-red-200">
            <HiExclamation className="w-5 w-24 h-5" />
          </div>
        )}
        {appearance === 'warning' && (
          <div className="inline-flex items-center justify-center w-8 h-8 text-yellow-500 bg-yellow-100 rounded-lg shrink-0 dark:bg-yellow-800 dark:text-yellow-200">
            <HiExclamation className="w-5 w-24 h-5" />
          </div>
        )}

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
