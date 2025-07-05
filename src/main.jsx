import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';
import '@/index.css';
import { ToastContainer } from 'react-toastify';
import AuthContextProvider from './context/AuthContext2';
import TicketCreateProvider from './context/TicketCreateContext';
import { ProfileProvider } from './context/UserProfileUpdateContext';
import NotificationProvider from './context/NotificationContext';



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastContainer />
      <AuthContextProvider>
        <ProfileProvider>
            <TicketCreateProvider>
          <NotificationProvider>
              <App />
          </NotificationProvider>
            </TicketCreateProvider>
        </ProfileProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);