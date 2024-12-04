import React, { useState } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';

const RegisterForm = () => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Send a POST request to register the user
      const response = await axios.post('http://localhost:4000/api/user/register', {
        userName,
        userEmail,
        userPassword,
        isAdmin,
      });
      console.log(response)
      // Handle successful registration
      setSuccess('User registered successfully!');
      setLoading(false);

      // Redirect or reset form
      window.location.href = '/login'; // Redirect to login page after successful registration
      setUserName('');
      setUserEmail('');
      setUserPassword('');
      setIsAdmin(false);
    } catch (error) {
      setLoading(false);
      if (error.response) {
        // Error from backend
        setError(error.response.data.message);
      } else {
        // Network or unexpected error
        setError('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="register-form-container text-center m-5"><br />
      <h2 className='fw-bold m-5'>Register</h2>
      <div className='border border-4 border-dark shadow-2 rounded w-25 mx-auto p-3' style={{ backgroundColor: "aliceblue" }} >
        <form onSubmit={handleSubmit}>
          <div className='m-3 fw-bold '>
            <label htmlFor="userName">Username:</label>
            <input className='border border-2 border-secondary px-3 py-1 m-3'
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div className='m-3 fw-bold '>
            <label htmlFor="userEmail">Email:</label>
            <input className='border border-2 border-secondary px-3 py-1 m-3'
              type="email"
              id="userEmail"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
            />
          </div>
          <div className='m-3 fw-bold '>
            <label htmlFor="userPassword">Password:</label>
            <input className='border border-2 border-secondary px-3 py-1 m-3'
              type="password"
              id="userPassword"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              required
            />
          </div>

          <div className='m-3 fw-bold '>
            <Button variant='dark' type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </div>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
        </form></div><br /><br /><br /><br /><br /><br /><br />
    </div>
  );
};

export default RegisterForm;
