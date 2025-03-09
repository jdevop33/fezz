import { useContext } from 'react';
import { ProductContext } from '../../contexts/ProductContext';

/**
 * Hook to access product context
 * @returns ProductContextType
 */
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};