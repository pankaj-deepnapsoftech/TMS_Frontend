import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext2';
import { socket } from '@/socket';
// import { useAuth } from '@/context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  // const { user, isAuthenticated } = useAuth();
  const {user ,token} = useAuthContext()
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  socket.on("connect",()=>{
    console.log("socket connected successful")
  })

  return children;
};

export default ProtectedRoute;