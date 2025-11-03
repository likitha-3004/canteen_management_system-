import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Payment({ cart, user, onPlaceOrder, apiUrl, showMessage }) {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [loading, setLoading] = useState(false);

  const totalAmount = cart.reduce((total, item) => {
    return total + Number(item.price) * item.quantity;
  }, 0);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      showMessage('Your cart is empty', true);
      return;
    }

    setLoading(true);
    try {
      // Place order with selected payment method
      await onPlaceOrder(paymentMethod);
      // Navigate to orders page after successful payment
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } catch (error) {
      // Error is already handled by onPlaceOrder
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-center">
          <p className="text-gray-400 text-lg mb-4">Your cart is empty.</p>
          <Link
            to="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Go to Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Payment</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Form - Left Side */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
            <h3 className="text-xl font-semibold mb-6">Select Payment Method</h3>
            
            <form onSubmit={handlePayment}>
              <div className="space-y-4 mb-6">
                {/* UPI Option */}
                <label className="flex items-center p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="UPI"
                    checked={paymentMethod === 'UPI'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3 w-5 h-5 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="text-xl mr-3">📱</span>
                      <span className="font-medium">UPI</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">Pay using UPI apps like Google Pay, PhonePe, Paytm</p>
                  </div>
                </label>

                {/* Card Option */}
                <label className="flex items-center p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Card"
                    checked={paymentMethod === 'Card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3 w-5 h-5 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="text-xl mr-3">💳</span>
                      <span className="font-medium">Debit/Credit Card</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">Pay using your debit or credit card</p>
                  </div>
                </label>

                {/* Cash Option */}
                <label className="flex items-center p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash"
                    checked={paymentMethod === 'Cash'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3 w-5 h-5 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="text-xl mr-3">💵</span>
                      <span className="font-medium">Cash on Delivery</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">Pay in cash when you receive your order</p>
                  </div>
                </label>

                {/* Wallet Option */}
                <label className="flex items-center p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Wallet"
                    checked={paymentMethod === 'Wallet'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3 w-5 h-5 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="text-xl mr-3">💰</span>
                      <span className="font-medium">Digital Wallet</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">Pay using digital wallet</p>
                  </div>
                </label>
              </div>

              <div className="flex gap-4">
                <Link
                  to="/"
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors text-center"
                >
                  Back to Cart
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Complete Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Order Summary - Right Side */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl sticky top-8">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            
            <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
              {cart.map((item) => (
                <div
                  key={item.item_id}
                  className="flex justify-between items-start p-3 bg-gray-700 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-white text-sm">{item.item_name}</p>
                    <p className="text-xs text-gray-400">
                      ₹{Number(item.price).toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <span className="font-medium text-green-400 text-sm">
                    ₹{(Number(item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            
            <hr className="border-gray-600 my-4" />
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-gray-300">₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Tax</span>
                <span className="text-gray-300">₹0.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Delivery Charge</span>
                <span className="text-gray-300">₹0.00</span>
              </div>
            </div>
            
            <hr className="border-gray-600 my-4" />
            
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-2xl font-bold text-green-400">₹{totalAmount.toFixed(2)}</span>
            </div>

            <div className="mt-4 p-3 bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-400">
                Payment Method: <span className="text-white font-medium capitalize">{paymentMethod}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
