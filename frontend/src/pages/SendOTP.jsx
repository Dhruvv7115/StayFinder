import { useEmailContext } from '../context/EmailContext'
import { House } from 'lucide-react';
import { api } from '../Api/api';
import { useNavigate } from 'react-router-dom';

function SendOTP() {
  const { email } = useEmailContext();
  const navigate = useNavigate();

  const handleSendOTP = async() => {
    try {
      const data = await api.sendOTP(email);
      if(data === 200) {
        navigate("/verify-otp");}
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-6 bg-gray-100 rounded-lg">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl flex items-center font-bold mb-4 text-rose-500 ">
          <House className="inline-block mr-2" size={30} strokeWidth={3} />
          <span>StayFinder</span>
        </h1>
        <div className="p-8 flex flex-col items-center gap-6 bg-white rounded-lg">
          <h1 className="text-2xl font-semibold">Verify your email</h1>
          <input 
          type="text" 
          placeholder={email}
          defaultValue={email} 
          readOnly
          className="min-w-sm text-center p-2 border border-gray-300 rounded-md"
          />
          <button 
          onClick={handleSendOTP}
          className="bg-rose-500 text-white py-2 px-4 rounded-md hover:bg-rose-600 cursor-pointer transition-colors font-semibold focus:ring-red-700 focus:ring-4">Send OTP</button>
        </div>
      </div>
    </div>
  )
}

export default SendOTP