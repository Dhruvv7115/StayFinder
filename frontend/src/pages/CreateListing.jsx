import { useState } from 'react';
import { Home, Upload, X, Camera, CheckCircle } from 'lucide-react';
import { api } from '../Api/api';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [country, setCountry] = useState("India");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    type: "house",
    description: "",
    price: "",
    bedrooms: "",
    bathrooms: "", // Changed from washrooms to bathrooms
  });

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      url: URL.createObjectURL(file),
      name: file.name
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (id) => {
    setImages(prev => {
      const imageToRemove = prev.find(img => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      return prev.filter(img => img.id !== id);
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (images.length < 2) {
      alert('Please upload at least 2 images');
      return;
    }

    setLoading(true);
    setError(false);
    setSuccess(false);
    
    // Create FormData object
    const formDataToSubmit = new FormData();
    
    // Add basic form fields
    formDataToSubmit.append('type', formData.type);
    formDataToSubmit.append('description', formData.description);
    formDataToSubmit.append('price', formData.price);
    formDataToSubmit.append('bedrooms', formData.bedrooms);
    formDataToSubmit.append('bathrooms', formData.bathrooms); // Changed from washrooms
    
    // Add address as a single field (as your backend expects)
    const fullAddress = `${street}, ${city}, ${country}`;
    formDataToSubmit.append('address', fullAddress);
    
    // Add image files
    images.forEach((image, index) => {
      formDataToSubmit.append('images', image.file);
    });
    
    console.log('Form data prepared for submission');
    // Note: You can't console.log FormData directly, but you can iterate through it
    for (let [key, value] of formDataToSubmit.entries()) {
      console.log(key, value);
    }

    try {
      const response = await api.createListing(formDataToSubmit);

      console.log(response);

      if (response.status === "SUCCESS") {
        setLoading(false);
        setError(false);
        setSuccess(true);
        
        // Reset form after successful submission
        setFormData({
          type: 'house',
          description: '',
          price: '',
          bedrooms: '',
          bathrooms: '', // Changed from washrooms
        });

        setStreet('');
        setCity('');
        setCountry('India'); // Reset to default
        setImages([]);
        setTimeout(() => navigate("/hostdashboard"), 2000);
      } else {
        setLoading(false);
        setError(true);
        setSuccess(false);
      }
    } catch (err) {
      console.error('Error creating listing:', err);
      setLoading(false);
      setError(true);
      setSuccess(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 flex items-center justify-center gap-3">
            <span className="text-rose-500">Create</span>
            <span>A New Listing</span>
            <Home className="text-rose-500" size={48} strokeWidth={2.5} />
          </h1>
          <p className="text-gray-600 mt-4 text-lg">Fill in the details to list your property</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Property Details Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <div className="w-2 h-8 bg-rose-500 rounded-full"></div>
              Property Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="type" className="block text-lg font-medium text-gray-700">
                  Property Type
                </label>
                <select
                  name="type"
                  id="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 bg-white outline-0"
                  required
                >
                  <option value="house">House</option>
                  <option value="condo">Condo</option>
                  <option value="apartment">Apartment</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="flat">Flat</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="price" className="block text-lg font-medium text-gray-700">
                  Price Per Night (₹)
                </label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter price per night"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 outline-0"
                  required
                />
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <label htmlFor="description" className="block text-lg font-medium text-gray-700">
                Property Description
              </label>
              <textarea
                name="description"
                id="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your property in detail..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 resize-none text-lg outline-0"
                required
              />
            </div>
          </div>

          {/* Address Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
              Address
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label htmlFor="country" className="block text-lg font-medium text-gray-700">
                  Country
                </label>
                <select
                  name="country"
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white outline-0"
                  required
                >
                  <option value="India">India</option>
                  <option value="USA">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="UK">United Kingdom</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="city" className="block text-lg font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter your city"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-0"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="street" className="block text-lg font-medium text-gray-700">
                  Street Address
                </label>
                <input
                  type="text"
                  name="street"
                  id="street"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Building no. with street name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-0"
                  required
                />
              </div>
            </div>
          </div>

          {/* Room Details Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <div className="w-2 h-8 bg-green-500 rounded-full"></div>
              Room Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="bedrooms" className="block text-lg font-medium text-gray-700">
                  Number of Bedrooms
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  id="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  placeholder="Number of bedrooms"
                  min="1"
                  max="10"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 outline-0"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="bathrooms" className="block text-lg font-medium text-gray-700">
                  Number of Bathrooms
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  id="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  placeholder="Number of bathrooms"
                  min="1"
                  max="10"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 outline-0"
                  required
                />
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <div className="w-2 h-8 bg-purple-500 rounded-full"></div>
              Property Images
              <span className="text-lg text-gray-500 font-normal">(Minimum 2 images required)</span>
            </h2>

            {/* Upload Area */}
            <div className="mb-6">
              <label htmlFor="images" className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-rose-500 hover:bg-rose-50 transition-all duration-200">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">Click to upload images</p>
                  <p className="text-lg text-gray-500">PNG, JPG, JPEG up to 10MB each</p>
                </div>
              </label>
              <input
                type="file"
                name="images"
                id="images"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Image Preview Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image) => (
                  <div key={image.id} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                    <p className="text-xs text-gray-500 mt-1 truncate">{image.name}</p>
                  </div>
                ))}
              </div>
            )}

            {images.length < 2 && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-lg text-amber-700">
                  <Camera className="inline-block w-4 h-4 mr-1" />
                  Please upload at least 2 images to create your listing.
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold py-4 px-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-rose-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Creating Listing...' : 'Create Listing'}
            </button>
          </div>
          
          {/* Status Messages */}
          {loading && (
            <div className="text-center text-2xl font-semibold text-rose-500">
              <div>Creating a listing...</div>
            </div>
          )}
          
          {success && (
            <div className="text-center text-2xl font-semibold text-green-600">
              <div className="flex items-center justify-center gap-2">
                <span>Listing created successfully</span>
                <CheckCircle size={24} className="text-green-600" strokeWidth={3} />
              </div>
            </div>
          )}
          
          {error && (
            <div className="text-center text-2xl font-semibold text-red-600">
              <div className="flex items-center justify-center gap-2">
                <span>Listing creation failed</span>
                <X size={24} className="text-red-600" strokeWidth={3}/>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}