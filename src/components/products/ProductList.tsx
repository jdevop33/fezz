import React, { useState } from 'react';
import { useProducts, useCart } from '../../lib/hooks';
import { Product } from '../../lib/pouchesDb';
import { toast } from 'sonner';

interface ProductListProps {
  category?: string;
  flavor?: string;
  showFilters?: boolean;
}

const ProductList: React.FC<ProductListProps> = ({ 
  category,
  flavor,
  showFilters = true
}) => {
  // State for filters
  const [strengthFilter, setStrengthFilter] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState<'price' | 'flavor' | 'strength'>('flavor');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Get products using our hook
  const { products, loading, error } = useProducts({
    category,
    flavor,
    strengthFilter,
    sortBy,
    sortDirection
  });

  // Handle empty states
  if (loading) {
    return <div className="flex justify-center py-8">Loading products...</div>;
  }

  if (error) {
    return <div className="flex justify-center py-8 text-red-500">Error loading products: {error.message}</div>;
  }

  if (products.length === 0) {
    return <div className="flex justify-center py-8">No products found.</div>;
  }

  // Get unique strength values for filter
  const strengths = Array.from(new Set(products.map(product => product.strength))).sort((a, b) => a - b);

  return (
    <div className="container mx-auto py-6">
      {/* Filters */}
      {showFilters && (
        <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Strength filter */}
            <div>
              <label htmlFor="strength" className="block text-sm font-medium mb-1">
                Strength
              </label>
              <select
                id="strength"
                className="w-full p-2 border rounded"
                value={strengthFilter || ''}
                onChange={(e) => setStrengthFilter(e.target.value ? parseInt(e.target.value) : undefined)}
              >
                <option value="">All strengths</option>
                {strengths.map((strength) => (
                  <option key={strength} value={strength}>
                    {strength}mg
                  </option>
                ))}
              </select>
            </div>
            
            {/* Sort by filter */}
            <div>
              <label htmlFor="sortBy" className="block text-sm font-medium mb-1">
                Sort by
              </label>
              <select
                id="sortBy"
                className="w-full p-2 border rounded"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'price' | 'flavor' | 'strength')}
              >
                <option value="flavor">Flavor</option>
                <option value="price">Price</option>
                <option value="strength">Strength</option>
              </select>
            </div>
            
            {/* Sort direction filter */}
            <div>
              <label htmlFor="sortDirection" className="block text-sm font-medium mb-1">
                Order
              </label>
              <select
                id="sortDirection"
                className="w-full p-2 border rounded"
                value={sortDirection}
                onChange={(e) => setSortDirection(e.target.value as 'asc' | 'desc')}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Products grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

// Product card component
interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  
  const handleAddToCart = () => {
    addItem(product);
    toast.success(`${product.flavor} added to cart!`);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden flex flex-col">
      {/* Product image */}
      <div className="relative h-48 bg-gray-200">
        <img
          src={product.imageUrl || '/images/placeholder.png'}
          alt={product.flavor}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
          {product.strength}mg
        </div>
      </div>
      
      {/* Product details */}
      <div className="p-4 flex-grow">
        <h3 className="text-lg font-semibold">{product.flavor}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{product.description}</p>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
          {product.inventoryCount <= 10 && (
            <span className="text-xs text-red-500 font-medium">
              Only {product.inventoryCount} left!
            </span>
          )}
        </div>
      </div>
      
      {/* Actions */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
          onClick={handleAddToCart}
          disabled={product.inventoryCount === 0}
        >
          {product.inventoryCount === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductList;