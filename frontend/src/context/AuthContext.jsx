// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getUserProfile } from '../api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const { data } = await getUserProfile();
          setUser(data);
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};