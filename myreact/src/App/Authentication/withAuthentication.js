import React from 'react';
import { useUser } from './UserContext';
import Login from './Login';

const withAuthentication = (Component) => {
  return (props) => {
    const { user } = useUser();

    // Check if the user is logged in
    if (!user) {
      return <Login />;
    }

    return <Component {...props} />;
  };
};

export default withAuthentication;
