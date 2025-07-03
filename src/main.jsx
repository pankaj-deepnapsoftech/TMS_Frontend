import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';
// import { AuthProvider } from '@/context/AuthContext';
// import { NotificationProvider } from '@/context/NotificationContext';
import '@/index.css';
import { ToastContainer } from 'react-toastify';
import AuthContextProvider from './context/AuthContext2';
import { ProfileProvider } from './context/UserProfileUpdateContext';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastContainer />
      {/* <AuthProvider> */}
      <AuthContextProvider>
        <ProfileProvider>
          {/* <NotificationProvider> */}
          <App />
          {/* </NotificationProvider> */}
        </ProfileProvider>
      </AuthContextProvider>
      {/* </AuthProvider> */}
    </BrowserRouter>
  </React.StrictMode>
);