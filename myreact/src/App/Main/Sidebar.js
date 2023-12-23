import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Link to="/chatlist">Chat List</Link>
      <Link to="/contactlist">Contact List</Link>
      <Link to="/">User Profile</Link>
    </div>
  );
}

export default Sidebar;
