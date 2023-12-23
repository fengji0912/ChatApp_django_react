// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Authentication/Login';
import Register from './Authentication/Register';
import Sidebar from './Main/Sidebar';
import Main from './Main/Main';
import { useUser } from './Authentication/UserContext';

const App = () => {
  const { user } = useUser();

  return (
    <Router>
      <Routes>
        <Route path="*" element={(user && user.token) ? <Main /> : <Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      {user && user.token && <Sidebar />}
    </Router>
  );
};

export default App;
