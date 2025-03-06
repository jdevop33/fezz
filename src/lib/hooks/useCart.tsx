import { useState, useEffect, createContext, useContext } from 'react';
import { Product } from '../pouchesDb';

// Define cart item type
export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}

// Define cart context type
interface CartContextType {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}

// Create context with default values
const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  itemCount: 0,
  subtotal: 0
});

// Local storage key for cart
const CART_STORAGE_KEY = 'pouches_cart';

// Provider component for the cart
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  
  // Initialize cart from local storage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart from local storage:', error);
    }
  }, []);
  
  // Save cart to local storage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to local storage:', error);
    }
  }, [items]);
  
  // Calculate item count and subtotal
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  const subtotal = parseFloat(
    items.reduce((total, item) => total + (item.product.price * item.quantity), 0).toFixed(2)
  );
  
  // Add item to cart
  const addItem = (product: Product) => {
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.productId === product.id);
      
      if (existingItemIndex >= 0) {
        // Item already exists, increment quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        return updatedItems;
      } else {
        // Add new item
        return [...prevItems, {
          productId: product.id,
          product,
          quantity: 1
        }];
      }
    });
  };
  
  // Remove item from cart
  const removeItem = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.productId !== productId));
  };
  
  // Update item quantity
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    
    setItems(prevItems => prevItems.map(item => 
      item.productId === productId 
        ? { ...item, quantity } 
        : item
    ));
  };
  
  // Clear cart
  const clearCart = () => {
    setItems([]);
  };
  
  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      itemCount,
      subtotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart
export const useCart = () => useContext(CartContext);