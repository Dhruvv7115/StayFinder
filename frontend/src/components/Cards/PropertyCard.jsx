import { Heart, Star } from "lucide-react";
import { api } from "../../Api/api";
import { useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFavouriteContext } from "../../context/FavouriteContext";

function PropertyCard({ listing }) {
  const { favourites, setFavourites } = useFavouriteContext();

  const navigate = useNavigate();

  useEffect(() => {
    const storedFavourites = localStorage.getItem("favourites");
    if (storedFavourites) {
      setFavourites(JSON.parse(storedFavourites));
    }
  }, [setFavourites]);

  // Calculate if this listing is a favourite based on the global favourites state
  const isFavourite = useMemo(() => favourites.some(favourite => favourite.listing._id === listing._id), [favourites, listing._id]);

  const handleFavouriteToggle = async (e) => {
    e.stopPropagation();
    if(isFavourite) {
      // Remove from favourites
      setFavourites(favourites.filter(favourite => favourite.listing._id !== listing._id));
      await api.removeFromFavourites(listing._id);
      localStorage.setItem("favourites", JSON.stringify(favourites.filter(favourite => favourite.listing._id !== listing._id)));
      console.log("removed from favourites: ", listing._id)
    } else {
      // Add to favourites
      setFavourites([...favourites, { listing }]);
      await api.addToFavourites(listing._id);
      localStorage.setItem("favourites", JSON.stringify([...favourites, { listing }]));
      console.log("added to favourites", listing._id)
    }
  }

  return (
    <div
      className="bg-white rounded-lg overflow-hidden cursor-pointer group hover:shadow-lg transition-shadow"
      onClick={() => navigate(`/listing/${listing._id}`)}
    >
      <div className="relative">
        <img
          src={listing.images?.[0]}
          alt={listing.address}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={(event) => handleFavouriteToggle(event)}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
        >
          <Heart
            size={20}
            className={isFavourite ? "fill-rose-500 text-rose-500" : "text-gray-600"}
          />
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-gray-900 truncate">{listing.address}</h3>
          <div className="flex items-center space-x-1">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-600">4.5</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-2">{listing.landmark}</p>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {listing.bedrooms} bedroom • {listing.bathrooms} bathroom
          </div>
          <div className="font-semibold">
            ₹{listing.price}<span className="font-normal text-sm text-gray-600">/night</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyCard