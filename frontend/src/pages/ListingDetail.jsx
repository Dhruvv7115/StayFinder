import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Users, Star } from "lucide-react";
import { api } from "../Api/api";

function ListingDetails() {
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);
  const [currentImg, setCurrentImg] = useState(0);
  const [days, setDays] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const fetchListing = async () => {
    try {
      const response = await api.getListingById(listingId);
      setListing(response.listing);
      console.log(response.listing);
    } catch (error) {
      console.error("Error fetching listing:", error);
    }
  }
  const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };
  const reserveListing = async () => {
    console.log("Date: ", days);
    console.log("Total Price:", listing.price * parseInt(days));
    console.log("listing owner id: ", listing.owner._id);
    const today = new Date();
    const startDate = formatDate(today);

    const end = new Date(today);
    end.setDate(end.getDate() + parseInt(days));
    const endDate = formatDate(end);
    const response = await api.createBooking({
      listing: listingId,
      startDate,
      endDate,
      totalPrice: listing.price * parseInt(days), 
      owner: listing.owner._id, 
    });

    if (response.status === "SUCCESS") {
      console.log("Booking created successfully");
      setShowModal(true);
    } else {
      console.error("Error creating booking:", response.error);
    }
  }
  // Sample static listing (replace with API call)
  useEffect(() => {
    fetchListing()
  }, [])
  const images = listing?.images || [];

  const prevImg = () => {
    setCurrentImg((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImg = () => {
    setCurrentImg((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  

  if (!listing) return <div className="p-10 text-center">Loading...</div>;

  return (
    
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Booking Successful</h2>
            <p className="text-gray-600">Your booking has been confirmed.</p>
            <button
              className="mt-4 bg-rose-500 text-white py-2 px-4 rounded-md hover:bg-rose-600 transition"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="relative w-full h-[500px] overflow-hidden">
          <img
            src={images[currentImg]}
            alt={`Image ${currentImg + 1}`}
            className="w-full h-full object-cover transition-all duration-500"
          />

          {/* Left button */}
          <button
            onClick={prevImg}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-rose-100 transition"
          >
            <ChevronLeft className="text-rose-500" />
          </button>

          {/* Right button */}
          <button
            onClick={nextImg}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-rose-100 transition"
          >
            <ChevronRight className="text-rose-500" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <div
                key={i}
                onClick={() => setCurrentImg(i)}
                className={`w-3 h-3 rounded-full cursor-pointer ${
                  i === currentImg ? "bg-rose-500" : "bg-white border border-rose-500"
                }`}
              />
            ))}
          </div>
        </div>


        <div className="p-6">

          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-600 flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {listing.address}
            </p>
            <div className="flex items-center text-rose-500 gap-1 font-medium">
              <Star className="w-4 h-4 fill-rose-500" />
              <span>4.5</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-between text-sm text-gray-700 mb-6">
            <div className="flex items-center gap-2">
              🛏️ {listing.bedrooms} Bedrooms
            </div>
            <div className="flex items-center gap-2">
              🛁 {listing.bathrooms} Bathrooms
            </div>
            <div className="flex items-center gap-2">
              <img src={listing.owner.avatar} alt="owner-image" className="w-6 h-6 rounded-full" />
              <span>Hosted by {listing.owner.name}</span>
            </div>
            <div className="flex items-center gap-2">
              Type: {listing.type}
            </div>
          </div>

          <p className="text-gray-800 mb-6 leading-relaxed">
            {listing.description}
          </p>

          <div className="flex items-center justify-between border-t pt-4">
            <div>
              <p className="text-gray-600 text-sm">Price per night</p>
              <p className="text-2xl font-semibold text-black">
                ₹{listing.price}
              </p>
            </div>
            <select 
              name="days" 
              id="days" 
              className="px-4 py-2 rounded-md transition" 
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <option key={num} value={num}>
                  {num} day{num > 1 ? 's' : ''}
                </option>
              ))}
            </select>
            <button
              onClick={reserveListing}
              className="bg-rose-500 text-white px-6 py-2 rounded-md hover:bg-rose-600 transition"
            >
              Reserve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingDetails;
