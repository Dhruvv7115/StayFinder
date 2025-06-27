import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, House } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { api } from "../Api/api"; // Uncomment when integrating

function HostDashboard() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useUserContext();
  const fetchHostListings = async () => {
    try {
      const res = await api.getAllListingsOfUser(user._id);
      console.log(res);
      setLoading(false);
      if (res.status !== "SUCCESS") {
        console.log(res.message);
      } else {
        setListings(res.listings);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Replace with actual API call
  useEffect(() => {
    fetchHostListings(); 
  }, []);

  const handleDelete = async (id) => {
    setListings(listings.filter((listing) => listing._id !== id));
    await api.deleteListing(id);
  };

  if(loading){
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div>Loading listings...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div>
          <h1 className="text-4xl font-bold text-rose-500 mb-6 flex items-center justify-center">
            <House className="inline-block mr-2" size={36} strokeWidth={3} color="currentColor"/>
            <span>StayFinder</span>
          </h1>
        </div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-black">Your Listings</h1>
          <button
            onClick={() => navigate("/create-listing")}
            className="flex items-center gap-2 bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-600 transition"
          >
            <Plus size={18} />
            Add Listing
          </button>
        </div>

        {listings.length === 0 ? (
          <p className="text-gray-600">You haven't added any listings yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div
                key={listing._id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow"
              >
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-black truncate">
                    {listing.title}
                  </h2>
                  <p className="text-sm text-gray-600 mb-2">
                    {listing.location}
                  </p>
                  <p className="text-rose-500 font-bold mb-4">
                    ₹{listing.price}/night
                  </p>
                  <div className="flex justify-between items-center text-sm">
                    <button
                      onClick={() => navigate(`/update-listing/${listing._id}`)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(listing._id)}
                      className="flex items-center gap-1 text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HostDashboard;
