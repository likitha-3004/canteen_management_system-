import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Menu({ onAddToCart, apiUrl }) {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiUrl}/api/menu`);
        setMenuItems(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch menu. Is the API running?');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [apiUrl]);

  const handleQuantityChange = (itemId, value) => {
    const quantity = parseInt(value, 10);
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: quantity > 0 ? quantity : 1,
    }));
  };

  const handleAddClick = (item) => {
    const quantity = quantities[item.item_id] || 1;
    if (quantity > item.stock_qty) {
      alert(`Cannot add more than ${item.stock_qty} items`);
      return;
    }
    onAddToCart(item, quantity);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Loading menu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Canteen Menu</h2>
      
      {menuItems.length === 0 ? (
        <p className="text-gray-400">Menu is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <div
              key={item.item_id}
              className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow"
            >
              <div className="h-40 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                <span className="text-4xl">🍽️</span>
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold mb-1 text-white">{item.item_name}</h3>
                <p className="text-sm text-gray-400 mb-2 capitalize">{item.category}</p>
                <div className="flex-grow"></div>
                <div className="flex justify-between items-center mt-4 mb-4">
                  <span className="text-xl font-bold text-green-400">₹{Number(item.price).toFixed(2)}</span>
                  <span
                    className={`text-sm px-2 py-1 rounded ${
                      item.stock_qty > 10
                        ? 'text-green-400 bg-green-400/20'
                        : item.stock_qty > 5
                        ? 'text-yellow-400 bg-yellow-400/20'
                        : 'text-red-400 bg-red-400/20'
                    }`}
                  >
                    {item.stock_qty} in stock
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    max={item.stock_qty}
                    value={quantities[item.item_id] || 1}
                    onChange={(e) => handleQuantityChange(item.item_id, e.target.value)}
                    className="w-20 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => handleAddClick(item)}
                    disabled={item.stock_qty === 0}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Menu;