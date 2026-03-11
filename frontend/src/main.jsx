import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
          <App />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#1f2937',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              },
            }}
          />
          {/* <Toaster 
  position="top-right"
  toastOptions={{
    duration: 3000,
    success: {
      style: {
        background: '#10b981',
        color: '#fff',
        fontWeight: 'bold',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#10b981',
      },
    },
    error: {
      style: {
        background: '#ef4444',
        color: '#fff',
        fontWeight: 'bold',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#ef4444',
      },
    },
    loading: {
      style: {
        background: '#00a8e8',
        color: '#fff',
        fontWeight: 'bold',
      },
    },
  }}
/> */}
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);