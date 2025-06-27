import { useEffect, useState, useCallback } from "react"
import PropertyCard from "../components/Cards/PropertyCard"
import { api } from '../Api/api'
import { useUserContext } from "../context/UserContext";
import { useFavouriteContext } from "../context/FavouriteContext";

function ListingsPage({ query }) {
  const [properties, setProperties] = useState([]);
  // Fixed: Remove the incorrect default parameter
  const { favourites, setFavourites } = useFavouriteContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useUserContext();

  const fetchListings = useCallback(async (searchQuery) => {
    try {
      setLoading(true);
      setError(null);
      const listings = await api.getListings(searchQuery);
      setProperties(listings || []);
    } catch (err) {
      console.error("Failed to fetch listings:", err);
      setError("Failed to load listings");
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, []); // Remove unnecessary dependencies

  useEffect(() => {
    fetchListings(query);
  }, [query, fetchListings]);

  if (loading) {
    return (
      <main className="py-4 px-12 flex justify-center items-center min-h-64">
        <div className="text-lg">Loading...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="py-4 px-12 flex justify-center items-center min-h-64">
        <div className="text-lg text-red-500">{error}</div>
      </main>
    );
  }

  return (
    <main className="py-4 px-32 flex flex-col gap-4">    
      <section className="p-6 bg-gray-50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {properties.length > 0 ? (
          properties.map((listing, index) => (
            <PropertyCard 
              key={listing._id} 
              listing={listing}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            No properties found
          </div>
        )}
      </section>
    </main>
  )
}

export default ListingsPage