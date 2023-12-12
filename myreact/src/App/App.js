// src/components/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './Authentication/Register';
import Login from './Authentication/Login';
import Main from './Main/Main';
import './styles/App.css';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Login />} />
          <Route path="/userprofile" element={<Main />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
