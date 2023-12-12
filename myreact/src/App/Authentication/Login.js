import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate instead of useHistory
import { useUser } from './UserContext';

const apiUrl = 'http://127.0.0.1:8180/api/';

const Login = () => {
  const navigate = useNavigate(); // React Router's useNavigate hook
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    const { login } = useUser();
    try {
      const response = await fetch(`${apiUrl}login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Login successful
        console.log('User logged in successfully');
        login({username: formData.username, password: formData.password});
        navigate('/userprofile'); // Redirect to the main page using useNavigate
      } else {
        // Login failed
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <label htmlFor="username">username:</label>
      <input
        type="username"
        id="username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        required
      />
      <label htmlFor="password">Password:</label>
      <input
        type="password"
        id="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <button type="button" onClick={handleLogin}>
        Login
      </button>
      <p>
        Not registered? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default Login;
