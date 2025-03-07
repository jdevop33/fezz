import React, { useState } from 'react';
import { Star, Minus, Plus, ChevronRight, Truck, Shield, CircleCheck, ShoppingCart, Heart } from 'lucide-react';

interface ProductVariant {
  strength: number;
  label: string;
  inStock: boolean;
  current?: boolean;
}

interface RelatedProduct {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  rating: number;
  reviewCount: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  flavor: string;
  category?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  strength: number;
  count: number;
  features: string[];
  images: string[];
  variants: ProductVariant[];
  relatedProducts: RelatedProduct[];
}

const ProductDetail = () => {
  // Mock product data
  const product: Product = {
    id: 1,
    name: 'PUXX Peppermint Strong',
    description: 'Experience the fresh cooling sensation of premium peppermint with PUXX Strong. These tobacco-free nicotine pouches deliver a powerful and satisfying experience with a clean, refreshing flavor that lasts longer.',
    flavor: 'Peppermint',
    price: 24.99,
    originalPrice: 29.99,
    rating: 4.8,
    reviewCount: 42,
    strength: 16,
    count: 20,
    features: [
      'Tobacco-free nicotine pouches',
      '16mg strength for experienced users',
      'Long-lasting flavor and satisfaction',
      'Discreet white pouches - no staining',
      'Fresh peppermint cooling sensation'
    ],
    images: [
      '/api/placeholder/600/600',
      '/api/placeholder/600/600',
      '/api/placeholder/600/600',
      '/api/placeholder/600/600'
    ],
    variants: [
      { strength: 6, label: 'Light (6mg)', inStock: true },
      { strength: 12, label: 'Regular (12mg)', inStock: true },
      { strength: 16, label: 'Strong (16mg)', inStock: true, current: true },
      { strength: 22, label: 'Extra Strong (22mg)', inStock: false }
    ],
    relatedProducts: [
      { id: 2, name: 'PUXX Cool Mint Strong', price: 24.99, imageUrl: '/api/placeholder/200/200', rating: 4.5, reviewCount: 28 },
      { id: 3, name: 'PUXX Apple Mint Strong', price: 24.99, imageUrl: '/api/placeholder/200/200', rating: 4.7, reviewCount: 35 },
      { id: 4, name: 'PUXX Cherry Strong', price: 24.99, imageUrl: '/api/placeholder/200/200', rating: 4.3, reviewCount: 19 }
    ]
  };

  // State
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [readMore, setReadMore] = useState(false);

  // Handlers
  const handleAddToCart = () => {
    console.log('Added to cart:', product.name, 'Quantity:', quantity);
  };

  const handleQuantityChange = (value: number) => {
    const newQuantity = Math.max(1, Math.min(10, quantity + value));
    setQuantity(newQuantity);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleAddToCart();
    }
  };

  return (
    <div className="bg-white">
      {/* Breadcrumbs */}
      <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <ol className="flex items-center space-x-1 text-sm">
          <li>
            <a href="#" className="text-surface-500 hover:text-primary-600">Home</a>
          </li>
          <li className="flex items-center">
            <ChevronRight size={12} className="mx-1 text-surface-400" />
            <a href="#" className="text-surface-500 hover:text-primary-600">Products</a>
          </li>
          <li className="flex items-center">
            <ChevronRight size={12} className="mx-1 text-surface-400" />
            <a href="#" className="text-surface-500 hover:text-primary-600">Nicotine Pouches</a>
          </li>
          <li className="flex items-center">
            <ChevronRight size={12} className="mx-1 text-surface-400" />
            <span className="font-medium text-surface-900">{product.name}</span>
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
                src={product.images[selectedImage]}
                alt={product.name}
                className="h-full w-full object-cover object-center"
              />
            </div>
            
            {/* Image thumbnails */}
            <div className="mt-4 grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`overflow-hidden rounded-md ${
                    selectedImage === index 
                      ? 'ring-2 ring-primary-500' 
                      : 'ring-1 ring-surface-200'
                  }`}
                  aria-label={`View image ${index + 1} of product`}
                  tabIndex="0"
                >
                  <img
                    src={image}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="h-16 w-full object-cover object-center"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product details */}
          <div>
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-surface-900 sm:text-3xl">{product.name}</h1>
              </div>
              
              {/* Rating */}
              <div className="mt-2 flex items-center">
                <div className="flex text-warning-400">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      fill={i < Math.floor(product.rating) ? "currentColor" : "none"} 
                      className={i < Math.floor(product.rating) ? "text-warning-400" : "text-surface-300"} 
                    />
                  ))}
                </div>
                <p className="ml-2 text-sm text-surface-700">
                  <span>{product.rating}</span>
                  <span className="mx-1">·</span>
                  <a href="#reviews" className="hover:text-primary-600">
                    {product.reviewCount} reviews
                  </a>
                </p>
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-end">
                <p className="text-2xl font-bold text-surface-900">${product.price.toFixed(2)}</p>
                {product.originalPrice && (
                  <p className="ml-2 text-base text-surface-500 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </p>
                )}
              </div>
              <p className="mt-1 text-sm text-success-600">In stock and ready to ship</p>
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className={`text-surface-600 ${!readMore && 'line-clamp-3'}`}>
                {product.description}
              </p>
              <button 
                onClick={() => setReadMore(!readMore)}
                className="mt-2 text-sm font-medium text-primary-600 hover:text-primary-700"
                aria-label={readMore ? "Show less details" : "Show more details"}
                tabIndex="0"
              >
                {readMore ? 'Show less' : 'Show more'}
              </button>
            </div>

            {/* Strength variants */}
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-medium text-surface-900">Strength</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {product.variants.map((variant) => (
                  <button
                    key={variant.strength}
                    className={`flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                      variant.current
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : variant.inStock
                        ? 'border-surface-200 bg-white text-surface-900 hover:bg-surface-50'
                        : 'cursor-not-allowed border-surface-200 bg-surface-50 text-surface-400'
                    }`}
                    disabled={!variant.inStock}
                    aria-label={`Select ${variant.label} ${!variant.inStock ? '(Out of stock)' : ''}`}
                    tabIndex={variant.inStock ? "0" : "-1"}
                  >
                    {variant.label}
                    {!variant.inStock && <span className="ml-1">(Out of stock)</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity selector */}
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-medium text-surface-900">Quantity</h3>
              <div className="flex items-center">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="flex h-10 w-10 items-center justify-center rounded-l-md border border-r-0 border-surface-300 bg-surface-50 text-surface-600 hover:bg-surface-100"
                  aria-label="Decrease quantity"
                  tabIndex="0"
                >
                  <Minus size={16} />
                </button>
                <input
                  type="text"
                  value={quantity}
                  readOnly
                  className="h-10 w-16 border-y border-surface-300 bg-white text-center text-surface-900"
                  aria-label="Product quantity"
                />
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="flex h-10 w-10 items-center justify-center rounded-r-md border border-l-0 border-surface-300 bg-surface-50 text-surface-600 hover:bg-surface-100"
                  aria-label="Increase quantity"
                  tabIndex="0"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Add to cart button */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row">
              <button
                onClick={handleAddToCart}
                onKeyDown={handleKeyDown}
                className="flex-1 rounded-md bg-primary-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                aria-label="Add to cart"
                tabIndex="0"
              >
                <ShoppingCart size={20} className="mr-2 inline" />
                Add to Cart
              </button>
              <button
                className="flex items-center justify-center rounded-md border border-surface-300 bg-white px-6 py-3 text-base font-medium text-surface-700 shadow-sm hover:bg-surface-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                aria-label="Save to wishlist"
                tabIndex="0"
              >
                <Heart size={20} className="mr-2" />
                Save
              </button>
            </div>

            {/* Features */}
            <div className="border-t border-surface-200 pt-6">
              <h3 className="mb-4 text-sm font-medium text-surface-900">Features</h3>
              <ul className="space-y-3">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CircleCheck size={18} className="mr-2 mt-0.5 text-primary-600" />
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
        <div className="mt-16 border-t border-surface-200 pt-10">
          <h2 className="text-xl font-bold text-surface-900">Customers also bought</h2>
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {product.relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="group relative">
                <div className="overflow-hidden rounded-lg bg-surface-100">
                  <img
                    src={relatedProduct.imageUrl}
                    alt={relatedProduct.name}
                    className="h-48 w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-surface-900">{relatedProduct.name}</h3>
                  <div className="mt-1 flex items-center">
                    <div className="flex text-warning-400">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={12} 
                          fill={i < Math.floor(relatedProduct.rating) ? "currentColor" : "none"} 
                          className={i < Math.floor(relatedProduct.rating) ? "text-warning-400" : "text-surface-300"} 
                        />
                      ))}
                    </div>
                    <p className="ml-1 text-xs text-surface-500">({relatedProduct.reviewCount})</p>
                  </div>
                  <p className="mt-1 font-medium text-surface-900">${relatedProduct.price.toFixed(2)}</p>
                </div>
                <button
                  className="mt-2 w-full rounded-md bg-primary-100 py-2 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  aria-label={`View ${relatedProduct.name}`}
                  tabIndex="0"
                >
                  View Product
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;