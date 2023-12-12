import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Link to="/main/chatlist">Chat List</Link>
      <Link to="/main/contactlist">Contact List</Link>
      <Link to="/main/userprofile">User Profile</Link>
    </div>
  );
}

export default Sidebar;
