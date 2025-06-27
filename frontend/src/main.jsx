import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { EmailContextProvider } from './context/EmailContext.jsx';
import { UserContextProvider } from './context/UserContext.jsx';
import { FavouriteContextProvider } from './context/FavouriteContext.jsx';
import ListingsPage from './pages/ListingsPage.jsx'
import HostSignUp from './pages/HostSignUp.jsx'
import UserSignUp from './pages/UserSignUp.jsx';
import HomePage from './pages/HomePage.jsx'
import VerifyOTP from './pages/VerifyOTP.jsx'
import SendOTP from './pages/SendOTP.jsx'
import Login from './pages/Login.jsx'
import Favourites from './pages/Favourites.jsx';
import ListingDetail from "./pages/ListingDetail.jsx";
import HostDashboard from './pages/HostDashboard.jsx';
import CreateListing from './pages/CreateListing.jsx';
import UpdateListing from "./pages/UpdateListing.jsx"
import About from './pages/About.jsx';
import Bookings from './pages/Bookings.jsx';
import Profile from './pages/Profile.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<HomePage />} />
      <Route path="/listings" element={<ListingsPage />} />
      <Route path="/send-otp" element={<SendOTP />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/host-signup" element={<HostSignUp />} />
      <Route path="/user-signup" element={<UserSignUp />} />
      <Route path="/favourites" element={<Favourites />} />
      <Route path="/login" element={<Login/>} />
      <Route path="/listing/:listingId" element={<ListingDetail />} />
      <Route path="/hostdashboard" element={<HostDashboard />} />
      <Route path="/create-listing" element={<CreateListing />} />
      <Route path="/update-listing/:listingId" element={<UpdateListing />} />
      <Route path="/about" element={<About />} />
      <Route path="/bookings" element={<Bookings />} />
      <Route path="/profile" element={<Profile />} />
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserContextProvider>
      <FavouriteContextProvider>
        <EmailContextProvider>
          <RouterProvider router={router} />
        </EmailContextProvider>
      </FavouriteContextProvider>
    </UserContextProvider>
  </StrictMode>,
)
