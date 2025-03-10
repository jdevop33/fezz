import React, { useState, useEffect } from 'react';
import { getProductImagePath } from '../../lib/imageUtils';

/**
 * ProductImage Component
 * 
 * A component for displaying product images with optimized loading,
 * fallbacks, and proper sizing based on Refactoring UI principles.
 * 
 * Features:
 * - Lazy loading for performance
 * - Fallback handling for missing images
 * - Consistent aspect ratios
 * - Loading states with skeleton placeholders
 * - Error handling
 */

interface ProductImageProps {
  src?: string;
  alt: string;
  size?: 'thumbnail' | 'small' | 'medium' | 'large';
  className?: string;
  aspectRatio?: '1:1' | '4:3' | '16:9';
  objectFit?: 'cover' | 'contain';
  fallbackSrc?: string;
  flavor?: string;
  strength?: number;
}

const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  size = 'medium',
  className = '',
  aspectRatio = '1:1',
  objectFit = 'contain',
  fallbackSrc = '/images/products/placeholder.svg',
  flavor,
  strength,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Determine the image source - either provided directly or from flavor/strength
  const determinedSrc = src || (flavor && strength 
    ? getProductImagePath(flavor, strength, fallbackSrc)
    : fallbackSrc);
    
  const [imageSrc, setImageSrc] = useState(determinedSrc);

  // Reset states when determined source changes
  useEffect(() => {
    setLoading(true);
    setError(false);
    setImageSrc(determinedSrc);
  }, [determinedSrc]);

  // Size classes based on our Refactoring UI principles
  const sizeClasses = {
    thumbnail: 'h-20 w-20', // Small thumbnail for carts/lists
    small: 'h-32 w-32',     // Small square for compact product lists
    medium: 'h-64 w-full',  // Medium for product cards
    large: 'h-96 w-full',   // Large for product detail pages
  };

  // Aspect ratio classes
  const aspectRatioClasses = {
    '1:1': 'aspect-square',
    '4:3': 'aspect-4/3',
    '16:9': 'aspect-video',
  };

  // Handle image loading
  const handleLoad = () => {
    setLoading(false);
  };

  // Handle image loading error
  const handleError = () => {
    setError(true);
    setLoading(false);
    setImageSrc(fallbackSrc);
  };

  return (
    <div className={`relative overflow-hidden ${aspectRatioClasses[aspectRatio]} ${className}`}>
      {/* Loading skeleton */}
      {loading && (
        <div 
          className="absolute inset-0 bg-surface-200 animate-pulse"
          aria-hidden="true"
        />
      )}
      
      {/* Main image */}
      <img
        src={imageSrc}
        alt={alt}
        className={`
          ${sizeClasses[size]}
          ${objectFit === 'contain' ? 'object-contain' : 'object-cover'}
          transition-opacity duration-300
          ${loading ? 'opacity-0' : 'opacity-100'}
          ${error ? 'grayscale opacity-70' : ''}
        `}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
      />
      
      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-100/60 p-2 text-center">
          <span className="text-xs text-surface-600">Image unavailable</span>
        </div>
      )}
    </div>
  );
};

export default ProductImage;