import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { Product } from '../../lib/types';
import ProductImage from './ProductImage';

/**
 * ProductCard Component
 * 
 * A reusable card component for displaying product information
 * based on Refactoring UI principles:
 * - Establish visual hierarchy
 * - Create depth with shadows and layering
 * - Pay attention to small details
 */

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isWholesale?: boolean;
  isInCart?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  isWholesale = false,
  isInCart = false,
}) => {
  // Handle add to cart
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    onAddToCart(product);
  };

  // Format price display with appropriate currency symbol
  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-surface-200 bg-white shadow-sm transition-all hover:shadow-md">
      {/* Status badges */}
      <div className="absolute left-0 top-0 z-10 p-2 space-y-1">
        {/* Out of stock badge */}
        {product.inventoryCount <= 0 && (
          <div className="rounded bg-red-500 px-2 py-1 text-xs font-bold text-white shadow-sm">
            OUT OF STOCK
          </div>
        )}
        
        {/* Wholesale badge */}
        {isWholesale && product.wholesalePrice && (
          <div className="rounded bg-green-500 px-2 py-1 text-xs font-bold text-white shadow-sm">
            WHOLESALE
          </div>
        )}
        
        {/* New badge */}
        {product.isNew && !isWholesale && (
          <div className="rounded bg-primary-500 px-2 py-1 text-xs font-bold text-white shadow-sm">
            NEW
          </div>
        )}
      </div>

      {/* Wishlist button */}
      <button 
        className="absolute right-2 top-2 z-10 rounded-full bg-white/80 p-1.5 text-surface-500 shadow-sm backdrop-blur transition-colors hover:bg-white hover:text-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500"
        aria-label={`Add ${product.itemPN} to favorites`}
      >
        <Heart size={18} />
      </button>

      {/* Product image with link */}
      <Link 
        to={`/products/${product.id}`} 
        className="group relative flex items-center justify-center overflow-hidden p-4"
        aria-label={`View details for ${product.itemPN}`}
      >
        <ProductImage 
          src={product.imageUrl} 
          alt={product.flavor || product.itemPN}
          size="medium"
          aspectRatio="1:1"
          flavor={product.flavor}
          strength={product.strength}
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
            <h3 className="mb-1 font-medium text-surface-900 group-hover:text-primary-600 line-clamp-2">
              {product.itemPN || product.flavor}
              {product.strength && <span className="font-bold ml-1">{product.strength}mg</span>}
            </h3>
          </Link>
          
          {/* Product specs */}
          <div className="mb-2">
            <span className="text-xs text-surface-500">
              {product.flavor} • {product.strength}mg 
              {product.count && ` • ${product.count} count`}
            </span>
          </div>
          
          {/* Product pricing - wholesale vs retail */}
          <div className="flex items-baseline gap-2">
            {isWholesale && product.wholesalePrice ? (
              <>
                <span className="text-lg font-bold text-surface-900">{formatPrice(product.wholesalePrice)}</span>
                <span className="text-sm text-surface-400 line-through">{formatPrice(product.price)}</span>
              </>
            ) : (
              <>
                <span className="text-lg font-bold text-surface-900">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-sm text-surface-400 line-through">{formatPrice(product.originalPrice)}</span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Add to cart button - disabled if out of stock */}
        <button
          onClick={handleAddToCart}
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

export default ProductCard;