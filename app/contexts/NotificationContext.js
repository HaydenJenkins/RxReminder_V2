import { createContext, useContext } from 'react';

const NotificationContext = createContext();

export function NotificationProvider({ children, value }) {
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}
