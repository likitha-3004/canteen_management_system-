import React from 'react';
import { useNavigate } from 'react-router-dom';

function Cart({ cart, user, onRemove, apiUrl, showMessage }) {
  const navigate = useNavigate();

  const totalAmount = cart.reduce((total, item) => {
    return total + Number(item.price) * item.quantity;
  }, 0);

  const handleProceedToPayment = () => {
    if (cart.length === 0) {
      showMessage('Your cart is empty', true);
      return;
    }
    navigate('/payment');
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl sticky top-8">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      
      {cart.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">Your cart is empty.</p>
          <p className="text-sm text-gray-500 mt-2">Add items from the menu to get started!</p>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
            {cart.map((item) => (
              <div
                key={item.item_id}
                className="flex justify-between items-center p-3 bg-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-white">{item.item_name}</p>
                  <p className="text-sm text-gray-400">
                    ₹{Number(item.price).toFixed(2)} × {item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-green-400">
                    ₹{(Number(item.price) * item.quantity).toFixed(2)}
                  </span>
                  <button
                    onClick={() => onRemove(item.item_id)}
                    className="text-red-400 hover:text-red-300 text-xl font-bold w-8 h-8 flex items-center justify-center rounded hover:bg-red-500/10 transition-colors"
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <hr className="border-gray-600 my-4" />
          
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-2xl font-bold text-green-400">₹{totalAmount.toFixed(2)}</span>
          </div>
          
          <button
            onClick={handleProceedToPayment}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={cart.length === 0}
          >
            Proceed to Payment
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;