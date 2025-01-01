# Node-Js-assignment
import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const LoginPage = () => {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [error,setError] = useState('');
  const history = useHistory();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });
      if (response.data.success) {
        history.push('/verify-otp');
      } else {
        setError('Invalid credentials, please try again');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
      <button onClick={() => history.push('/register')}>Create Account</button>
    </div>
  );
};

export default LoginPage;
