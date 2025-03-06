import { useState, useEffect } from 'react';
import { where, orderBy } from 'firebase/firestore';
import { 
  Product,
  getAllProducts,
  getProductsByCategory,
  getProductsByFlavor,
  listenToQuery,
  COLLECTIONS
} from '../pouchesDb';

interface UseProductsOptions {
  activeOnly?: boolean;
  category?: string;
  flavor?: string;
  strengthFilter?: number;
  sortBy?: 'price' | 'flavor' | 'strength';
  sortDirection?: 'asc' | 'desc';
  limit?: number;
}

// Hook for fetching and filtering products
export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const {
    activeOnly = true,
    category,
    flavor,
    strengthFilter,
    sortBy = 'flavor',
    sortDirection = 'asc',
    limit
  } = options;

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Function to fetch products based on filters
    const fetchProducts = async () => {
      try {
        let productsList: Product[];

        // Fetch products based on category or flavor filter
        if (category) {
          productsList = await getProductsByCategory(category, activeOnly);
        } else if (flavor) {
          productsList = await getProductsByFlavor(flavor, activeOnly);
        } else {
          productsList = await getAllProducts(activeOnly);
        }

        // Apply strength filter if provided
        if (strengthFilter) {
          productsList = productsList.filter(product => product.strength === strengthFilter);
        }

        // Apply sorting
        productsList.sort((a, b) => {
          if (sortBy === 'price') {
            return sortDirection === 'asc' ? a.price - b.price : b.price - a.price;
          } else if (sortBy === 'strength') {
            return sortDirection === 'asc' ? a.strength - b.strength : b.strength - a.strength;
          } else {
            // Default sort by flavor
            return sortDirection === 'asc' 
              ? a.flavor.localeCompare(b.flavor) 
              : b.flavor.localeCompare(a.flavor);
          }
        });

        // Apply limit if provided
        if (limit && limit > 0) {
          productsList = productsList.slice(0, limit);
        }

        setProducts(productsList);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred while fetching products'));
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeOnly, category, flavor, strengthFilter, sortBy, sortDirection, limit]);

  return { products, loading, error };
}

// Hook for real-time products updates
export function useProductsRealtime(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const {
    activeOnly = true,
    category,
    flavor,
    strengthFilter,
    sortBy = 'flavor',
    sortDirection = 'asc',
    limit
  } = options;

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Build query constraints
    const constraints = [];
    
    if (activeOnly) {
      constraints.push(where('active', '==', true));
    }
    
    if (category) {
      constraints.push(where('category', '==', category));
    }
    
    if (flavor) {
      constraints.push(where('flavor', '==', flavor));
    }
    
    // Add ordering constraint based on sortBy
    if (sortBy === 'price') {
      constraints.push(orderBy('price', sortDirection));
    } else if (sortBy === 'strength') {
      constraints.push(orderBy('strength', sortDirection));
    } else {
      constraints.push(orderBy('flavor', sortDirection));
    }

    // Subscribe to real-time updates
    const unsubscribe = listenToQuery<Product>(
      COLLECTIONS.PRODUCTS,
      constraints,
      (productsList) => {
        // Apply strength filter if provided
        let filteredProducts = productsList;
        
        if (strengthFilter) {
          filteredProducts = filteredProducts.filter(product => product.strength === strengthFilter);
        }
        
        // Apply limit if provided
        if (limit && limit > 0) {
          filteredProducts = filteredProducts.slice(0, limit);
        }
        
        setProducts(filteredProducts);
        setLoading(false);
      }
    );

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, [activeOnly, category, flavor, strengthFilter, sortBy, sortDirection, limit]);

  return { products, loading, error };
}

// Hook for fetching a single product by ID
export function useProduct(productId: string | null) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!productId) {
      setProduct(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Subscribe to real-time updates for the product
    const unsubscribe = listenToDocument<Product>(
      COLLECTIONS.PRODUCTS,
      productId,
      (productData) => {
        setProduct(productData);
        setLoading(false);
      }
    );

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, [productId]);

  return { product, loading, error };
}