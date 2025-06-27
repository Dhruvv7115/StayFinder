const API_BASE = 'http://localhost:8000/api/v1';

const api = {
  // Auth APIs
  register: async (userData) => {
    const response = await fetch(`${API_BASE}/users/register`, {
      method: 'POST',
      credentials: 'include',
      body: userData, 
    });
    return response.json();
  },
  sendOTP: async (email) => {
    const response = await fetch(`${API_BASE}/users/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email }),
    });
    return response.status;
  },
  
  verifyOTP: async (data) => {
    const response = await fetch(`${API_BASE}/users/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return response.json();
  },
  
  login: async (credentials) => {
    return await fetch(`${API_BASE}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });
  },
  
  logout: async () => {
    const response = await fetch(`${API_BASE}/users/logout`, {
      method: "POST",
      credentials: "include",
    });
    return response.json();
  },

  // User APIs
  getCurrentUser: async () => {
    const response = await fetch(`http://localhost:8000/api/v1/users/profile/`, {
      headers: { 'Content-Type': 'application/json' },
      credentials: "include"
    })
    const data = await response.json()
    return data.user;
  },
  updateName: async (name) => {
    const response = await fetch(`${API_BASE}/users/update-name`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name }),
    });
    return response.json();
  },
  updatePassword: async (password) => {
    const response = await fetch(`${API_BASE}/users/update-password`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ password }),
    });
    return response.json();
  },
  updateAvatar: async (avatar) => {
    const response = await fetch(`${API_BASE}/users/update-avatar`, {
      method: 'PATCH',
      credentials: 'include',
      body: avatar,
    });
    return response.json();
  },
  
  // Listings APIs
  getListings: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    
    const response = await fetch(`${API_BASE}/listings/display?${params}`, {
      credentials: 'include',
    });
    const data = await response.json();
    return data.listings;
  },
  
  getListingById: async (id) => {
    const response = await fetch(`${API_BASE}/listings/display/${id}`, {
      credentials: 'include',
    });
    return response.json();
  },

  getAllListingsOfUser: async (hostId) => {
    const response = await fetch(`${API_BASE}/listings/display/user/${hostId}`);
    return response.json();
  },
  
  createListing: async (listingData) => {
    const response = await fetch(`${API_BASE}/listings/upload`, {
      method: 'POST',
      body: listingData, // FormData with images
      credentials: 'include',
    });
    return response.json();
  },
  deleteListing: async (listingId) => {
    const response = await fetch(`${API_BASE}/listings/delete/${listingId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return response.json();
  },
  updateListing: async (listingId, listingData) => {
    const response = await fetch(`${API_BASE}/listings/update/${listingId}`, {
      method: 'PATCH',
      body: listingData, // FormData with images
      credentials: 'include',
    });
    return response.json();
  },
  
  // Favourites APIs
  addToFavourites: async (listingId) => {
    const response = await fetch(`${API_BASE}/favourites/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({ listingId }),
    });
    return response.json();
  },
  
  removeFromFavourites: async (listingId) => {
    const response = await fetch(`${API_BASE}/favourites/remove`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ listingId }),
    });
    return response.json();
  },
  
  getFavourites: async () => {
    const response = await fetch(`${API_BASE}/favourites/user`, {
      credentials: 'include',
    });
    const data = await response.json();
    if (data.status === 'FAILED') {
      return [];
    }
    return data.userFavourites;
  },
  
  // Bookings APIs
  createBooking: async (bookingData) => {
    const response = await fetch(`${API_BASE}/bookings/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(bookingData),
    });
    return response.json();
  },
  
  getBookings: async () => {
    const response = await fetch(`${API_BASE}/bookings/display`, {
      credentials: 'include',
    });
    return response.json();
  },
};

export {
  api, 
  API_BASE, 
}