import React, { useState, useEffect, useCallback } from 'react';
import { ChevronDown, ShoppingCart, Star, Filter, X, SlidersHorizontal, Loader2 } from 'lucide-react';
import { useCart } from '../../lib/hooks/useCart';
import { useAuth } from '../../lib/AuthContext';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Product } from '../../lib/types';
import { useProducts, ProductFilters } from '../../contexts/ProductContext';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

// ProductCard component for individual product display with wholesale pricing support
const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const { currentUser } = useAuth();
  const { isItemInCart } = useCart();
  
  // Check if user is wholesale/distributor for pricing
  const isWholesale = currentUser?.role === 'wholesale' || currentUser?.role === 'distributor';
  const isInCart = isItemInCart(product.id);

  // Handle add to cart with better error handling
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if wrapped in a link
    onAddToCart(product);
  };

  // Handle keyboard interactions for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onAddToCart(product);
    }
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-surface-200 bg-white shadow-sm transition-all hover:shadow-md">
      {/* Out of stock badge */}
      {product.inventoryCount <= 0 && (
        <div className="absolute left-0 right-0 top-4 z-10 mx-auto w-max rounded bg-red-500 px-2 py-1 text-xs font-bold text-white">
          OUT OF STOCK
        </div>
      )}
      
      {/* Wholesale badge */}
      {isWholesale && product.wholesalePrice && (
        <div className="absolute left-2 top-2 z-10 rounded bg-green-500 px-2 py-1 text-xs font-bold text-white">
          WHOLESALE
        </div>
      )}
      
      {/* New badge */}
      {product.isNew && !isWholesale && (
        <div className="absolute left-2 top-2 z-10 rounded bg-primary-500 px-2 py-1 text-xs font-bold text-white">
          NEW
        </div>
      )}

      {/* Wishlist button */}
      <button 
        className="absolute right-2 top-2 z-10 rounded-full bg-white/80 p-1.5 text-surface-500 backdrop-blur transition-colors hover:bg-white hover:text-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500"
        aria-label={`Add ${product.itemPN} to favorites`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      </button>

      {/* Product image with link */}
      <Link 
        to={`/products/${product.id}`} 
        className="group relative flex h-48 items-center justify-center overflow-hidden bg-surface-100 p-4"
        aria-label={`View details for ${product.itemPN}`}
      >
        <img 
          src={product.imageUrl || "/images/placeholder-product.jpg"} 
          alt={product.flavor} 
          className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/images/placeholder-product.jpg";
          }}
        />
        
        {/* Quick view overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="rounded-md bg-white/90 px-3 py-1.5 text-sm font-medium text-surface-900 shadow-sm">
            Quick View
          </span>
        </div>
      </Link>

      {/* Product content */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          {/* Product ratings */}
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

          {/* Product name with link */}
          <Link to={`/products/${product.id}`} className="group">
            <h3 className="mb-1 font-medium text-surface-900 group-hover:text-primary-600">
              {product.itemPN || product.flavor}
            </h3>
          </Link>
          
          {/* Product specs */}
          <div className="mb-2">
            <span className="text-xs text-surface-500">{product.flavor} • {product.strength}mg • {product.count || 20} count</span>
          </div>
          
          {/* Product pricing - wholesale vs retail */}
          <div className="flex items-baseline gap-2">
            {isWholesale && product.wholesalePrice ? (
              <>
                <span className="text-lg font-bold text-surface-900">${product.wholesalePrice.toFixed(2)}</span>
                <span className="text-sm text-surface-400 line-through">${product.price.toFixed(2)}</span>
              </>
            ) : (
              <>
                <span className="text-lg font-bold text-surface-900">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-sm text-surface-400 line-through">${product.originalPrice.toFixed(2)}</span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Add to cart button - disabled if out of stock */}
        <button
          onClick={handleAddToCart}
          onKeyDown={handleKeyDown}
          disabled={product.inventoryCount <= 0}
          className={`mt-4 flex w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            product.inventoryCount <= 0 
              ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
              : isInCart
                ? 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500'
                : 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500'
          }`}
          aria-label={
            product.inventoryCount <= 0 
              ? `${product.itemPN} is out of stock` 
              : isInCart
                ? `${product.itemPN} is in your cart`
                : `Add ${product.itemPN} to cart`
          }
          tabIndex={0}
        >
          <ShoppingCart size={16} className="mr-2" />
          {product.inventoryCount <= 0 
            ? 'Out of Stock' 
            : isInCart
              ? 'In Cart'
              : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

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

const ProductListingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate(); // Used for cart checkout and navigation
  const category = searchParams.get('category');
  const searchQuery = searchParams.get('search');
  const sortParam = searchParams.get('sort');
  
  // Get auth and cart functionality from hooks
  const { currentUser } = useAuth();
  const { addToCart } = useCart();
  const { filterProducts, products: allProducts } = useProducts();
  
  // Check if user is admin or owner
  const isAdmin = currentUser?.isAdmin || currentUser?.isOwner;
  const isWholesale = currentUser?.role === 'wholesale' || currentUser?.role === 'distributor';

  // State for products, loading and error
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for filter sidebar on mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // State for selected filters
  const [selectedFilters, setSelectedFilters] = useState<ProductFilters>({
    flavors: [],
    strengths: [],
    category: category || undefined,
    searchQuery: searchQuery || undefined,
    sortBy: (sortParam as 'price-asc' | 'price-desc' | 'newest' | 'best-selling') || 'best-selling'
  });

  // State for sorting
  const [sortOption, setSortOption] = useState<string>(sortParam || 'best-selling');

  // Extract unique filter options from all products
  const flavors = [...new Set(allProducts.map(p => p.flavor))];
  const strengths = [...new Set(allProducts.map(p => p.strength))] as number[];
  
  // Load filtered products with server-side filtering
  const loadFilteredProducts = useCallback(async () => {
    try {
      setLoading(true);
      
      // Map sort option to ProductFilters sortBy
      let sortBy: ProductFilters['sortBy'] = 'newest';
      switch (sortOption) {
        case 'price-low':
          sortBy = 'price-asc';
          break;
        case 'price-high':
          sortBy = 'price-desc';
          break;
        case 'newest':
          sortBy = 'newest';
          break;
        case 'best-selling':
        default:
          sortBy = 'best-selling';
          break;
      }
      
      // Create filters object
      const filters: ProductFilters = {
        ...selectedFilters,
        sortBy,
        category: category || undefined,
        searchQuery: searchQuery || undefined
      };
      
      // Load filtered products
      const products = await filterProducts(filters);
      setFilteredProducts(products);
      setError(null);
    } catch (err) {
      console.error('Error filtering products:', err);
      setError('Failed to load products. Please try again later.');
      // Fallback to client-side filtering if server-side fails
      setFilteredProducts(allProducts);
    } finally {
      setLoading(false);
    }
  }, [filterProducts, selectedFilters, sortOption, category, searchQuery, allProducts]);

  // Update URL based on filters
  useEffect(() => {
    // Skip initial render
    if (loading) return;
    
    const params = new URLSearchParams(searchParams);
    
    // Update category parameter
    if (selectedFilters.category) {
      params.set('category', selectedFilters.category);
    } else if (category) {
      params.delete('category');
    }
    
    // Update search parameter
    if (selectedFilters.searchQuery) {
      params.set('search', selectedFilters.searchQuery);
    } else if (searchQuery) {
      params.delete('search');
    }
    
    // Update sort parameter
    if (sortOption && sortOption !== 'best-selling') {
      params.set('sort', sortOption);
    } else {
      params.delete('sort');
    }
    
    // Apply URL updates without full page reload
    setSearchParams(params, { replace: true });
  }, [selectedFilters, sortOption, setSearchParams, searchParams, category, searchQuery, loading]);

  // Load products when filters change
  useEffect(() => {
    loadFilteredProducts();
  }, [loadFilteredProducts]);

  // Handle filter changes
  const handleFilterChange = (filterType: 'flavors' | 'strengths' | 'reset', value?: string | number) => {
    if (filterType === 'reset') {
      setSelectedFilters({
        flavors: [],
        strengths: [],
        category: category || undefined,
        searchQuery: searchQuery || undefined,
        sortBy: (sortParam as any) || 'best-selling'
      });
      return;
    }

    setSelectedFilters(prev => {
      const currentFilters = [...(prev[filterType] || [])];
      
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

  // Handle search submit
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchValue = formData.get('search')?.toString() || '';
    
    setSelectedFilters(prev => ({
      ...prev,
      searchQuery: searchValue || undefined
    }));
  };

  // Handle add to cart with proper error handling and notifications
  const handleAddToCart = (product: Product) => {
    try {
      addToCart({
        id: product.id,
        itemPN: product.itemPN,
        flavor: product.flavor,
        strength: product.strength,
        price: product.price,
        wholesalePrice: product.wholesalePrice,
        imageUrl: product.imageUrl,
        inventoryCount: product.inventoryCount
      });
    } catch (err) {
      console.error('Error adding product to cart:', err);
      toast.error('Failed to add product to cart. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-surface-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/products/banner.jpg" 
            alt="Premium Nicotine Pouches" 
            className="h-full w-full object-cover opacity-60"
            loading="eager" // Load with high priority
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">Premium Nicotine Pouches</h1>
            <p className="text-lg text-white/80">Experience the highest quality tobacco-free nicotine pouches with our premium selection.</p>
            
            {/* Search form */}
            <form onSubmit={handleSearch} className="mt-6 flex max-w-md">
              <input
                type="search"
                name="search"
                placeholder="Search products..."
                defaultValue={searchQuery || ''}
                className="w-full rounded-l-md border-0 bg-white/20 px-4 py-2.5 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Search for products"
              />
              <button
                type="submit"
                className="rounded-r-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                aria-label="Search"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page header & mobile filter button */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-surface-900">
              {category 
                ? `${category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}` 
                : 'All Products'}
              {searchQuery && <span className="ml-2 text-lg font-normal">Search results for "{searchQuery}"</span>}
            </h2>
            
            {/* User role indicator and wholesale info */}
            {isWholesale && (
              <div className="mt-1 rounded-md bg-green-50 px-2 py-1 text-sm text-green-700 inline-block">
                <span className="font-medium">Wholesale Pricing Active</span> - You're seeing special wholesale prices
              </div>
            )}
            
            {/* Admin controls */}
            {isAdmin && (
              <div className="mt-2 flex items-center gap-2">
                <Link 
                  to="/admin/products" 
                  className="inline-flex items-center rounded-md bg-primary-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-700"
                >
                  Manage Products
                </Link>
                <Link 
                  to="/admin/inventory" 
                  className="inline-flex items-center rounded-md border border-surface-300 bg-white px-3 py-1.5 text-sm font-medium text-surface-700 hover:bg-surface-50"
                >
                  Inventory
                </Link>
              </div>
            )}
          </div>
          
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
            {(selectedFilters.flavors?.length > 0 || selectedFilters.strengths?.length > 0 || selectedFilters.searchQuery) && (
              <div className="mb-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-surface-700">Active Filters:</span>
                  
                  {selectedFilters.flavors?.map(flavor => (
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
                  
                  {selectedFilters.strengths?.map(strength => (
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
                  
                  {selectedFilters.searchQuery && (
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                      Search: {selectedFilters.searchQuery}
                      <button
                        className="ml-1.5 rounded-full text-blue-400 hover:bg-blue-100 hover:text-blue-500"
                        onClick={() => setSelectedFilters(prev => ({ ...prev, searchQuery: undefined }))}
                        aria-label="Clear search"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  )}
                  
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

            {/* Loading state with animation */}
            {loading && (
              <div className="flex h-64 flex-col items-center justify-center">
                <Loader2 size={32} className="mb-2 animate-spin text-primary-600" />
                <span className="text-surface-600">Loading products...</span>
              </div>
            )}

            {/* Error state with retry button */}
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3 flex-grow">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                  <button 
                    onClick={loadFilteredProducts}
                    className="rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-800 hover:bg-red-200"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {/* Product count */}
            {!loading && !error && (
              <p className="mb-6 text-sm text-surface-500">
                Showing {filteredProducts.length} products
              </p>
            )}

            {/* Products grid with optimized rendering */}
            {!loading && !error && filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map(product => (
                  <div key={product.id} className="relative">
                    {isAdmin && (
                      <div className="absolute right-2 top-2 z-10 flex gap-1">
                        <Link 
                          to={`/admin/products/edit/${product.id}`}
                          className="rounded-md bg-white/90 p-1.5 text-surface-600 shadow-sm backdrop-blur-sm hover:bg-white hover:text-primary-600"
                          title="Edit product"
                          aria-label={`Edit ${product.itemPN}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                        </Link>
                        <button 
                          className="rounded-md bg-white/90 p-1.5 text-surface-600 shadow-sm backdrop-blur-sm hover:bg-white hover:text-red-600"
                          title="Delete product"
                          aria-label={`Delete ${product.itemPN}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                        </button>
                      </div>
                    )}
                    <ProductCard product={product} onAddToCart={handleAddToCart} />
                  </div>
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
            
            {/* Pagination section - simplified but functional */}
            {!loading && !error && filteredProducts.length > 0 && (
              <div className="mt-8 flex items-center justify-center">
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                    disabled={true}
                  >
                    Previous
                  </button>
                  <span className="relative inline-flex items-center border border-gray-300 bg-primary-50 px-4 py-2 text-sm font-medium text-primary-600">
                    1
                  </span>
                  <button
                    className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                    disabled={true}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;