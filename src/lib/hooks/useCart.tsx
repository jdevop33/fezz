import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { Product } from '../types';
import { toast } from 'sonner';
import { useAuth } from '../AuthContext';

// Define Enhanced CartItem type
export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  priceAtAddition: number; // Store price at time of addition to handle price changes
  dateAdded: number; // Timestamp for when item was added
}

// Define cart context type with expanded functionality
interface CartContextType {
  items: CartItem[];
  addToCart: (product: Partial<Product> & { id: string, name?: string, price: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  retailTotal: number; // Total at retail price (for wholesale users)
  savings: number; // Amount saved (for wholesale users)
  mergeLocalCart: () => void; // Merges guest cart with user account on login
  isItemInCart: (productId: string) => boolean;
}

// Create context with default values
const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  itemCount: 0,
  subtotal: 0,
  retailTotal: 0,
  savings: 0,
  mergeLocalCart: () => {},
  isItemInCart: () => false
});

// Local storage key for cart with expiration
const CART_STORAGE_KEY = 'pouches_cart_v2';
const CART_EXPIRY_DAYS = 30; // Expire cart items after 30 days

// Provider component for the cart with improved error handling and wholesale pricing support
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { currentUser } = useAuth();
  
  // User roles for price calculations
  const isWholesale = currentUser?.role === 'wholesale' || currentUser?.role === 'distributor';
  
  // Initialize cart from local storage
  useEffect(() => {
    try {
      const savedCartData = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCartData) {
        const savedCart = JSON.parse(savedCartData);
        
        // Filter out expired items
        const now = Date.now();
        const maxAge = CART_EXPIRY_DAYS * 24 * 60 * 60 * 1000; // days to ms
        const validItems = savedCart.filter((item: CartItem) => {
          const itemAge = now - (item.dateAdded || 0);
          return itemAge < maxAge;
        });
        
        setItems(validItems);
        
        // If we filtered any items, update localStorage
        if (validItems.length !== savedCart.length) {
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(validItems));
        }
      }
    } catch (error) {
      console.error('Error loading cart from local storage:', error);
      // Reset cart if corrupted
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);
  
  // Save cart to local storage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to local storage:', error);
      toast.error('Failed to save cart. Please try again.');
    }
  }, [items]);
  
  // Calculate item count and totals
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  
  // Calculate pricing based on user role
  const subtotal = parseFloat(
    items.reduce((total, item) => {
      // Use wholesale price if available and user is wholesale/distributor
      const price = isWholesale && item.product.wholesalePrice 
        ? item.product.wholesalePrice 
        : item.product.price;
      return total + (price * item.quantity);
    }, 0).toFixed(2)
  );
  
  // Calculate retail total (for comparison)
  const retailTotal = parseFloat(
    items.reduce((total, item) => total + (item.product.price * item.quantity), 0).toFixed(2)
  );
  
  // Calculate savings for wholesale users
  const savings = isWholesale ? retailTotal - subtotal : 0;
  
  // Add item to cart with improved error handling
  const addToCart = useCallback((productData: Partial<Product> & { id: string, name?: string, price: number }) => {
    try {
      // Validate minimum required data
      if (!productData.id || productData.price === undefined) {
        throw new Error('Invalid product data');
      }
      
      // Create a minimal product object if a full Product is not provided
      const product = {
        id: productData.id,
        itemPN: productData.name || productData.itemPN || 'Product',
        description: productData.description || '',
        flavor: productData.flavor || '',
        strength: productData.strength || 0,
        price: productData.price,
        wholesalePrice: productData.wholesalePrice || productData.price * 0.8, // Default 20% discount if not specified
        inventoryCount: productData.inventoryCount || 100,
        category: productData.category || 'nicotine-pouches',
        imageUrl: productData.imageUrl || '/images/placeholder.jpg',
        active: true,
        ...productData
      } as Product;
      
      setItems(prevItems => {
        const existingItemIndex = prevItems.findIndex(item => item.productId === product.id);
        
        if (existingItemIndex >= 0) {
          // Item already exists, increment quantity
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + 1
          };
          
          toast.success(`${product.itemPN} quantity updated in cart`);
          return updatedItems;
        } else {
          // Add new item
          toast.success(`${product.itemPN} added to cart`);
          return [...prevItems, {
            productId: product.id,
            product,
            quantity: 1,
            priceAtAddition: product.price,
            dateAdded: Date.now()
          }];
        }
      });
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast.error('Failed to add product to cart');
    }
  }, []);
  
  // Remove item from cart
  const removeItem = useCallback((productId: string) => {
    setItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.productId === productId);
      if (itemToRemove) {
        toast.info(`${itemToRemove.product.itemPN} removed from cart`);
      }
      return prevItems.filter(item => item.productId !== productId);
    });
  }, []);
  
  // Update item quantity with inventory check
  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    
    setItems(prevItems => {
      const itemIndex = prevItems.findIndex(item => item.productId === productId);
      
      if (itemIndex === -1) {
        return prevItems;
      }
      
      const item = prevItems[itemIndex];
      
      // Check inventory limits
      if (quantity > (item.product.inventoryCount || 9999)) {
        toast.error(`Sorry, only ${item.product.inventoryCount} units available.`);
        quantity = item.product.inventoryCount || 9999;
      }
      
      const updatedItems = [...prevItems];
      updatedItems[itemIndex] = {
        ...item,
        quantity
      };
      
      return updatedItems;
    });
  }, [removeItem]);
  
  // Clear cart
  const clearCart = useCallback(() => {
    setItems([]);
    toast.info('Cart cleared');
  }, []);
  
  // Merge local cart with user cart on login
  const mergeLocalCart = useCallback(() => {
    // This would typically interact with a backend API to merge the cart
    // For now, we'll just keep the local cart
    toast.success('Cart synchronized with your account');
  }, []);
  
  // Check if an item is already in the cart
  const isItemInCart = useCallback((productId: string) => {
    return items.some(item => item.productId === productId);
  }, [items]);
  
  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeItem,
      updateQuantity,
      clearCart,
      itemCount,
      subtotal,
      retailTotal,
      savings,
      mergeLocalCart,
      isItemInCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

/**
 * Custom hook to use the cart context
 * @returns CartContextType
 */
export const useCart = () => useContext(CartContext);