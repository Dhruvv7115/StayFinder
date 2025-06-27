import { CalendarDays, MapPin, Home } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../Api/api";

function Bookings() {
  const [bookings, setBookings] = useState([]);

  const fetchUserBookings = async() => {
    const response = await api.getBookings();
    if(response.status === 'FAILED') {
      return;
    }
    setBookings(response.bookings);
  }

  useEffect(() => {
    fetchUserBookings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 flex flex-col gap-6">
      <div className="flex items-center justify-center">
        <h1 className="text-4xl flex items-center font-bold mb-4">
          <Home className="inline-block mr-2 text-rose-500" size={30} strokeWidth={3} />
          <span className="text-rose-500">StayFinder</span>
        </h1>
      </div>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-black mb-6 text-left">
          <span className="text-rose-500">Your</span> Bookings
        </h1>

        {bookings.length === 0 ? (
          <p className="text-center text-gray-600 mt-20">
            You haven’t booked any stays yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden"
              >
                <img
                  src={booking.listing.images[0]}
                  alt={booking.listing.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 space-y-1">
                  <h2 className="text-lg font-semibold text-black truncate flex items-center gap-1">
                    <span>hosted by</span>
                    <span>{booking.owner.name}</span>
                  </h2>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin size={14} />
                    {booking.listing.address.split(', ')[0]}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <CalendarDays size={14} />
                    {new Date(booking.startDate).toLocaleDateString()} → {new Date(booking.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-rose-500 font-semibold">
                    ₹{booking.totalPrice}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Bookings;
