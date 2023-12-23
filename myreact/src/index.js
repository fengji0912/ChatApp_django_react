// src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App/App';
import { UserProvider} from './App/Authentication/UserContext';

ReactDOM.render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
