import React, { useState, useEffect } from 'react';
import { ChevronDown, ShoppingCart, Star, Filter, X, SlidersHorizontal } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useCart } from '../../lib/hooks/useCart';

// ProductCard component for individual product display
const ProductCard = ({ product, onAddToCart }) => {
  const handleAddToCart = () => {
    onAddToCart(product);
  };

  const handleKeyDown = (e) => {
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
        tabIndex={0}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      </button>

      {/* Product image */}
      <div className="relative flex h-48 items-center justify-center overflow-hidden bg-surface-100 p-4">
        <img 
          src={product.imageUrl || "/images/placeholder-product.jpg"} 
          alt={product.flavor} 
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
                  fill={i < (product.rating || 5) ? "currentColor" : "none"} 
                  className={i < (product.rating || 5) ? "text-warning-400" : "text-surface-300"} 
                />
              ))}
            </div>
            <span className="ml-1 text-xs text-surface-500">({product.reviewCount || 0})</span>
          </div>

          <h3 className="mb-1 font-medium text-surface-900">{product.itemPN || product.flavor}</h3>
          
          <div className="mb-2">
            <span className="text-xs text-surface-500">{product.strength}mg • {product.count || 20} count</span>
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
          aria-label={`Add ${product.flavor} to cart`}
          tabIndex={0}
        >
          <ShoppingCart size={16} className="mr-2" />
          Add to cart
        </button>
      </div>
    </div>
  );
};

// Filter Sidebar component
const FilterSidebar = ({ isOpen, onClose, flavors, strengths, selectedFilters, onFilterChange }) => {
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
            tabIndex={0}
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
          tabIndex={0}
        >
          Reset Filters
        </button>
      </aside>
    </>
  );
};

const ProductListingPage = () => {
  // State for products from Firebase
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get cart functionality from hook
  const { addToCart } = useCart();

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsRef = collection(db, 'products');
        const q = query(productsRef, where('active', '==', true));
        const querySnapshot = await getDocs(q);
        
        const productsData = [];
        querySnapshot.forEach((doc) => {
          productsData.push({
            id: doc.id,
            ...doc.data(),
            rating: 5, // Default rating
            reviewCount: Math.floor(Math.random() * 50) + 5, // Random review count for demo
            count: 20 // Default count per package
          });
        });
        
        setProducts(productsData);
        console.log('Fetched products:', productsData);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter options
  const flavors = [...new Set(products.map(p => p.flavor))];
  const strengths = [...new Set(products.map(p => p.strength))];

  // State for filter sidebar on mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // State for selected filters
  const [selectedFilters, setSelectedFilters] = useState({
    flavors: [],
    strengths: [],
  });

  // State for sorting
  const [sortOption, setSortOption] = useState('best-selling');

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    if (filterType === 'reset') {
      setSelectedFilters({
        flavors: [],
        strengths: [],
      });
      return;
    }

    setSelectedFilters(prev => {
      const currentFilters = [...prev[filterType]];
      
      if (currentFilters.includes(value)) {
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
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  // Handle add to cart
  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.itemPN || product.flavor,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1
    });
  };

  // Filter products based on selected filters
  const filteredProducts = products.filter(product => {
    // If no flavor filters are selected, show all flavors
    const flavorMatch = selectedFilters.flavors.length === 0 || 
      selectedFilters.flavors.includes(product.flavor);
    
    // If no strength filters are selected, show all strengths
    const strengthMatch = selectedFilters.strengths.length === 0 || 
      selectedFilters.strengths.includes(product.strength);
    
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
            src="/images/banner.jpg" 
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
              tabIndex={0}
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

            {/* Loading state */}
            {loading && (
              <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-surface-300 border-t-primary-600"></div>
                <span className="ml-2 text-surface-600">Loading products...</span>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            {/* Product count */}
            {!loading && !error && (
              <p className="mb-6 text-sm text-surface-500">
                Showing {sortedProducts.length} products
              </p>
            )}

            {/* Products grid */}
            {!loading && !error && sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {sortedProducts.map(product => (
                  <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                ))}
              </div>
            ) : !loading && !error ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-surface-200 bg-white py-12">
                <SlidersHorizontal size={48} className="mb-4 text-surface-400" />
                <h3 className="mb-2 text-lg font-medium text-surface-900">No products found</h3>
                <p className="mb-6 text-center text-surface-500">Try adjusting your filters or search criteria.</p>
                <button
                  className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  onClick={() => handleFilterChange('reset')}
                  aria-label="Reset all filters"
                  tabIndex={0}
                >
                  Reset Filters
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;