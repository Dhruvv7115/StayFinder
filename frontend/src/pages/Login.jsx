import { ArrowLeft, House, Camera } from "lucide-react"
import { api } from "../Api/api";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
function Login() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUserContext();

  const handleLogin = async() => {
    const response = await api.login({ email, password });
    console.log(response)
    if(response.status === 200){
      const data = await response.json();
      console.log(data);
      setUser(data.user);
      navigate("/");
    }
  }
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center flex-col p-4 gap-6">
      <div className="text-rose-500 relative w-full">
        <ArrowLeft className="inline-block mr-4 cursor-pointer absolute top-0 left-3/12" size={36} onClick={() => window.history.back()}/>
        <h1 className="text-3xl font-bold text-center w-full flex items-center justify-center">
          <House className="inline-block mr-2" size={30} strokeWidth={3} />
          <span>StayFinder</span>
        </h1>
      </div>
      <div className="w-100 bg-white p-8 rounded-lg shadow-md flex flex-col items-center gap-8 border border-gray-200">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">
            Login To Your Account
          </h1>
          <p className="text-sm">
            Sign up as a host to list your property and start earning money.
          </p>
        </div>
        <div className="flex flex-col gap-2 w-full">  
          <label className="block text-sm font-medium text-gray-800">
            Email
          </label>
          <input 
          type="email"
          value={email} 
          className="mt-1 p-2 text-sm border border-gray-300 rounded-md w-full" 
          required 
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          />
          <label className="block text-sm font-medium text-gray-800">
            Password
          </label>
          <input 
          type="password"
          value={password} 
          className="mt-1 p-2 text-sm border border-gray-300 rounded-md w-full" placeholder="Enter your password"
          required
          onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex flex-col items-center w-full gap-2">
          <button 
          className="bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 px-4 rounded-md w-full cursor-pointer focus:ring-4 focus:ring-rose-500 outline-0"
          type="submit"
          onClick={handleLogin}
          >
            Sign Up
          </button>
          <p 
          id="message"
          className="text-sm text-red-500 mt-2 hidden"
          ></p>
          <p>
            Don't have an account? 
            <Link 
            to="/user-signup" className="text-rose-500 hover:underline">Signup</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login