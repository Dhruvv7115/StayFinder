import { useState, useRef } from 'react';
import { House } from 'lucide-react';
import { api } from '../Api/api';
import { useEmailContext } from '../context/EmailContext';
import { useNavigate } from 'react-router-dom';
function VerifyOTP() {
  const { email } = useEmailContext();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const handleChange = (index, value) => {
    if (/^[0-9]$/.test(value) || value === '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value !== '' && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  }
  
  const handleKeyDown = (index, e) => {
    if(e.key === 'Backspace'){
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      inputRefs.current[index - 1]?.focus();
    }else if(e.key === 'Enter'){
      handleVerify();
    }else if(e.key === 'ArrowLeft' && index > 0){
      inputRefs.current[index - 1]?.focus();
    }else if(e.key === 'ArrowRight' && index < 5){
      inputRefs.current[index + 1]?.focus();
    }
  }
  
  const handlePaste = (e) => {
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      inputRefs.current[5].focus();
    }
    e.preventDefault();
  }
  const handleVerify = async() => {
    console.log(email);
    const response = await api.verifyOTP({email, otp: otp.join('')});
    if(response.status === "SUCCESS"){
      navigate("/login");
    }
  };

  return (
    <div className="flex flex-col min-h-screen justify-center items-center gap-4 p-6 bg-gray-100 rounded-lg">
      <h1 className="text-3xl flex items-center font-bold mb-4 text-rose-500">
        <House className="inline-block mr-2" size={30} strokeWidth={3} />
        <span>StayFinder</span>
      </h1>
      <div className="flex flex-col items-center gap-4 bg-rose-100 p-4 rounded-lg">
        <h2 className="text-2xl font-semibold">Enter your OTP</h2>
        <div className="flex gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              ref={(el) => (inputRefs.current[index] = el)}
              className="w-12 h-12 text-center bg-amber-50 text-xl border-0 rounded-md  outline-none focus:border-rose-500 focus:border-3"
            />
          ))}
        </div>
        <button
          onClick={handleVerify}
          disabled={otp.join('').length !== 6}
          className="px-6 py-2 text-white cursor-pointer bg-rose-500 rounded-md hover:bg-rose-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Verify
        </button>
      </div>
    </div>
  )
}

export default VerifyOTP