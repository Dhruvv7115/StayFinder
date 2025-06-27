import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, X, Save, Eye, MapPin, DollarSign, Home, Calendar, Users, Wifi, Car, Utensils, Tv, Wind } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../Api/api';

const EditListingPage = () => {
  const { listingId } = useParams()
  const navigate = useNavigate();
  const [listing, setListing] = useState({
    address: '',
    landmark: '',
    availability: true,
    images: [],
    description: '',
    price: '',
    type: '',
    bedrooms: '',
    bathrooms: ''
  });
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  
  const [newImages, setNewImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const fetchListing = async () => {
    try {
      const response = await api.getListingById(listingId);
      setListing(response.listing);
      setStreet(response.listing.address.split(', ')[0]);
      setCity(response.listing.address.split(', ')[1]);
      setCountry(response.listing.address.split(', ')[2]);
      console.log(response.listing);
      console.log(response.listing.address);
    } catch (error) {
      console.error("Error fetching listing:", error);
    }
  }
  useEffect(() => {
    fetchListing();
  }, []);

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'condo', label: 'Condo' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'flat', label: 'Flat' },
    { value: 'other', label: 'Other' }
  ];

  const countries = [
    { value: 'India', label: 'India' },
    { value: 'USA', label: 'USA' },
    { value: 'UK', label: 'UK' },
    { value: 'Canada', label: 'Canada' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setListing(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  const handleStreetChange = (e) => {
    setStreet(e.target.value);
    setListing(prev => ({
      ...prev,
      address: `${e.target.value}, ${city}, ${country}`
    }))
  }

  const handleCityChange = (e) => {
    setCity(e.target.value);
    setListing(prev => ({
      ...prev,
      address: `${street}, ${e.target.value}, ${country}`
    }))
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors(prev => ({
        ...prev,
        [e.target.name]: ''
      }));
    }
  }

  const handleCountryChange = (e) => {
    setCountry(e.target.value);
    setListing(prev => ({
      ...prev,
      address: `${street}, ${city}, ${e.target.value}`
    }))
  }

  const handleAvailabilityChange = (e) => {
    setListing(prev => ({
      ...prev,
      availability: e.target.checked
    }));
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors(prev => ({
        ...prev,
        [e.target.name]: ''
      }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(prev => [...prev, ...files]);
    
    // Create preview URLs
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeExistingImage = (index) => {
    setListing(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!listing.address.trim()) newErrors.address = 'Address is required';
    if (!listing.description.trim()) newErrors.description = 'Description is required';
    if (!listing.price || listing.price <= 0) newErrors.price = 'Valid price is required';
    if (!listing.type) newErrors.type = 'Property type is required';
    if (!listing.bedrooms || listing.bedrooms < 0) newErrors.bedrooms = 'Valid bedroom count is required';
    if (!listing.bathrooms || listing.bathrooms < 0) newErrors.bathrooms = 'Valid bathroom count is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      
      // Append listing data
      Object.keys(listing).forEach(key => {
        if (key !== 'images' && key !== 'owner' && key !== '_id') {
          formData.append(key, listing[key]);
          console.log(`${key}:`, listing[key]);
        }
      });
      
      // Don't append images if there are none
      newImages.forEach(image => {
        formData.append('images', image);
      });

      // Debug what we're sending
      console.log('=== SENDING DATA ===');
      console.log('Listing object:', listing);
      console.log('New images count:', newImages.length);
      console.log('FormData entries:');
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value);
      }
      console.log('===================');
      
      // api.updateListing already returns parsed JSON
      const result = await api.updateListing(listingId, formData);
      
      // Check your backend's status directly
      if (result.status === "SUCCESS") {
        alert('Listing updated successfully!');
        console.log('Updated listing:', result.updatedListing);
        // Optionally navigate back or refresh the listing
        navigate(-1);
      } else {
        throw new Error(result.message || 'Failed to update listing');
      }
    } catch (error) {
      console.error('Update error:', error);
      // Handle both network errors and backend errors
      const errorMessage = error.message || 'Unknown error occurred';
      alert(`Error updating listing: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button 
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Listings
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            <span className="text-rose-500">Edit</span> Your Listing <Home className="inline w-10 h-10 text-rose-500" />
          </h1>
          <p className="text-gray-600 text-lg">Update your property details and photos</p>
        </div>

        <div className="space-y-8">
          {/* Property Details Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-2 rounded-full h-8 bg-rose-500 mr-4"></div>
              Property Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </label>
                <select
                  name="type"
                  value={listing.type}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg outline-0 focus:ring-2 focus:ring-rose-500 bg-white ${
                    errors.type ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select property type</option>
                  {propertyTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Per Night (₹)
                </label>
                <input
                  type="number"
                  name="price"
                  value={listing.price}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-0 ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter price per night"
                  min="0"
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Description
                </label>
                <textarea
                  name="description"
                  value={listing.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-0 resize-none ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe your property in detail..."
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-2 rounded-full h-8 bg-blue-500 mr-4"></div>
              Address
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <select
                  name="country"
                  value={country}
                  onChange={handleCountryChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-0 bg-white"
                >
                  {countries.map(country => (
                    <option key={country.value} value={country.value}>
                      {country.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={city}
                  onChange={handleCityChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-0 ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your city"
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={street}
                  onChange={handleStreetChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-0 ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Building no. with street name"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>

              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Landmark
                </label>
                <input
                  type="text"
                  name="landmark"
                  value={listing.landmark || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-0"
                  placeholder="Enter nearby landmark (optional)"
                />
              </div>
            </div>
          </div>

          {/* Room Details Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-2 rounded-full h-8 bg-green-500 mr-4"></div>
              Room Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms *
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  value={listing.bedrooms}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.bedrooms ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0"
                  min="0"
                />
                {errors.bedrooms && <p className="text-red-500 text-sm mt-1">{errors.bedrooms}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bathrooms *
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  value={listing.bathrooms}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.bathrooms ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0"
                  min="0"
                  step="0.5"
                />
                {errors.bathrooms && <p className="text-red-500 text-sm mt-1">{errors.bathrooms}</p>}
              </div>
            </div>
          </div>

          {/* Availability Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-2 rounded-full h-8 bg-yellow-500 mr-4"></div>
              Availability
            </h2>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="availability"
                checked={listing.availability}
                onChange={handleAvailabilityChange}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="availability" className="text-sm text-gray-700">
                This property is available for booking
              </label>
            </div>
          </div>

          {/* Images Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-2 rounded-full h-8 bg-purple-500 mr-4"></div>Photos</h2>
            
            {/* Existing Images */}
            {listing.images.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Current Photos</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {listing.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Current ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images */}
            {imagePreview.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-700 mb-4">New Photos</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreview.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`New ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload New Images */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2 font-medium">Add more photos</p>
              <p className="text-sm text-gray-500 mb-4">Upload high-quality photos to showcase your property</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="inline-flex items-center px-6 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 cursor-pointer transition-colors font-medium"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Files
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center space-x-4 pt-6">
            <button
              type="button"
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center px-8 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Listing
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditListingPage;