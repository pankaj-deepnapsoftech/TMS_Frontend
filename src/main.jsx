import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';
// import { AuthProvider } from '@/context/AuthContext';
// import { NotificationProvider } from '@/context/NotificationContext';
import '@/index.css';
import { ToastContainer } from 'react-toastify';
import AuthContextProvider from './context/AuthContext2';
import TicketCreateProvider from './context/TicketCreateContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastContainer />   
        <AuthContextProvider>
      <TicketCreateProvider>
          {/* <NotificationProvider> */}
          <App />
          {/* </NotificationProvider> */}
      </TicketCreateProvider>
        </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);