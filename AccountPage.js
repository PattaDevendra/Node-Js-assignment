import React from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const AccountPage = ({ user }) => {
  const history = useHistory();

  const deleteAccount = async () => {
    try {
      const response = await axios.delete('http://localhost:5000/api/delete-account', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (response.data.success) {
        history.push('/login');
      }
    } catch (err) {
      alert('Error deleting account');
    }
  };

  return (
    <div>
      <h2>Welcome, {user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Company: {user.companyName}</p>
      <p>Age: {user.age}</p>
      <p>DOB: {user.dob}</p>
      <button onClick={deleteAccount}>Remove Account</button>
    </div>
  );
};

export default AccountPage;
