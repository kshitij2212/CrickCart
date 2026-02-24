import { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  console.log('🔄 AuthContext initializing...');
  
  const token = localStorage.getItem('token');
  const savedUser = localStorage.getItem('user');
  
  console.log('🔄 Token from storage:', token);
  console.log('🔄 User from storage:', savedUser);

  if (token && savedUser) {
    const parsedUser = JSON.parse(savedUser);
    console.log('✅ Setting user:', parsedUser);
    setUser(parsedUser);
  } else {
    console.log('❌ No token or user found');
  }
  
  setLoading(false);
  console.log('✅ Loading complete');
}, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/users/login', { email, password });
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      
      toast.success('Login successful!');
      return data.user;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };
  

  const register = async (userData) => {
    try {
      console.log('📤 Sending register request:', userData);
      
      const { data } = await api.post('/users/register', userData);
      
      console.log('📥 Register response:', data);
      console.log('📥 Token:', data.token);
      console.log('📥 User:', data.user);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      console.log('💾 Saved to localStorage');
      console.log('💾 Token:', localStorage.getItem('token'));
      console.log('💾 User:', localStorage.getItem('user'));
      
      setUser(data.user);
      console.log('✅ User state updated:', data.user);
      
      toast.success('Registration successful!');
      return data.user;
    } catch (error) {
      console.error('❌ Register error:', error);
      console.error('❌ Response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };
  

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  // AuthContext.jsx - value object ke baad, return se pehle
console.log('🔐 AuthContext Current State:');
console.log('  - user:', user);
console.log('  - loading:', loading);
console.log('  - isAuthenticated:', !!user);

return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};