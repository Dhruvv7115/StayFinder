import { useEmailContext } from '../context/EmailContext'
import { House, MailCheck, MailX } from 'lucide-react';
import { api } from '../Api/api';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function SendOTP() {
  const { email } = useEmailContext();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleSendOTP = async() => {
    try {
      const data = await api.sendOTP(email);
      if(data === 200) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/verify-otp");
        }, 3000)
      }
    } catch (error) {
      setError(true);
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
          {success && (
            <div className="text-lg bg-green-900 opacity-10 px-2 py-1 rounded text-green-500">
              <MailCheck className="inline-block ml-2" />
              <span>A 6 digit otp sent to {email} successfully</span>
            </div>
          )}
          {error && (
            <div className="text-lg bg-red-900 opacity-10 px-2 py-1 rounded text-red-500">
              <MailX className="inline-block ml-2" stroke="currentColor"/>
              <span className="inline-block">An Error occured while sending {email} 
                <span className="inline-block">resendOTP</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SendOTP