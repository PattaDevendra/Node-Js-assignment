import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/verify-otp', { otp });
      if (response.data.success) {
        history.push('/account');
      } else {
        alert('Invalid OTP');
      }
    } catch (err) {
      alert('Error occurred during OTP verification');
    }
  };

  return (
    <div>
      <h2>Verify OTP</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Enter OTP" 
          value={otp} 
          onChange={(e) => setOtp(e.target.value)} 
          required
        />
        <button type="submit">Verify</button>
      </form>
    </div>
  );
};

export default VerifyOtpPage;
