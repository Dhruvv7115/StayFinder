import { useContext, useState, createContext, useMemo } from "react";

const FavouriteContext = createContext();

const FavouriteContextProvider = ({ children }) => {
  const [favourites, setFavourites] = useState([]);
  
  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = {
    favourites, 
    setFavourites
  };

  return (
    <FavouriteContext.Provider value={contextValue}>
      {children}
    </FavouriteContext.Provider>
  )
}

const useFavouriteContext = () => {
  const favouriteContext = useContext(FavouriteContext);
  
  if (!favouriteContext) {
    throw new Error('useFavouriteContext must be used within a FavouriteContextProvider');
  }
  
  return favouriteContext;
}

export { useFavouriteContext, FavouriteContextProvider }