import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';

import React, { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import AuthProvider from './provider/AuthProvider';
import NotificationProvider from './provider/NotificationProvider';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </AuthProvider>
  </StrictMode>
);
