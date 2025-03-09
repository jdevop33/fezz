import React, { createContext, useState, useEffect, useCallback } from 'react';
import { getAllProducts, Product } from '../lib/pouchesDb';
import { db } from '../lib/firebase';
import { collection, query, getDocs, QueryConstraint, where, orderBy } from 'firebase/firestore';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  filterByFlavor: (flavor: string) => Product[];
  filterByStrength: (strength: number) => Product[];
  getProductById: (id: string) => Promise<Product | null>;
  getProductByIdLocal: (id: string) => Product | undefined;
  refreshProducts: () => Promise<void>;
  filterProducts: (filters: ProductFilters) => Promise<Product[]>;
}

export interface ProductFilters {
  flavors?: string[];
  strengths?: number[];
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  searchQuery?: string;
  sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'best-selling';
  limit?: number;
}

// Export the context so it can be imported in the hook file
export const ProductContext = createContext<ProductContextType | null>(null);

// The useProducts hook has been moved to a separate file: src/lib/hooks/useProducts.ts

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load products with optimized data fetching
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      // Only load active products for the initial load
      const productData = await getAllProducts();
      setProducts(productData);
      setError(null);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();

    // Set up a listener for real-time updates (optional - enable for admin views)
    // const unsubscribe = listenToQuery<Product>('products', 
    //   [where('active', '==', true), orderBy('updatedAt', 'desc')], 
    //   (updatedProducts) => {
    //     setProducts(updatedProducts);
    //   }
    // );
    // return () => unsubscribe();
  }, [loadProducts]);

  // Filter by flavor (client-side)
  const filterByFlavor = (flavor: string) => {
    return products.filter(product => product.flavor.toLowerCase() === flavor.toLowerCase());
  };

  // Filter by strength (client-side)
  const filterByStrength = (strength: number) => {
    return products.filter(product => product.strength === strength);
  };

  // Get product by ID (from local state if possible, otherwise fetch from database)
  const getProductById = async (id: string): Promise<Product | null> => {
    // First try to find in local state
    const localProduct = products.find(product => product.id === id);
    if (localProduct) {
      return localProduct;
    }
    
    // If not found, fetch from database
    try {
      const productRef = collection(db, 'products');
      const q = query(productRef);
      const querySnapshot = await getDocs(q);
      const doc = querySnapshot.docs.find(doc => doc.id === id);
      
      if (doc && doc.exists()) {
        return { id: doc.id, ...doc.data() } as Product;
      }
      
      return null;
    } catch (err) {
      console.error('Error fetching product by ID:', err);
      throw new Error('Failed to fetch product. Please try again later.');
    }
  };

  // Quick local lookup by ID without database call
  const getProductByIdLocal = (id: string) => {
    return products.find(product => product.id === id);
  };

  // Refresh products data
  const refreshProducts = async () => {
    return loadProducts();
  };

  // Advanced product filtering with server-side filtering
  const filterProducts = async ({
    flavors,
    strengths,
    category,
    minPrice,
    maxPrice,
    searchQuery,
    sortBy = 'newest',
    // limit parameter is reserved for future pagination features
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    limit = 50
  }: ProductFilters): Promise<Product[]> => {
    try {
      const constraints: QueryConstraint[] = [
        where('active', '==', true)
      ];
      
      // Add filters
      if (category) {
        constraints.push(where('category', '==', category));
      }
      
      if (flavors && flavors.length > 0) {
        constraints.push(where('flavor', 'in', flavors));
      }
      
      if (strengths && strengths.length > 0) {
        constraints.push(where('strength', 'in', strengths));
      }
      
      // Add price range filters (if supported by the backend)
      if (minPrice !== undefined) {
        constraints.push(where('price', '>=', minPrice));
      }
      
      if (maxPrice !== undefined) {
        constraints.push(where('price', '<=', maxPrice));
      }
      
      // Add sorting
      switch (sortBy) {
        case 'price-asc':
          constraints.push(orderBy('price', 'asc'));
          break;
        case 'price-desc':
          constraints.push(orderBy('price', 'desc'));
          break;
        case 'newest':
          constraints.push(orderBy('createdAt', 'desc'));
          break;
        case 'best-selling':
        default:
          // Default to newest if best-selling not available
          constraints.push(orderBy('createdAt', 'desc'));
          break;
      }
      
      // Execute the query
      const filteredProducts = await queryDocuments<Product>('products', constraints);
      
      // Apply full-text search client-side if needed (since Firestore doesn't support it natively)
      if (searchQuery && searchQuery.trim() !== '') {
        const normalizedQuery = searchQuery.toLowerCase().trim();
        return filteredProducts.filter(product => 
          product.itemPN.toLowerCase().includes(normalizedQuery) ||
          product.description.toLowerCase().includes(normalizedQuery) ||
          product.flavor.toLowerCase().includes(normalizedQuery) ||
          product.category.toLowerCase().includes(normalizedQuery)
        );
      }
      
      return filteredProducts;
    } catch (err) {
      console.error('Error filtering products:', err);
      throw new Error('Failed to filter products. Please try again later.');
    }
  };

  const value = {
    products,
    loading,
    error,
    filterByFlavor,
    filterByStrength,
    getProductById,
    getProductByIdLocal,
    refreshProducts,
    filterProducts
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};
