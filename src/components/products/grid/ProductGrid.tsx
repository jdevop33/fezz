import React, { useState } from 'react';
import { useProducts } from '../../../lib/hooks';
import { useCart } from '../../../lib/hooks';
import { useAuth } from '../../../lib/hooks';
import { Package, Filter, ShoppingCart } from 'lucide-react';

const ProductGrid: React.FC = () => {
  const { products, loading, error } = useProducts();
  const { addToCart } = useCart();
  const { isWholesale, isApproved } = useAuth();
  
  const [selectedFlavor, setSelectedFlavor] = useState<string | null>(null);
  const [selectedStrength, setSelectedStrength] = useState<number | null>(null);
  
  // Get unique flavors for filter
  const flavors = [...new Set(products.map(product => product.flavor))];
  
  // Get unique strengths for filter
  const strengths = [...new Set(products.map(product => product.strength))].sort((a, b) => a - b);
  
  // Apply filters
  const filteredProducts = products.filter(product => {
    if (selectedFlavor && product.flavor !== selectedFlavor) return false;
    if (selectedStrength && product.strength !== selectedStrength) return false;
    return true;
  });
  
  const handleAddToCart = (product: {
    id: string;
    itemPN: string;
    price: number;
    imageUrl?: string;
  }) => {
    addToCart(product);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-error-50 dark:bg-error-900/20 p-4 rounded-lg text-error-600 dark:text-error-400">
        {error}
      </div>
    );
  }
  
  return (
    <div>
      {/* Filters */}
      <div className="mb-8 bg-white dark:bg-surface-800 p-4 rounded-lg shadow-sm border border-surface-200 dark:border-surface-700">
        <div className="flex items-center mb-4">
          <Filter className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
          <h2 className="text-lg font-medium text-surface-900 dark:text-white">Filters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Flavor filter */}
          <div>
            <label htmlFor="flavor-filter" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
              Flavor
            </label>
            <select
              id="flavor-filter"
              value={selectedFlavor || ''}
              onChange={(e) => setSelectedFlavor(e.target.value || null)}
              className="w-full rounded-md border-surface-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-surface-700 dark:border-surface-600 dark:text-white"
            >
              <option value="">All Flavors</option>
              {flavors.map(flavor => (
                <option key={flavor} value={flavor}>
                  {flavor}
                </option>
              ))}
            </select>
          </div>
          
          {/* Strength filter */}
          <div>
            <label htmlFor="strength-filter" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
              Strength
            </label>
            <select
              id="strength-filter"
              value={selectedStrength || ''}
              onChange={(e) => setSelectedStrength(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full rounded-md border-surface-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-surface-700 dark:border-surface-600 dark:text-white"
            >
              <option value="">All Strengths</option>
              {strengths.map(strength => (
                <option key={strength} value={strength}>
                  {strength}mg
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Reset filters button */}
        {(selectedFlavor || selectedStrength) && (
          <button
            onClick={() => {
              setSelectedFlavor(null);
              setSelectedStrength(null);
            }}
            className="mt-4 text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
          >
            Reset filters
          </button>
        )}
      </div>
      
      {/* Product grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-surface-800 rounded-lg shadow-sm border border-surface-200 dark:border-surface-700">
          <Package className="h-12 w-12 mx-auto text-surface-400 dark:text-surface-600" />
          <h3 className="mt-4 text-lg font-medium text-surface-900 dark:text-white">No products found</h3>
          <p className="mt-1 text-surface-600 dark:text-surface-400">
            Try adjusting your filters to find what you're looking for.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div 
              key={product.id}
              className="bg-white dark:bg-surface-800 rounded-lg shadow-sm border border-surface-200 dark:border-surface-700 overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              {/* Product image */}
              <div className="bg-surface-50 dark:bg-surface-900 aspect-square flex items-center justify-center">
                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.description} 
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <Package className="h-16 w-16 text-surface-300 dark:text-surface-700" />
                )}
              </div>
              
              {/* Product info */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-surface-900 dark:text-white">
                    {product.flavor}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400">
                    {product.strength}mg
                  </span>
                </div>
                <p className="mt-1 text-sm text-surface-600 dark:text-surface-400">
                  {product.description}
                </p>
                
                {/* Price section */}
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <p className="text-lg font-medium text-surface-900 dark:text-white">
                      ${isWholesale && isApproved ? product.wholesalePrice.toFixed(2) : product.price.toFixed(2)}
                    </p>
                    {isWholesale && isApproved && (
                      <p className="text-xs text-surface-500 dark:text-surface-400">
                        Retail: ${product.price.toFixed(2)}
                      </p>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
