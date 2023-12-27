// UserProfile.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../Authentication/UserContext';

const apiUrl = 'http://127.0.0.1:8180/api/';

const UserProfile = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { logout } = useUser();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Check if user is logged in
        if (!(user && user.token)) {
          console.error('User is not logged in.');
          navigate('/')
        }
        console.log(user.token)
        const response = await fetch(`${apiUrl}userprofile/`, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${user.token}`,
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          console.error('Error fetching user profile:', response.status);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
  
    fetchUserProfile();
  }, [user]);

  const handleLogout = () => {
    // Clear user data and token, and navigate to the login page
    setUserData(null);
    logout(userData)
    navigate('/');
  };

  return (
    <div className="user-profile">
      <button onClick={handleLogout}>Logout</button>
      {userData ? (
        <>
          <h2>{userData.username}</h2>
          <p>Email: {userData.email}</p>
        </>
      ) : (
        <p>Loading user profile...</p>
      )}
    </div>
  );
};

export default UserProfile;
