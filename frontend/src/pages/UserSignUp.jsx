import { ArrowLeft, House, Camera } from "lucide-react";
import { api } from "../Api/api";
import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEmailContext } from "../context/EmailContext";

function UserSignUp() {
  const { email, setEmail } = useEmailContext();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleUserSignUp = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("type", "user");
    formData.append("avatar", avatar);

    const data = await api.register(formData);
    if (data.status === "FAILED") {
      document.querySelector("#message").classList.remove("hidden");
    }
    if (data.status === "SUCCESS") {
      navigate("/send-otp");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center flex-col p-4 gap-6">
      <div className="text-rose-500 relative w-full">
        <ArrowLeft
          className="inline-block mr-4 cursor-pointer absolute top-0 left-3/12"
          size={36}
          onClick={() => window.history.back()}
        />
        <h1 className="text-3xl font-bold text-center w-full flex items-center justify-center">
          <House className="inline-block mr-2" size={30} strokeWidth={3} />
          <span>StayFinder</span>
        </h1>
      </div>

      <div className="w-100 bg-white p-8 rounded-lg shadow-md flex flex-col items-center gap-8 border border-gray-200">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Create an Account</h1>
          <p className="text-sm">Sign up to explore, book stays, and more.</p>
        </div>

        <div className="relative flex items-center justify-center flex-col gap-2">
          <p className="text-sm font-medium text-gray-800">
            Upload a profile picture
          </p>
          {!avatar && (
            <Camera
              onClick={handleIconClick}
              className="absolute top-5/8 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            />
          )}
          {avatar && (
            <img
              src={URL.createObjectURL(avatar)}
              alt="avatar"
              onClick={handleIconClick}
              className="w-20 h-20 rounded-full absolute top-5/8 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            />
          )}
          <input
            type="file"
            name="avatar"
            accept="image/*"
            ref={fileInputRef}
            onChange={(e) =>
              setAvatar(e.target.files[e.target.files.length - 1])
            }
            className="text-transparent bg-gray-100 w-20 h-20 rounded-full"
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="block text-sm font-medium text-gray-800">
            Name
          </label>
          <input
            type="text"
            value={name}
            placeholder="Enter your name"
            className="mt-1 p-2 text-sm border border-gray-300 rounded-md w-full"
            onChange={(e) => setName(e.target.value)}
          />
          <label className="block text-sm font-medium text-gray-800">
            Email
          </label>
          <input
            type="email"
            value={email}
            placeholder="Enter your email"
            className="mt-1 p-2 text-sm border border-gray-300 rounded-md w-full"
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="block text-sm font-medium text-gray-800">
            Password
          </label>
          <input
            type="password"
            value={password}
            placeholder="Enter your password"
            className="mt-1 p-2 text-sm border border-gray-300 rounded-md w-full"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex flex-col items-center w-full">
          <button
            className="bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 px-4 rounded-md w-full cursor-pointer focus:ring-4 focus:ring-rose-500 outline-0"
            onClick={handleUserSignUp}
          >
            Sign Up
          </button>

          <Link
            className="block text-center mt-4 text-sm text-gray-600 hover:text-blue-700 underline"
            to="/send-otp"
          >
            Verify-otp
          </Link>

          <p id="message" className="text-sm text-red-500 mt-2 hidden"></p>
          <p>
            Want to become a host?{" "}
            <span
              onClick={() => navigate("/host-signup")}
              className="text-rose-500 hover:text-rose-600 underline cursor-pointer"
            >
              Sign up as Host
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserSignUp;