import React, { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { users } from '@/data';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage('user', null);
  const navigate = useNavigate();

  const login = (userId) => {
    const userToLogin = users.find(u => u.id === userId);
    if (userToLogin) {
      setUser(userToLogin);
      if (userToLogin.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/employee');
      }
    }
  };
   
  const logout = () => {
    setUser(null);
    navigate('/login', { replace: true });
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}