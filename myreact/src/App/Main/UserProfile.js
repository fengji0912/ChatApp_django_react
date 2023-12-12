// UserProfile.js
import React, { useEffect, useState } from 'react';

const apiUrl = 'http://127.0.0.1:8180/api/';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${apiUrl}UserProfile/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data); // Assuming the response contains user profile data
        } else {
          console.error('Error fetching user profile:', response.status);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []); // Empty dependency array ensures the effect runs once when the component mounts

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="user-profile">
      {userData ? (
        <>
          <h2>{userData.username}</h2>
          <p>Email: {userData.email}</p>
          <p>
            Password: {showPassword ? userData.password : '********'}
            <button onClick={handleTogglePassword}>
              {showPassword ? 'Hide' : 'Show'} Password
            </button>
          </p>
        </>
      ) : (
        <p>Loading user profile...</p>
      )}
    </div>
  );
};

export default UserProfile;
