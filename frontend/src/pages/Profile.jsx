import { useState, useEffect } from 'react';
import { Camera, User, Mail, Lock, Edit3, Save, X, House } from 'lucide-react';
import { api } from '../Api/api';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({});
  
  const [editData, setEditData] = useState({ ...profileData });
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchUserDetails = async () => {
    try {
      const data = await api.getCurrentUser();
      setProfileData(data);
      console.log(data)
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  }
  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...profileData });
  };

  const handleSave = async() => {
    try {
      // Update name if changed
      if (profileData.name !== editData.name) {
        console.log("Updating name");
        const nameResponse = await api.updateName(editData.name);
        if (nameResponse.status === "FAILED") {
          console.log("Error updating name");
          return;
        }
      }

      // Update password if changed
      if (profileData.password !== editData.password && editData.password) {
        console.log("Updating password");
        const passwordResponse = await api.updatePassword(editData.password);
        if (passwordResponse.status === "FAILED") {
          console.log("Error updating password");
          return;
        }
      }

      // Update avatar if a new file was selected
      if (selectedFile) {
        console.log("Updating avatar with file:", selectedFile.name, selectedFile.type, selectedFile.size);
        const formData = new FormData();
        formData.append('avatar', selectedFile);
        
        // Debug: Log FormData contents
        for (let pair of formData.entries()) {
          console.log('FormData:', pair[0], pair[1]);
        }
        
        const avatarResponse = await api.updateAvatar(formData);
        console.log("Avatar response:", avatarResponse);
        
        if (avatarResponse.status === "FAILED") {
          console.error("Error updating avatar:", avatarResponse.message);
          alert(`Error updating avatar: ${avatarResponse.message}`);
          return;
        }
        // Update the avatar URL from the response
        if (avatarResponse.user && avatarResponse.user.avatar) {
          editData.avatar = avatarResponse.user.avatar;
        }
      }

      setProfileData({ ...editData });
      setIsEditing(false);
      setSelectedFile(null);
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleCancel = () => {
    setEditData({ ...profileData });
    setSelectedFile(null);
    setIsEditing(false);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Store the actual file for upload
      setSelectedFile(file);
      
      // Create preview URL for display
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditData({ ...editData, avatar: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  <House strokeWidth={3}/>
                </span>
              </div>
              <span className="text-3xl font-bold text-rose-500">StayFinder</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-8 py-12 text-white relative">
            <div className="absolute top-6 right-6">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors backdrop-blur-sm"
                >
                  <Edit3 size={18} />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors backdrop-blur-sm"
                  >
                    <Save size={18} />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors backdrop-blur-sm"
                  >
                    <X size={18} />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center overflow-hidden backdrop-blur-sm">
                  {(isEditing ? editData.avatar : profileData.avatar) ? (
                    <img
                      src={isEditing ? editData.avatar : profileData.avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={40} className="text-white" />
                  )}
                </div>
                {isEditing && (
                  <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-rose-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-rose-700 transition-colors">
                    <Camera size={16} className="text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              
              {/* Name */}
              <div>
                <h1 className="text-3xl font-bold">
                  {isEditing ? editData.name : profileData.name}
                </h1>
                <p className="text-white/80 mt-1">StayFinder Member</p>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="p-8">
            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={isEditing ? editData.name : profileData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all ${
                      isEditing 
                        ? 'border-gray-300 bg-white' 
                        : 'border-gray-200 bg-gray-50 text-gray-600'
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Non-editable</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Your email address cannot be changed for security reasons.</p>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    value={isEditing ? editData.password : profileData.password}
                    onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all ${
                      isEditing 
                        ? 'border-gray-300 bg-white' 
                        : 'border-gray-200 bg-gray-50 text-gray-600'
                    }`}
                    placeholder="Enter your password"
                  />
                </div>
                {isEditing && (
                  <p className="text-xs text-gray-500 mt-1">Leave blank to keep current password unchanged.</p>
                )}
              </div>
            </div>

            {/* Additional Info Section */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <span className="text-gray-600">Member since</span>
                  <p className="font-medium text-gray-900">January 2024</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <span className="text-gray-600">Account status</span>
                  <p className="font-medium text-green-600">Verified</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default Profile;