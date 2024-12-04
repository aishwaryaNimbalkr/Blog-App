import React, { useState } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:4000/api/user/login', {
        userEmail,
        userPassword,
      });

      // Assuming the backend response includes the token and user info
      const { token, user } = response.data;

      // Store token and user info in localStorage or state for subsequent requests
      localStorage.setItem('token', token);
      setUser(user);
      setLoading(false);

      // Redirect user or show success message, depending on the requirement
      // Redirect based on user role (admin or user)
      if (user.isAdmin) {
        navigate(`/adminDashboard`); // Redirect to Admin Dashboard
      } else {
        navigate(`/userDashboard/${user._id}`); // Redirect to User Dashboard

      }
    } catch (error) {
      setLoading(false);
      if (error.response) {
        // Error from the backend
        setError(error.response.data.message);
      } else {
        // Network error
        setError('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="login-form-container text-center m-5"><br /><br />
      <h2 className='fw-bold m-5'>Login</h2>
      <div className='border border-4 border-dark shadow-2 rounded w-25 mx-auto p-3' style={{ backgroundColor: "aliceblue" }} >
        <form onSubmit={handleSubmit}>
          <div className='m-3 fw-bold '>
            <label htmlFor="userEmail">Email</label>
            <input className='border border-2 border-secondary px-3 py-1 m-3'
              type="email"
              id="userEmail"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
            />
          </div>
          <div className='m-2 fw-bold '>
            <label htmlFor="userPassword">Password</label>
            <input className='border border-2 border-secondary px-3 py-1 m-3'
              type="password"
              id="userPassword"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <Button variant="dark" type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </div>
          {error && <p className="error-message">{error}</p>}
        </form></div>
      {user && (
        <div className="user-info">
          <p>Welcome, {user.name}!</p>
        </div>
      )}<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
    </div>
  );
};

export default Login;

