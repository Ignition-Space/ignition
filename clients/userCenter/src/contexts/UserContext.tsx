import React, { createContext, useContext, ReactNode } from 'react';
import { useUser } from '@/hooks/useUser';

const UserContext = createContext<ReturnType<typeof useUser> | undefined>(
  undefined,
);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const userState = useUser();

  return (
    <UserContext.Provider value={userState}>{children}</UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
