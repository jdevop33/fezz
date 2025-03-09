import { useContext } from 'react';
import { CartContext } from './useCart';

/**
 * Custom hook to use the cart context
 * @returns CartContextType
 */
export const useCart = () => useContext(CartContext);