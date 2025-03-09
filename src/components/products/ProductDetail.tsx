import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Minus, Plus, ChevronRight, Truck, Shield, CheckCircle, ShoppingCart, Heart, Edit, Trash } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { db } from '../../lib/firebase';
import { useCart } from '../../lib/hooks';
import { useAuth } from '../../lib/hooks';
import { getUser } from '../../lib/pouchesDb';

// Import the actual Product type from types.ts
import type { Product as ProductType } from '../../lib/types';

// Extend the imported type to add any UI-specific properties
interface Product extends Partial<ProductType> {
  id: string;
  flavor: string;
  strength: number;
  price: number;
  // UI specific fields that might not be in the database
  originalPrice?: number;
  isNew?: boolean;
  wholesalePrice?: number;
}

interface RelatedProduct {
  id: string;
  flavor: string;
  strength: number;
  price: number;
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
  category?: string;
  inventoryCount?: number;
}

// Interface for product variants - uncomment when needed
/*
interface ProductVariant {
  strength: number;
  label: string;
  inStock: boolean;
  current?: boolean;
}
*/

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addToCart, updateQuantity } = useCart();
  const { currentUser } = useAuth();
  
  // State
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin or owner
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (currentUser) {
        try {
          const userDoc = await getUser(currentUser.uid);
          setIsAdmin(userDoc?.isAdmin === true || userDoc?.isOwner === true);
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };
    
    checkAdminStatus();
  }, [currentUser]);

  // State
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [readMore, setReadMore] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      
      try {
        setLoading(true);
        
        const docRef = doc(db, 'products', productId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const productData = { id: docSnap.id, ...docSnap.data() } as Product;
          setProduct(productData);
          
          // Fetch related products with same category
          // In production, you'd use a query with where() to get related products
          // For demonstration purposes we're using dummy data
          const dummyRelated = [
            { 
              id: 'cherry-6mg', 
              flavor: 'Cherry',
              strength: 6,
              price: 24.99, 
              imageUrl: '/images/products/cherry-6mg.jpg', 
              rating: 4.5, 
              reviewCount: 28,
              category: 'nicotine-pouches'
            },
            { 
              id: 'apple-mint-12mg', 
              flavor: 'Apple mint',
              strength: 12,
              price: 24.99, 
              imageUrl: '/images/products/apple-mint-12mg.jpg', 
              rating: 4.7, 
              reviewCount: 35,
              category: 'nicotine-pouches'
            },
            { 
              id: 'cola-16mg', 
              flavor: 'Cola',
              strength: 16,
              price: 24.99, 
              imageUrl: '/images/products/cola-16mg.jpg', 
              rating: 4.3, 
              reviewCount: 19,
              category: 'nicotine-pouches'
            }
          ];
          
          setRelatedProducts([...dummyRelated, productData]);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Get strengths for this flavor
  const strengthVariants = product ? relatedProducts
    .filter(p => p.flavor === product.flavor)
    .map(p => ({
      strength: p.strength,
      label: `${p.strength === 6 ? 'Light' : p.strength === 12 ? 'Regular' : p.strength === 16 ? 'Strong' : 'Extra Strong'} (${p.strength}mg)`,
      inStock: p.inventoryCount !== undefined ? p.inventoryCount > 0 : true,
      current: p.id === productId
    }))
    .sort((a, b) => a.strength - b.strength) : [];

  // Handlers
  const handleAddToCart = () => {
    if (!product) return;
    
    // Check if product is in stock
    if (product.inventoryCount !== undefined && product.inventoryCount <= 0) {
      toast.error('This product is currently out of stock');
      return;
    }
    
    // First add the base item - we use the "name" property as expected by the addToCart function
    // Note: product.itemPN is mapped to "name" parameter which is what the cart expects
    addToCart({
      id: product.id,
      name: product.itemPN || `${product.flavor} ${product.strength}mg`,
      price: product.price,
      imageUrl: product.imageUrl,
      flavor: product.flavor,
      strength: product.strength,
      category: product.category,
      inventoryCount: product.inventoryCount,
      description: product.description,
      wholesalePrice: product.wholesalePrice || product.price * 0.8
    });
    
    // Set the proper quantity if more than 1
    if (quantity > 1) {
      // Short timeout to ensure the item is added before updating quantity
      setTimeout(() => {
        updateQuantity(product.id, quantity);
      }, 100);
    }
  };

  const handleQuantityChange = (value: number) => {
    // Get maximum available based on inventory (default to 10 if not specified)
    const maxAvailable = product?.inventoryCount !== undefined
      ? Math.min(10, product.inventoryCount) 
      : 10;
      
    // Ensure quantity stays between 1 and maxAvailable
    const newQuantity = Math.max(1, Math.min(maxAvailable, quantity + value));
    
    if (newQuantity !== quantity) {
      setQuantity(newQuantity);
      
      // Show feedback if we hit a limit
      if (newQuantity === maxAvailable && value > 0) {
        toast.info(`Maximum quantity of ${maxAvailable} reached`);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleAddToCart();
    }
  };

  const handleStrengthChange = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  // Generate product features based on product data
  const getProductFeatures = () => {
    if (!product) return [];
    
    return [
      'Tobacco-free nicotine pouches',
      `${product.strength}mg strength ${product.strength > 12 ? 'for experienced users' : 'for casual users'}`,
      'Long-lasting flavor and satisfaction',
      'Discreet white pouches - no staining',
      `Fresh ${product.flavor.toLowerCase()} sensation`
    ];
  };

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary-600 border-t-transparent"></div>
        <span className="ml-3 text-surface-700">Loading product details...</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error || 'Product not found'}</h3>
              <div className="mt-4">
                <Link to="/products" className="rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-200">
                  Return to Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Product images
  const productImages = [
    product.imageUrl,
    product.imageUrl,
    product.imageUrl,
    product.imageUrl
  ].filter(Boolean) as string[];

  return (
    <div className="bg-white">
      {/* Breadcrumbs */}
      <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <ol className="flex items-center space-x-1 text-sm">
          <li>
            <Link to="/" className="text-surface-500 hover:text-primary-600">Home</Link>
          </li>
          <li className="flex items-center">
            <ChevronRight size={12} className="mx-1 text-surface-400" />
            <Link to="/products" className="text-surface-500 hover:text-primary-600">Products</Link>
          </li>
          <li className="flex items-center">
            <ChevronRight size={12} className="mx-1 text-surface-400" />
            <Link to="/products" className="text-surface-500 hover:text-primary-600">Nicotine Pouches</Link>
          </li>
          <li className="flex items-center">
            <ChevronRight size={12} className="mx-1 text-surface-400" />
            <span className="font-medium text-surface-900">{product.flavor} {product.strength}mg</span>
          </li>
        </ol>
      </nav>

      {/* Product section */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          {/* Product images */}
          <div className="mb-8 lg:mb-0">
            <div className="overflow-hidden rounded-lg bg-surface-100">
              <img
                src={productImages[selectedImage] || '/images/products/image.svg'}
                alt={product.flavor}
                className="h-full w-full object-cover object-center"
              />
            </div>
            
            {/* Image thumbnails */}
            {productImages.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-4">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`overflow-hidden rounded-md ${
                      selectedImage === index 
                        ? 'ring-2 ring-primary-500' 
                        : 'ring-1 ring-surface-200'
                    }`}
                    aria-label={`View image ${index + 1} of product`}
                    tabIndex={0}
                  >
                    <img
                      src={image}
                      alt={`${product.flavor} thumbnail ${index + 1}`}
                      className="h-16 w-full object-cover object-center"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product details */}
          <div>
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-surface-900 sm:text-3xl">{product.flavor} {product.strength}mg</h1>
                
                {/* Admin controls */}
                {isAdmin && (
                  <div className="flex items-center gap-2">
                    <Link 
                      to={`/admin/products/edit/${product.id}`}
                      className="rounded-md bg-primary-600 p-2 text-white hover:bg-primary-700"
                      title="Edit product"
                    >
                      <Edit size={16} />
                    </Link>
                    <button 
                      className="rounded-md bg-surface-200 p-2 text-surface-700 hover:bg-red-100 hover:text-red-600"
                      title="Delete product"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                )}
              </div>
              
              {/* Rating */}
              <div className="mt-2 flex items-center">
                <div className="flex text-warning-400">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      fill={i < Math.floor(product.rating || 4.5) ? "currentColor" : "none"} 
                      className={i < Math.floor(product.rating || 4.5) ? "text-warning-400" : "text-surface-300"} 
                    />
                  ))}
                </div>
                <p className="ml-2 text-sm text-surface-700">
                  <span>{product.rating || 4.5}</span>
                  <span className="mx-1">·</span>
                  <a href="#reviews" className="hover:text-primary-600">
                    {product.reviewCount || 42} reviews
                  </a>
                </p>
              </div>
            </div>

            {/* Price - Enhanced with better visual hierarchy */}
            <div className="mb-8 relative overflow-hidden rounded-lg bg-gradient-to-br from-surface-50 to-surface-100 p-4 border border-surface-200 shadow-sm">
              <div className="flex flex-col">
                <div className="flex items-end gap-2 mb-1">
                  <p className="text-3xl font-extrabold tracking-tight text-surface-900">${product.price.toFixed(2)}</p>
                  {product.originalPrice && (
                    <div className="flex items-center space-x-2">
                      <p className="text-base text-surface-500 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </p>
                      <span className="inline-flex items-center rounded-full bg-success-100 px-2.5 py-0.5 text-xs font-medium text-success-700">
                        Save ${(product.originalPrice - product.price).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 mt-2">
                  {product.inventoryCount === undefined || product.inventoryCount > 10 ? (
                    <div className="flex items-center text-success-600">
                      <div className="mr-1.5 h-2 w-2 rounded-full bg-success-500"></div>
                      <p className="text-sm font-medium">In stock and ready to ship</p>
                    </div>
                  ) : product.inventoryCount > 0 ? (
                    <div className="flex items-center text-amber-600">
                      <div className="mr-1.5 h-2 w-2 rounded-full bg-amber-500"></div>
                      <p className="text-sm font-medium">Low stock ({product.inventoryCount} remaining)</p>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <div className="mr-1.5 h-2 w-2 rounded-full bg-red-500"></div>
                      <p className="text-sm font-medium">Out of stock</p>
                    </div>
                  )}
                  
                  {isAdmin && (
                    <span className="ml-auto rounded-full bg-surface-200 px-2.5 py-0.5 text-xs font-medium text-surface-700 border border-surface-300">
                      Inventory: {product.inventoryCount || 0} units
                    </span>
                  )}
                </div>
              </div>
              
              {/* Decorative element for visual interest */}
              <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-primary-100 opacity-50"></div>
              <div className="absolute -left-6 -bottom-6 h-12 w-12 rounded-full bg-surface-200 opacity-40"></div>
            </div>

            {/* Description - Enhanced with better typography and visual interest */}
            <div className="mb-8 bg-surface-50 rounded-lg border border-surface-200 overflow-hidden">
              <div className="px-4 py-3 bg-gradient-to-r from-surface-100 to-surface-50 border-b border-surface-200">
                <h3 className="text-sm font-semibold text-surface-900">About This Product</h3>
              </div>
              
              <div className="p-4">
                <div className={`prose prose-surface max-w-none ${!readMore && 'line-clamp-3'}`}>
                  <p className="text-surface-700 leading-relaxed">
                    {product.description || `Experience the fresh sensation of premium ${product.flavor.toLowerCase()} with PUXX ${product.strength > 12 ? 'Strong' : 'Light'}. These tobacco-free nicotine pouches deliver a ${product.strength > 12 ? 'powerful' : 'satisfying'} experience with a clean, refreshing flavor that lasts longer.`}
                  </p>
                </div>
                
                <div className="mt-3 flex items-center">
                  <button 
                    onClick={() => setReadMore(!readMore)}
                    className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                    aria-label={readMore ? "Show less details" : "Show more details"}
                    tabIndex={0}
                  >
                    <span>{readMore ? 'Show less' : 'Show more'}</span>
                    <svg 
                      className={`ml-1 h-4 w-4 transform transition-transform duration-200 ${readMore ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Subtle badge indicating content */}
                  <span className="ml-auto inline-flex items-center rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700">
                    Product Details
                  </span>
                </div>
              </div>
            </div>

            {/* Strength variants */}
            {strengthVariants.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-medium text-surface-900">Strength</h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {strengthVariants.map((variant) => (
                    <button
                      key={variant.strength}
                      className={`flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                        variant.current
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : variant.inStock
                          ? 'border-surface-200 bg-white text-surface-900 hover:bg-surface-50'
                          : 'cursor-not-allowed border-surface-200 bg-surface-50 text-surface-400'
                      }`}
                      disabled={!variant.inStock || variant.current}
                      aria-label={`Select ${variant.label} ${!variant.inStock ? '(Out of stock)' : ''}`}
                      tabIndex={!variant.inStock || variant.current ? -1 : 0}
                      onClick={() => {
                        if (!variant.current && variant.inStock) {
                          // Find the product with this strength
                          const productWithStrength = relatedProducts.find(
                            p => p.flavor === product.flavor && p.strength === variant.strength
                          );
                          if (productWithStrength) {
                            handleStrengthChange(productWithStrength.id);
                          }
                        }
                      }}
                    >
                      {variant.label}
                      {!variant.inStock && <span className="ml-1">(Out of stock)</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity selector - Enhanced with better visuals and feedback */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-surface-900">Quantity</h3>
                <span className="text-xs text-surface-500 italic">Select how many pouches to add</span>
              </div>
              
              <div className="flex items-center">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="relative group flex h-12 w-12 items-center justify-center rounded-l-md border border-r-0 border-surface-300 bg-gradient-to-b from-white to-surface-50 text-surface-600 shadow-sm transition-all duration-150 hover:from-surface-50 hover:to-surface-100 hover:text-surface-800 active:to-surface-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Decrease quantity"
                  tabIndex={quantity <= 1 ? -1 : 0}
                >
                  <Minus size={18} className="transform transition-transform group-hover:scale-110 group-active:scale-95" />
                  {/* Subtle pill indicator for hover state */}
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-medium bg-surface-200 text-surface-600 px-1.5 py-0.5 rounded-full">
                    -1
                  </span>
                </button>
                
                <div className="relative group">
                  <input
                    type="text"
                    value={quantity}
                    readOnly
                    className="h-12 w-20 border-y border-surface-300 bg-white text-center text-lg font-medium text-surface-900 transition-all focus:border-primary-400 focus:ring-1 focus:ring-primary-400"
                    aria-label="Product quantity"
                  />
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="text-xs text-surface-500 bg-white px-2 py-1 rounded-md shadow-sm border border-surface-200">
                      Current quantity
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= (product?.inventoryCount !== undefined ? Math.min(10, product.inventoryCount) : 10)}
                  className="relative group flex h-12 w-12 items-center justify-center rounded-r-md border border-l-0 border-surface-300 bg-gradient-to-b from-white to-surface-50 text-surface-600 shadow-sm transition-all duration-150 hover:from-surface-50 hover:to-surface-100 hover:text-surface-800 active:to-surface-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Increase quantity"
                  tabIndex={quantity >= (product?.inventoryCount !== undefined ? Math.min(10, product.inventoryCount) : 10) ? -1 : 0}
                >
                  <Plus size={18} className="transform transition-transform group-hover:scale-110 group-active:scale-95" />
                  {/* Subtle pill indicator for hover state */}
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-medium bg-surface-200 text-surface-600 px-1.5 py-0.5 rounded-full">
                    +1
                  </span>
                </button>
              </div>
              
              {/* Maximum quantity indicator */}
              <div className="mt-2 flex justify-end">
                <span className="text-xs text-surface-500">
                  {product.inventoryCount !== undefined && 
                    `Maximum ${Math.min(10, product.inventoryCount)} per order`}
                </span>
              </div>
            </div>

            {/* Add to cart button - Enhanced with depth and visual interest */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row">
              <button
                onClick={handleAddToCart}
                onKeyDown={handleKeyDown}
                disabled={product?.inventoryCount !== undefined && product.inventoryCount <= 0}
                className={`relative flex-1 rounded-md px-6 py-3.5 text-base font-medium shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  product?.inventoryCount !== undefined && product.inventoryCount <= 0
                    ? 'bg-surface-300 text-surface-500 cursor-not-allowed'
                    : 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
                }`}
                aria-label={
                  product?.inventoryCount !== undefined && product.inventoryCount <= 0
                    ? 'Product out of stock'
                    : 'Add to cart'
                }
                tabIndex={product?.inventoryCount !== undefined && product.inventoryCount <= 0 ? -1 : 0}
              >
                <div className="flex items-center justify-center">
                  {product?.inventoryCount !== undefined && product.inventoryCount <= 0 ? (
                    <>
                      <Minus size={20} className="mr-2" />
                      <span>Out of Stock</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={20} className="mr-2" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </div>
                {/* Subtle decorative element for visual interest - only show for in-stock items */}
                {!(product?.inventoryCount !== undefined && product.inventoryCount <= 0) && (
                  <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-primary-400 opacity-70 animate-pulse"></div>
                )}
              </button>
              <button
                className="flex items-center justify-center rounded-md border border-surface-200 bg-white px-6 py-3.5 text-base font-medium text-surface-700 shadow-sm transition-all duration-150 hover:bg-surface-50 hover:border-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                aria-label="Save to wishlist"
                tabIndex={0}
              >
                <Heart size={20} className="mr-2 text-surface-500 group-hover:text-surface-700" />
                <span>Save</span>
              </button>
            </div>

            {/* Features */}
            <div className="border-t border-surface-200 pt-6">
              <h3 className="mb-4 text-sm font-medium text-surface-900">Features</h3>
              <ul className="space-y-3">
                {getProductFeatures().map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle size={18} className="mr-2 mt-0.5 text-primary-600" />
                    <span className="text-sm text-surface-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Shipping & returns */}
            <div className="mt-6 border-t border-surface-200 pt-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-start">
                  <Truck size={20} className="mr-3 text-surface-400" />
                  <div>
                    <h4 className="text-sm font-medium text-surface-900">Free shipping</h4>
                    <p className="mt-1 text-xs text-surface-500">For orders over $50</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Shield size={20} className="mr-3 text-surface-400" />
                  <div>
                    <h4 className="text-sm font-medium text-surface-900">Age verification required</h4>
                    <p className="mt-1 text-xs text-surface-500">Must be 21+ to purchase</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 1 && (
          <div className="mt-16 border-t border-surface-200 pt-10">
            <h2 className="text-xl font-bold text-surface-900">Customers also bought</h2>
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {relatedProducts
                .filter(p => p.id !== productId)
                .slice(0, 4)
                .map((relatedProduct) => (
                  <div key={relatedProduct.id} className="group relative">
                    <div className="overflow-hidden rounded-lg bg-surface-100">
                      <img
                        src={relatedProduct.imageUrl || '/images/products/image.svg'}
                        alt={relatedProduct.flavor}
                        className="h-48 w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-surface-900">
                        {relatedProduct.flavor} {relatedProduct.strength}mg
                      </h3>
                      <div className="mt-1 flex items-center">
                        <div className="flex text-warning-400">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={12} 
                              fill={i < Math.floor(relatedProduct.rating || 4.5) ? "currentColor" : "none"} 
                              className={i < Math.floor(relatedProduct.rating || 4.5) ? "text-warning-400" : "text-surface-300"} 
                            />
                          ))}
                        </div>
                        <p className="ml-1 text-xs text-surface-500">({relatedProduct.reviewCount || 15})</p>
                      </div>
                      <p className="mt-1 font-medium text-surface-900">${relatedProduct.price.toFixed(2)}</p>
                    </div>
                    <Link
                      to={`/products/${relatedProduct.id}`}
                      className="mt-2 block w-full rounded-md bg-primary-100 py-2 text-center text-sm font-medium text-primary-700 transition-colors hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      aria-label={`View ${relatedProduct.flavor} product`}
                    >
                      View Product
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;