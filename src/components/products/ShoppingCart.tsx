import React, { useEffect, useRef } from 'react';
import { useCart } from '../../lib/hooks';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import { ShoppingCart as CartIcon, X, Trash2, Plus, Minus, ChevronRight } from 'lucide-react';

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ isOpen, onClose }) => {
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    clearCart, 
    subtotal, 
    retailTotal,
    savings,
    itemCount 
  } = useCart();
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const cartRef = useRef<HTMLDivElement>(null);
  
  // Handle closing the cart when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  // Handle escape key press
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);
  
  // When the cart is opened, focus on the first focusable element
  useEffect(() => {
    if (isOpen && cartRef.current) {
      const firstFocusable = cartRef.current.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') as HTMLElement;
      if (firstFocusable) {
        setTimeout(() => firstFocusable.focus(), 100);
      }
    }
  }, [isOpen]);
  
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
  
  // Check if user is wholesale
  const isWholesale = currentUser?.role === 'wholesale' || currentUser?.role === 'distributor';
  
  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="cart-title">
      {/* Backdrop with animation */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Cart panel with animation */}
      <div 
        ref={cartRef}
        className="absolute inset-y-0 right-0 w-full max-w-md bg-white dark:bg-gray-800 shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out"
        style={{ maxHeight: '100vh' }}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 id="cart-title" className="text-xl font-bold flex items-center gap-2">
            <CartIcon size={20} className="text-primary-600" /> 
            Shopping Cart ({itemCount})
          </h2>
          <button 
            className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            onClick={onClose}
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Cart items */}
        <div className="flex-grow overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          {items.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="mx-auto w-16 h-16 mb-4 text-gray-300 dark:text-gray-600">
                <CartIcon size={64} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Looks like you haven't added any products to your cart yet.</p>
              <button 
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={() => {
                  onClose();
                  navigate('/products');
                }}
              >
                Continue Shopping
                <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.productId} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <div className="flex gap-4">
                    {/* Product image */}
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden flex-shrink-0">
                      <img 
                        src={item.product.imageUrl || '/images/placeholder.png'} 
                        alt={item.product.flavor}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/placeholder.png';
                        }}
                      />
                    </div>
                    
                    {/* Product info */}
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">
                          {item.product.itemPN || item.product.flavor}
                        </h3>
                        <button 
                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full"
                          onClick={() => removeItem(item.productId)}
                          aria-label={`Remove ${item.product.flavor} from cart`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <div className="flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <p>{item.product.flavor} • {item.product.strength}mg</p>
                        
                        {/* Show both retail and wholesale prices for wholesale users */}
                        {isWholesale && item.product.wholesalePrice && (
                          <div className="flex gap-2 items-center">
                            <span className="text-primary-600 font-medium">${item.product.wholesalePrice.toFixed(2)}</span>
                            <span className="line-through text-xs">${item.product.price.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-2 flex justify-between items-center">
                        <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
                          <button 
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-primary-500"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-3 py-1 min-w-[2rem] text-center">{item.quantity}</span>
                          <button 
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-primary-500"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        
                        <div className="font-bold text-gray-900 dark:text-gray-100">
                          ${((isWholesale && item.product.wholesalePrice ? item.product.wholesalePrice : item.product.price) * item.quantity).toFixed(2)}
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
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-b-lg">
            {/* Show savings for wholesale users */}
            {isWholesale && savings > 0 && (
              <div className="mb-2 bg-green-50 dark:bg-green-900/20 p-2 rounded-md">
                <p className="text-green-700 dark:text-green-400 text-sm font-medium">
                  Wholesale savings: ${savings.toFixed(2)}
                </p>
              </div>
            )}
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                <span className="font-medium">Calculated at checkout</span>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2 flex justify-between">
                <span className="font-medium text-gray-800 dark:text-gray-200">Total</span>
                <span className="text-xl font-bold text-gray-900 dark:text-gray-100">${subtotal.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex justify-between mb-4">
              <button 
                className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:underline focus:outline-none focus:ring-2 focus:ring-red-500 rounded-md"
                onClick={clearCart}
                aria-label="Clear all items in cart"
              >
                <div className="flex items-center gap-1">
                  <Trash2 size={14} />
                  <span>Clear Cart</span>
                </div>
              </button>
            </div>
            
            <div className="space-y-2">
              <button 
                className="w-full flex justify-center items-center bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-md font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                onClick={handleCheckout}
              >
                Proceed to Checkout
                <ChevronRight size={16} className="ml-1" />
              </button>
              
              <button 
                className="w-full flex justify-center items-center border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                onClick={onClose}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;