import React, { useState } from 'react';
import { getBannerImagePath } from '../lib/imageUtils';

/**
 * BannerImage Component
 * 
 * A component for displaying banner images with optimized loading and fallbacks.
 * Based on Refactoring UI principles for creating visual hierarchy.
 */

interface BannerImageProps {
  src?: string;
  alt: string;
  className?: string;
  overlayClassName?: string;
  height?: 'small' | 'medium' | 'large';
  overlayContent?: React.ReactNode;
  index?: number;
}

const BannerImage: React.FC<BannerImageProps> = ({
  src,
  alt,
  className = '',
  overlayClassName = 'bg-black/40',
  height = 'medium',
  overlayContent,
  index,
}) => {
  const [loading, setLoading] = useState(true);
  const [, setError] = useState(false);
  
  // Get banner source - either provided or from the manifest
  const bannerSrc = src || getBannerImagePath(index);
  
  // Height classes based on design system
  const heightClasses = {
    small: 'h-32 sm:h-40 md:h-48',
    medium: 'h-48 sm:h-56 md:h-64',
    large: 'h-64 sm:h-72 md:h-80',
  };
  
  // Handle image loading
  const handleLoad = () => {
    setLoading(false);
  };
  
  // Handle image error
  const handleError = () => {
    setError(true);
    setLoading(false);
  };
  
  return (
    <div className={`relative overflow-hidden w-full ${heightClasses[height]} ${className}`}>
      {/* Loading skeleton */}
      {loading && (
        <div 
          className="absolute inset-0 bg-surface-200 animate-pulse"
          aria-hidden="true"
        />
      )}
      
      {/* Banner image */}
      <img
        src={bannerSrc}
        alt={alt}
        className={`
          w-full h-full object-cover
          transition-opacity duration-300
          ${loading ? 'opacity-0' : 'opacity-100'}
        `}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
      />
      
      {/* Overlay - darkens the image for better text contrast */}
      <div className={`absolute inset-0 ${overlayClassName}`} />
      
      {/* Overlay content (like text, buttons, etc.) */}
      {overlayContent && (
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            {overlayContent}
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerImage;