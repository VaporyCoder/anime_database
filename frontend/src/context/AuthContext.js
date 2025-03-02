import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    user: null,
    loading: true // Add loading state for initial check
  });

  // Verify token and load user data on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setAuthState(prev => ({ ...prev, loading: false }));
          return;
        }
  
        // Verify token with backend
        const response = await axios.get("http://localhost:3000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
  
        setAuthState({
          isLoggedIn: true,
          user: response.data.data,
          loading: false
        });
      } catch (error) {
        console.error("Auth check error:", error);
        logout();
      }
    };
  
    checkAuth();
  }, []);

  const login = async (token) => {
    try {
      // Fetch full profile after login
      const response = await axios.get("http://localhost:3000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      localStorage.setItem("token", token);
      setAuthState({
        isLoggedIn: true,
        user: response.data.data,
        loading: false
      });
    } catch (error) {
      logout();
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthState({
      isLoggedIn: false,
      user: null,
      loading: false
    });
  };

  const updateUser = (updatedUser) => {
    setAuthState(prev => ({
      ...prev,
      user: { ...prev.user, ...updatedUser }
    }));
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext }; // Add AuthContext export
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};