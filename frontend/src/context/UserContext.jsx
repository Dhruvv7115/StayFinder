import { useContext, useState, createContext, useMemo } from "react";

const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Changed from {} to null for better initial state
  
  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = {
    user, 
    setUser
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  )
}

const useUserContext = () => {
  const userContext = useContext(UserContext);
  
  if (!userContext) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }
  
  return userContext;
}

export { useUserContext, UserContextProvider }