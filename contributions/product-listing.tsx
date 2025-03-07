import React, { useState } from 'react';
import { ChevronDown, ShoppingCart, Star, Filter, X, SlidersHorizontal } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  strength: string;
  count: number;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  imageUrl?: string;
  isNew?: boolean;
}

interface ProductCardProps {
  product: Product;
}

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  flavors: string[];
  strengths: number[];
  selectedFilters: {
    flavors: string[];
    strengths: number[];
  };
  onFilterChange: (filterType: 'flavors' | 'strengths' | 'reset', value?: string | number) => void;
}

// ProductCard component for individual product display
const ProductCard = ({ product }: ProductCardProps) => {
  const handleAddToCart = () => {
    console.log('Added to cart:', product.name);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleAddToCart();
    }
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-surface-200 bg-white shadow-sm transition-all hover:shadow-md">
      {/* Favorite button */}
      <button 
        className="absolute right-2 top-2 rounded-full bg-white/80 p-1.5 text-surface-500 backdrop-blur transition-colors hover:bg-white hover:text-accent-500"
        aria-label="Add to favorites"
        tabIndex="0"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      </button>

      {/* Product image */}
      <div className="relative flex h-48 items-center justify-center overflow-hidden bg-surface-100 p-4">
        <img 
          src={product.imageUrl || "/api/placeholder/240/240"} 
          alt={product.name} 
          className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105"
        />
        {product.isNew && (
          <span className="absolute left-2 top-2 rounded bg-primary-500 px-2 py-1 text-xs font-medium text-white">
            NEW
          </span>
        )}
      </div>

      {/* Product content */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <div className="mb-1 flex items-center">
            <div className="flex text-warning-400">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={14} 
                  fill={i < product.rating ? "currentColor" : "none"} 
                  className={i < product.rating ? "text-warning-400" : "text-surface-300"} 
                />
              ))}
            </div>
            <span className="ml-1 text-xs text-surface-500">({product.reviewCount})</span>
          </div>

          <h3 className="mb-1 font-medium text-surface-900">{product.name}</h3>
          
          <div className="mb-2">
            <span className="text-xs text-surface-500">{product.strength}mg • {product.count} count</span>
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-surface-900">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-sm text-surface-400 line-through">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          onKeyDown={handleKeyDown}
          className="mt-4 flex w-full items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          aria-label={`Add ${product.name} to cart`}
          tabIndex="0"
        >
          <ShoppingCart size={16} className="mr-2" />
          Add to cart
        </button>
      </div>
    </div>
  );
};

// Filter Sidebar component
const FilterSidebar = ({ isOpen, onClose, flavors, strengths, selectedFilters, onFilterChange }: FilterSidebarProps) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-surface-950/30 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed bottom-0 left-0 top-0 z-50 w-80 transform overflow-y-auto bg-white p-6 shadow-lg transition duration-300 lg:relative lg:z-0 lg:block lg:transform-none lg:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="mb-6 flex items-center justify-between lg:hidden">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button 
            onClick={onClose} 
            className="rounded-full p-1 text-surface-500 hover:bg-surface-100 hover:text-surface-700"
            aria-label="Close filters"
            tabIndex="0"
          >
            <X size={20} />
          </button>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <h3 className="mb-3 font-medium text-surface-900">Price Range</h3>
          <div className="flex items-center gap-2">
            <input 
              type="range" 
              min="0" 
              max="100" 
              className="h-2 w-full appearance-none rounded-lg bg-surface-200" 
              id="price-range"
            />
          </div>
          <div className="mt-2 flex justify-between text-sm text-surface-600">
            <span>$0</span>
            <span>$100</span>
          </div>
        </div>

        {/* Flavors */}
        <div className="mb-6">
          <h3 className="mb-3 font-medium text-surface-900">Flavors</h3>
          <div className="space-y-2">
            {flavors.map((flavor) => (
              <label key={flavor} className="flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                  checked={selectedFilters.flavors.includes(flavor)}
                  onChange={() => onFilterChange('flavors', flavor)}
                />
                <span className="ml-2 text-sm text-surface-700">{flavor}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Strengths */}
        <div className="mb-6">
          <h3 className="mb-3 font-medium text-surface-900">Strength</h3>
          <div className="space-y-2">
            {strengths.map((strength) => (
              <label key={strength} className="flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                  checked={selectedFilters.strengths.includes(strength)}
                  onChange={() => onFilterChange('strengths', strength)}
                />
                <span className="ml-2 text-sm text-surface-700">{strength}mg</span>
              </label>
            ))}
          </div>
        </div>

        {/* Reset Filters */}
        <button
          className="w-full rounded-md border border-surface-300 bg-white py-2 text-sm font-medium text-surface-700 hover:bg-surface-50"
          onClick={() => {
            // Reset all filters
            onFilterChange('reset');
          }}
          aria-label="Reset all filters"
          tabIndex="0"
        >
          Reset Filters
        </button>
      </aside>
    </>
  );
};

