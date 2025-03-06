import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAllProducts, Product } from '../lib/pouchesDb';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  filterByFlavor: (flavor: string) => Product[];
  filterByStrength: (strength: number) => Product[];
  getProductById: (id: string) => Product | undefined;
}

const ProductContext = createContext<ProductContextType | null>(null);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const productData = await getAllProducts();
        setProducts(productData);
        setError(null);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filterByFlavor = (flavor: string) => {
    return products.filter(product => product.flavor.toLowerCase() === flavor.toLowerCase());
  };

  const filterByStrength = (strength: number) => {
    return products.filter(product => product.strength === strength);
  };

  const getProductById = (id: string) => {
    return products.find(product => product.id === id);
  };

  const value = {
    products,
    loading,
    error,
    filterByFlavor,
    filterByStrength,
    getProductById,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};
