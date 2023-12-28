import { createContext, useContext, useMemo, useState } from 'react';

const notifyContext = createContext();
const NotificationProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false)

  const showNotification = (isSuccess) => {
    setIsOpen(true);
    setIsSuccess(isSuccess)

    setTimeout(() => {
      setIsOpen(false);
    }, 3000);
  };

  const onError = (message) => {
    showNotification(false)
    setMessage(message)
  }

  const onSuccess = (message) => {
    showNotification(true)
    setMessage(message)
  }

  const contextValue = useMemo(
    () => ({
      isOpen,
      isSuccess,
      setIsSuccess,
      message,
      onError,
      onSuccess
    }),
    [isOpen, message, isSuccess]
  );

  return (
    <notifyContext.Provider value={contextValue}>
      {children}
    </notifyContext.Provider>
  );
};

export const useNotify = () => {
  return useContext(notifyContext);
};

export default NotificationProvider;
