import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login';
import Register from './components/Register';
import Menu from './components/menu';
import Cart from './components/cart';
import Payment from './components/Payment';
import OrderHistory from './components/OrderHistory';
import Navigation from './components/Navigation';
import Admin from './components/Admin';
import './App.css';

const API_URL = 'http://localhost:5000';

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', isError: false });

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const showMessage = (text, isError = false) => {
    setMessage({ text, isError });
    setTimeout(() => setMessage({ text: '', isError: false }), 3000);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setCart([]);
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
    showMessage('Logged out successfully');
  };

  const handleAddToCart = (item, quantity) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.item_id === item.item_id);
    
    if (existingItem) {
        // Check stock
        if (existingItem.quantity + quantity > item.stock_qty) {
            showMessage(`Cannot add more. Max stock is ${item.stock_qty}.`, true);
          return prevCart;
        }
        return prevCart.map((cartItem) =>
          cartItem.item_id === item.item_id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
    } else {
        return [...prevCart, { ...item, quantity }];
    }
    });
    showMessage(`${quantity} x ${item.item_name} added to cart!`);
  };

  const handleRemoveFromCart = (itemId) => {
    setCart((prevCart) => {
      const removedItem = prevCart.find((item) => item.item_id === itemId);
      const newCart = prevCart.filter((item) => item.item_id !== itemId);
      if (removedItem) {
        showMessage(`${removedItem.item_name} removed from cart`, true);
      }
      return newCart;
    });
  };

  const handlePlaceOrder = async (paymentMethod = 'UPI') => {
    if (cart.length === 0) return;

    setLoading(true);
    try {
    const orderData = {
        user_id: user.user_id,
        totalAmount: cart.reduce((total, item) => total + (Number(item.price) * item.quantity), 0),
        paymentMethod: paymentMethod,
        cart: cart.map((item) => ({
            item_id: item.item_id,
          quantity: item.quantity,
        })),
    };
    
      const response = await fetch(`${API_URL}/api/order/place`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      showMessage(`Order #${data.order_id} placed successfully! Payment completed via ${paymentMethod}`);
      setCart([]);
      return data;
    } catch (error) {
      showMessage(error.message, true);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  // Admin Protected Route
  const AdminRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    if (user.role !== 'admin' && user.role !== 'staff') {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Message Box */}
      {message.text && (
        <div
          className={`fixed top-5 right-5 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${
            message.isError
              ? 'bg-red-500 text-white'
              : 'bg-green-500 text-white'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="loader"></div>
        </div>
      )}

      {/* Navigation */}
      {user && <Navigation user={user} onLogout={handleLogout} />}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <Routes>
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/" replace />
              ) : (
                <Login onLogin={handleLogin} apiUrl={API_URL} showMessage={showMessage} />
              )
            }
          />
          <Route
            path="/register"
            element={
              user ? (
                <Navigate to="/" replace />
              ) : (
                <Register onLogin={handleLogin} apiUrl={API_URL} showMessage={showMessage} />
              )
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <Menu onAddToCart={handleAddToCart} apiUrl={API_URL} />
                  </div>
                  <div className="lg:col-span-1">
                    <Cart
                      cart={cart}
                      user={user}
                      onRemove={handleRemoveFromCart}
                      apiUrl={API_URL}
                      showMessage={showMessage}
                    />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <Payment
                  cart={cart}
                  user={user}
                  onPlaceOrder={handlePlaceOrder}
                  apiUrl={API_URL}
                  showMessage={showMessage}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrderHistory userId={user?.user_id} apiUrl={API_URL} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin user={user} apiUrl={API_URL} showMessage={showMessage} />
              </AdminRoute>
            }
          />
          <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
