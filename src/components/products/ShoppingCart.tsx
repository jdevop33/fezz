import React, { useState } from 'react';
import { useCart } from '../../lib/hooks';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ isOpen, onClose }) => {
  const { items, removeItem, updateQuantity, clearCart, subtotal, itemCount } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const handleCheckout = () => {
    if (!currentUser) {
      // If user is not logged in, redirect to login page
      onClose();
      navigate('/login', { state: { redirectTo: '/checkout' } });
    } else {
      // If user is logged in, proceed to checkout
      onClose();
      navigate('/checkout');
    }
  };
  
  // If the cart is not open, render nothing
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Cart panel */}
      <div className="absolute inset-y-0 right-0 w-full max-w-md bg-white dark:bg-gray-800 shadow-xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold">Shopping Cart ({itemCount})</h2>
          <button 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={onClose}
            aria-label="Close cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Cart items */}
        <div className="flex-grow overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">Your cart is empty</p>
              <button 
                className="mt-4 text-blue-600 hover:underline"
                onClick={() => {
                  onClose();
                  navigate('/products');
                }}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.productId} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <div className="flex gap-4">
                    {/* Product image */}
                    <div className="w-20 h-20 bg-gray-200 rounded">
                      <img 
                        src={item.product.imageUrl || '/images/placeholder.png'} 
                        alt={item.product.flavor}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    
                    {/* Product info */}
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{item.product.flavor}</h3>
                        <button 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => removeItem(item.productId)}
                          aria-label={`Remove ${item.product.flavor} from cart`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.product.strength}mg</p>
                      <div className="mt-2 flex justify-between items-center">
                        <div className="flex items-center border rounded">
                          <button 
                            className="px-2 py-1 border-r"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="px-3">{item.quantity}</span>
                          <button 
                            className="px-2 py-1 border-l"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        <div className="font-bold">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between mb-4">
              <button 
                className="text-red-500 hover:text-red-700 text-sm"
                onClick={clearCart}
              >
                Clear Cart
              </button>
              <div>
                <div className="text-gray-600 dark:text-gray-400">Subtotal:</div>
                <div className="text-xl font-bold">${subtotal.toFixed(2)}</div>
              </div>
            </div>
            <button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
              onClick={handleCheckout}
            >
              Checkout
            </button>
            <button 
              className="w-full mt-2 border border-gray-300 dark:border-gray-600 py-3 rounded-lg"
              onClick={onClose}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;