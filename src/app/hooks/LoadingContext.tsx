import { createContext, useState, useContext } from 'react';

const LoadingContext = createContext({ isLoading: false, setIsLoading: (value: boolean) => {} });

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};
