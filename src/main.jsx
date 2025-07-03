import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';
// import { AuthProvider } from '@/context/AuthContext';
// import { NotificationProvider } from '@/context/NotificationContext';
import '@/index.css';
import { ToastContainer } from 'react-toastify';
import AuthContextProvider from './context/AuthContext2';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastContainer />
      {/* <AuthProvider> */}
        <AuthContextProvider>
          {/* <NotificationProvider> */}
            <App />
          {/* </NotificationProvider> */}
        </AuthContextProvider>
      {/* </AuthProvider> */}
    </BrowserRouter>
  </React.StrictMode>
);