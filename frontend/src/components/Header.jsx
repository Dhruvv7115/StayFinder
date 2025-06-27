import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { House, Menu, User } from "lucide-react"
import { useUserContext } from "../context/UserContext";
import SearchBar from "./SearchBar"
import { api } from "../Api/api";

function Header({ setQuery }) {
  const [showMenu, setShowMenu] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  const { user, setUser } = useUserContext(); 

  const getCurrentUser = async() => {
    try {
      setLoading(true)
      const userData = await api.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error("Failed to get current user:", error);
    } finally {
      setLoading(false)
    }
  }

  // Fix: Remove user dependency to prevent infinite loop
  useEffect(() => {
    getCurrentUser()
  }, []) // Only run on component mount

  const handleLogout = async () => {
    try {
      const data = await api.logout();
      console.log(data)
      if (data.status === "SUCCESS") {
        localStorage.removeItem("favourites");
        setUser(null);
        navigate("/");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center h-16 py-4">
          <div 
            className="text-rose-500 text-3xl font-bold flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <House strokeWidth={3} size={32} />
            <span>StayFinder</span>
          </div>
          
          <SearchBar setQuery={setQuery}/>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/host-signup')}
              className="text-sm font-medium cursor-pointer text-gray-600 hover:text-gray-950 hidden lg:block"
            >
              Become a Host
            </button>
            
            <div 
              className="relative" 
              onMouseEnter={() => setShowMenu(true)}
              onMouseLeave={() => setShowMenu(false)}
            >
              <button
                className="flex items-center space-x-2 border border-gray-300 rounded-full p-2 hover:shadow-md transition-shadow"
                disabled={loading}
              >
                <Menu size={28} className="text-gray-400 hidden md:block" />
                {user?.avatar ? (
                  <img src={user.avatar} alt="User avatar" className="w-10 h-10 rounded-full"/>
                ) : (
                  <User size={20} className="text-gray-600" />
                )}
              </button>
              
              {showMenu && (
                <div className="absolute right-0 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  {user ? (
                    <>
                      <button 
                        onClick={() => { navigate('profile'); setShowMenu(false); }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </button>
                      {user.type === "user" && <button 
                        onClick={() => { navigate('bookings'); setShowMenu(false); }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Your Bookings
                      </button>}
                      <button 
                        onClick={() => { navigate('favourites'); setShowMenu(false); }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Favourites
                      </button>
                      {user.type === "host" && (
                        <button 
                          onClick={() => { navigate("hostdashboard"); setShowMenu(false); }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Host Dashboard
                        </button>
                      )}
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => { navigate("login"); setShowMenu(false); }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Login
                      </button>
                      <button 
                        onClick={() => { navigate("user-signup"); setShowMenu(false); }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign up
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header