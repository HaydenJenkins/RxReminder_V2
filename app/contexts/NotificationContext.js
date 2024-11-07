import { createContext, useContext } from 'react';

// Create the context
const NotificationContext = createContext();

// Provider component to wrap your app
export function NotificationProvider({ children, value }) {
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// Custom hook for easy access to the context
export function useNotification() {
  return useContext(NotificationContext);
}
