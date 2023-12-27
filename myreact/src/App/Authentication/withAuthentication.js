import React from 'react';
import { useUser } from './UserContext';
import Login from './Login';

const withAuthentication = (Component) => {
  return (props) => {
    const { user } = useUser();

    if (!user) {
      return <Login />;
    }
    return <Component {...props} />;
  };
};

export default withAuthentication;