const ProductListing = () => {
  // Mock data for products
  const products: Product[] = [
    { id: 1, name: 'PUXX Peppermint Strong', strength: '16mg', count: 20, price: 24.99, rating: 5, reviewCount: 42, imageUrl: '/api/placeholder/240/240', isNew: true },
    { id: 2, name: 'PUXX Cherry Strong', strength: '16mg', count: 20, price: 24.99, rating: 4, reviewCount: 18, imageUrl: '/api/placeholder/240/240' },
    { id: 3, name: 'PUXX Cola Strong', strength: '16mg', count: 20, price: 24.99, rating: 4, reviewCount: 27, imageUrl: '/api/placeholder/240/240' },
    { id: 4, name: 'PUXX Apple Mint Strong', strength: '16mg', count: 20, price: 24.99, rating: 5, reviewCount: 31, imageUrl: '/api/placeholder/240/240' },
    { id: 5, name: 'PUXX Cool Mint Strong', strength: '16mg', count: 20, price: 24.99, originalPrice: 29.99, rating: 5, reviewCount: 24, imageUrl: '/api/placeholder/240/240' },
    { id: 6, name: 'PUXX Spearmint Strong', strength: '16mg', count: 20, price: 24.99, rating: 4, reviewCount: 15, imageUrl: '/api/placeholder/240/240', isNew: true },
    { id: 7, name: 'PUXX Watermelon Strong', strength: '16mg', count: 20, price: 24.99, rating: 3, reviewCount: 11, imageUrl: '/api/placeholder/240/240' },
    { id: 8, name: 'PUXX Apple Mint Extra', strength: '22mg', count: 20, price: 29.99, rating: 5, reviewCount: 39, imageUrl: '/api/placeholder/240/240' },
  ];

  // Filter options
  const flavors = ['Apple Mint', 'Cherry', 'Cola', 'Cool Mint', 'Peppermint', 'Spearmint', 'Watermelon'];
  const strengths = [6, 12, 16, 22];

  // State for filter sidebar on mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // State for selected filters
  const [selectedFilters, setSelectedFilters] = useState({
    flavors: [] as string[],
    strengths: [] as number[],
  });

  // State for sorting
  const [sortOption, setSortOption] = useState('best-selling');

  // Handle filter changes
  const handleFilterChange = (filterType: 'flavors' | 'strengths' | 'reset', value?: string | number) => {
    if (filterType === 'reset') {
      setSelectedFilters({
        flavors: [],
        strengths: [],
      });
      return;
    }

    setSelectedFilters(prev => {
      const currentFilters = [...prev[filterType]];
      
      if (currentFilters.includes(value as never)) {
        return {
          ...prev,
          [filterType]: currentFilters.filter(item => item !== value)
        };
      } else {
        return {
          ...prev,
          [filterType]: [...currentFilters, value]
        };
      }
    });
  };

  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  // Filter products based on selected filters
  const filteredProducts = products.filter(product => {
    // If no flavor filters are selected, show all flavors
    const flavorMatch = selectedFilters.flavors.length === 0 || 
      selectedFilters.flavors.some(flavor => 
        product.name.toLowerCase().includes(flavor.toLowerCase())
      );
    
    // If no strength filters are selected, show all strengths
    const strengthMatch = selectedFilters.strengths.length === 0 || 
      selectedFilters.strengths.some(strength => 
        product.strength.includes(strength.toString())
      );
    
    return flavorMatch && strengthMatch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return b.isNew ? 1 : -1;
      case 'best-selling':
      default:
        return b.reviewCount - a.reviewCount;
    }
  });

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-surface-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="/api/placeholder/1920/400" 
            alt="Premium Nicotine Pouches" 
            className="h-full w-full object-cover opacity-60"
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">Premium Nicotine Pouches</h1>
            <p className="text-lg text-white/80">Experience the highest quality tobacco-free nicotine pouches with our premium selection.</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page header & mobile filter button */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-surface-900">All Products</h2>
          <div className="flex items-center gap-4">
            {/* Mobile filter button */}
            <button
              className="flex items-center rounded-md border border-surface-300 bg-white px-4 py-2 text-sm font-medium text-surface-700 hover:bg-surface-50 lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open filters"
              tabIndex="0"
            >
              <Filter size={16} className="mr-2" />
              Filters
            </button>

            {/* Sort dropdown */}
            <div className="relative">
              <select
                className="block w-full appearance-none rounded-md border border-surface-300 bg-white px-4 py-2 pr-10 text-sm font-medium text-surface-700 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                value={sortOption}
                onChange={handleSortChange}
                aria-label="Sort products"
              >
                <option value="best-selling">Best Selling</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-surface-500">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Main content with filters and product grid */}
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Filters - desktop view built into the left sidebar */}
          <FilterSidebar 
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            flavors={flavors}
            strengths={strengths}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
          />

          {/* Product Grid */}
          <div className="flex-1">
            {/* Active filters */}
            {(selectedFilters.flavors.length > 0 || selectedFilters.strengths.length > 0) && (
              <div className="mb-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-surface-700">Active Filters:</span>
                  
                  {selectedFilters.flavors.map(flavor => (
                    <span 
                      key={flavor}
                      className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700"
                    >
                      {flavor}
                      <button
                        className="ml-1.5 rounded-full text-primary-400 hover:bg-primary-100 hover:text-primary-500"
                        onClick={() => handleFilterChange('flavors', flavor)}
                        aria-label={`Remove ${flavor} filter`}
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                  
                  {selectedFilters.strengths.map(strength => (
                    <span 
                      key={strength}
                      className="inline-flex items-center rounded-full bg-secondary-50 px-3 py-1 text-xs font-medium text-secondary-700"
                    >
                      {strength}mg
                      <button
                        className="ml-1.5 rounded-full text-secondary-400 hover:bg-secondary-100 hover:text-secondary-500"
                        onClick={() => handleFilterChange('strengths', strength)}
                        aria-label={`Remove ${strength}mg filter`}
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                  
                  <button
                    className="text-xs font-medium text-surface-500 hover:text-primary-600"
                    onClick={() => handleFilterChange('reset')}
                    aria-label="Clear all filters"
                  >
                    Clear all
                  </button>
                </div>
              </div>
            )}

            {/* Product count */}
            <p className="mb-6 text-sm text-surface-500">
              Showing {sortedProducts.length} products
            </p>

            {/* Products grid */}
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {sortedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-surface-200 bg-white py-12">
                <SlidersHorizontal size={48} className="mb-4 text-surface-400" />
                <h3 className="mb-2 text-lg font-medium text-surface-900">No products found</h3>
                <p className="mb-6 text-center text-surface-500">Try adjusting your filters or search criteria.</p>
                <button
                  className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  onClick={() => handleFilterChange('reset')}
                  aria-label="Reset all filters"
                  tabIndex="0"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListing;