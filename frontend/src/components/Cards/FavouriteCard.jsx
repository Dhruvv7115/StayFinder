import { Heart, Star } from "lucide-react"
import { useCallback } from "react"
import { api } from "../../Api/api"
import { useFavouriteContext } from "../../context/FavouriteContext"

function FavouriteCard({ favourite }) {
  const { favourites, setFavourites } = useFavouriteContext();
  
  const removeFromFavourites = useCallback(async () => {
    try {
      setFavourites(prev => prev.filter(fav => fav.listing._id !== favourite.listing._id));
      await api.removeFromFavourites(favourite.listing._id);
      localStorage.setItem("favourites", JSON.stringify(favourites.filter(fav => fav.listing._id !== favourite.listing._id)));
    } catch (error) {
      console.error("Error removing from favourites:", error);
      // You might want to revert the state change here if the API call fails
      setFavourites(prev => prev.filter(fav => fav.listing._id !== favourite.listing._id));
      localStorage.setItem("favourites", JSON.stringify(favourites.filter(fav => fav.listing._id !== favourite.listing._id)));
    }
  }, [setFavourites, favourite.listing._id]);
  
  return (
    <div
      className="bg-rose-50 rounded-lg overflow-hidden cursor-pointer group hover:shadow-lg transition-shadow"
    >
      <div className="relative">
        <img
          src={favourite.listing.images?.[0]}
          alt={favourite.listing.address}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={removeFromFavourites}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
        >
          <Heart
            size={20}
            className="fill-rose-500 text-rose-500"
          />
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-gray-900 truncate">{favourite.listing.address}</h3>
          <div className="flex items-center space-x-1">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-600">4.0</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-2">{favourite.listing.landmark}</p>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {favourite.listing.bedrooms} bedroom • {favourite.listing.bathrooms} bathroom
          </div>
          <div className="font-semibold">
            ₹{favourite.listing.price}<span className="font-normal text-sm text-gray-600">/night</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FavouriteCard