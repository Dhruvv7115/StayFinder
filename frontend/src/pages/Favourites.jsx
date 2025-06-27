import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { api } from "../Api/api";
import { useUserContext } from "../context/UserContext";
import { useFavouriteContext } from "../context/FavouriteContext";
import FavouriteCard from "../components/Cards/FavouriteCard";

function Favourites() {
  const { favourites, setFavourites } = useFavouriteContext();  
  const navigate = useNavigate();
  const { user } = useUserContext();

  const fetchFavourites = useCallback(async () => {
    
    
    try {
      const userFavourites = await api.getFavourites();
      console.log(userFavourites);
      setFavourites(userFavourites || []);
    } catch (err) {
      console.error("Failed to fetch favourites:", err);
      setFavourites([]);
    }
  }, [user, setFavourites]); // Only depend on user and setFavourites

  useEffect(() => {
    fetchFavourites();
  }, [fetchFavourites]); // Now fetchFavourites is stable due to useCallback

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-black mb-6 flex items-center justify-center">
          <Heart className="inline-block text-black mr-2 fill-rose-500" size={36} strokeWidth={3} color="currentColor"/>
          <span>Your</span>
          <span className="text-rose-500">Favourites</span>
        </h2>

        {favourites.length === 0 ? (
          <div className="text-center text-gray-600 mt-20">
            <p className="text-lg mb-4">You haven't saved any stays yet.</p>
            <button
              onClick={() => navigate("/")}
              className="bg-rose-500 hover:bg-rose-600 text-white font-semibold px-6 py-2 rounded transition"
            >
              Explore Listings
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-6">
            {favourites.map((fav, idx) => {
              return (
                <FavouriteCard key={fav._id} favourite={fav} />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Favourites;