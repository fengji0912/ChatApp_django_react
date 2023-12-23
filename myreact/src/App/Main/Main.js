import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ChatList from './ChatList';
import ContactList from './ContactList';
import UserProfile from './UserProfile';
import withAuthentication from '../Authentication/withAuthentication';

const AuthenticatedChatList = withAuthentication(ChatList);
const AuthenticatedContactList = withAuthentication(ContactList);
const AuthenticatedUserProfile = withAuthentication(UserProfile);

const Main = () => {
  return (
    <div className="main-container">
      <div className="content-container">
        <Routes>
          <Route path="/chatlist" element={<AuthenticatedChatList />} />
          <Route path="/contactlist" element={<AuthenticatedContactList />} />
          <Route path="/" element={<AuthenticatedUserProfile />} />
        </Routes>
      </div>
    </div>
  );
};

export default Main;
