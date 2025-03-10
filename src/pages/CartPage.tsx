import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ChevronLeft, ChevronRight, Plus, Minus, ShoppingBag, XCircle } from 'lucide-react';
import { useCart } from '../lib/hooks';
import { toast } from 'sonner';

const CartPage = () => {
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    subtotal,
    isEmpty
  } = useCart();

  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Calculate shipping, tax, and total
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.07; // 7% tax
  const total = subtotal + shipping + tax;

  // Handle quantity changes
  const handleQuantityChange = (productId: string, delta: number) => {
    const item = items.find(i => i.productId === productId);
    if (!item) return;
    
    const newQuantity = item.quantity + delta;
    if (newQuantity > 0 && newQuantity <= 10) {
      updateQuantity(productId, newQuantity);
    } else if (newQuantity <= 0) {
      removeFromCart(productId);
      toast.success('Item removed from cart');
    } else {
      toast.info('Maximum quantity is 10');
    }
  };

  // Handle remove from cart
  const handleRemove = (productId: string) => {
    removeFromCart(productId);
    toast.success('Item removed from cart');
  };

  // Handle apply coupon
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    
    setIsApplyingCoupon(true);
    
    // Simulate coupon API call
    setTimeout(() => {
      setIsApplyingCoupon(false);
      toast.error('Invalid coupon code');
    }, 1000);
  };

  // Handle checkout
  const handleCheckout = () => {
    // Redirect to checkout page
    navigate('/checkout');
  };

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="rounded-full bg-surface-100 p-6">
          <ShoppingBag size={48} className="text-surface-400" />
        </div>
        <h2 className="mt-6 text-2xl font-semibold text-surface-900">Your cart is empty</h2>
        <p className="mt-2 text-surface-600">Looks like you haven't added any products to your cart yet.</p>
        <Link
          to="/products"
          className="mt-8 rounded-md bg-primary-600 px-6 py-3 text-sm font-medium text-white hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-surface-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-surface-200 pb-4">
          <h1 className="text-2xl font-bold text-surface-900">Shopping Cart</h1>
          <button
            onClick={clearCart}
            className="flex items-center text-sm font-medium text-surface-500 hover:text-surface-700"
            title="Clear cart"
          >
            <Trash2 size={16} className="mr-1" />
            Clear Cart
          </button>
        </div>

        <div className="mt-8 lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Cart items */}
          <div className="lg:col-span-7">
            <ul className="divide-y divide-surface-200">
              {items.map((item) => (
                <li key={item.productId} className="flex py-6">
                  {/* Item image */}
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-surface-200 bg-white">
                    <img
                      src={item.product.imageUrl || '/images/products/placeholder.svg'}
                      alt={item.product.flavor}
                      className="h-full w-full object-contain object-center"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/products/placeholder.svg';
                      }}
                    />
                  </div>

                  {/* Item details */}
                  <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                    <div className="relative flex justify-between">
                      <div>
                        <h3 className="text-base font-medium text-surface-900">
                          <Link to={`/products/${item.productId}`} className="hover:text-primary-600">
                            {item.product.itemPN || `${item.product.flavor} ${item.product.strength}mg`}
                          </Link>
                        </h3>
                        <p className="mt-1 text-sm text-surface-500">{item.product.flavor} • {item.product.strength}mg</p>
                        <p className="mt-1 text-sm font-medium text-surface-900">${item.product.price.toFixed(2)} each</p>
                      </div>

                      {/* Remove button */}
                      <button
                        type="button"
                        className="ml-4 rounded-md p-1 text-surface-400 hover:bg-surface-100 hover:text-surface-500"
                        onClick={() => handleRemove(item.productId)}
                        title="Remove item"
                      >
                        <XCircle size={20} />
                      </button>
                    </div>

                    {/* Quantity controls */}
                    <div className="mt-4 flex items-center">
                      <label htmlFor={`quantity-${item.productId}`} className="mr-2 text-sm text-surface-600">
                        Qty:
                      </label>
                      <div className="flex items-center">
                        <button
                          type="button"
                          className="rounded-l-md border border-r-0 border-surface-300 bg-white p-2 text-surface-500 hover:bg-surface-50"
                          onClick={() => handleQuantityChange(item.productId, -1)}
                          title="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <input
                          id={`quantity-${item.productId}`}
                          type="text"
                          value={item.quantity}
                          readOnly
                          className="w-12 border-y border-surface-300 bg-white py-2 text-center text-sm text-surface-900"
                        />
                        <button
                          type="button"
                          className="rounded-r-md border border-l-0 border-surface-300 bg-white p-2 text-surface-500 hover:bg-surface-50"
                          onClick={() => handleQuantityChange(item.productId, 1)}
                          title="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="ml-auto text-base font-medium text-surface-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Continue shopping button */}
            <div className="mt-6">
              <Link
                to="/products"
                className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                <ChevronLeft size={16} className="mr-1" />
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order summary */}
          <div className="mt-8 rounded-lg border border-surface-200 bg-white p-6 shadow-sm lg:col-span-5 lg:mt-0">
            <h2 className="text-lg font-medium text-surface-900">Order Summary</h2>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-surface-600">Subtotal</p>
                <p className="text-sm font-medium text-surface-900">${subtotal.toFixed(2)}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-surface-600">Shipping</p>
                <p className="text-sm font-medium text-surface-900">${shipping.toFixed(2)}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-surface-600">Tax (estimated)</p>
                <p className="text-sm font-medium text-surface-900">${tax.toFixed(2)}</p>
              </div>
              <div className="border-t border-surface-200 pt-4">
                <div className="flex items-center justify-between">
                  <p className="text-base font-medium text-surface-900">Order total</p>
                  <p className="text-base font-medium text-surface-900">${total.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Coupon code */}
            <div className="mt-6">
              <form onSubmit={handleApplyCoupon} className="flex">
                <input
                  type="text"
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 rounded-l-md border-surface-300 bg-white py-2 pl-3 pr-3 text-sm placeholder:text-surface-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                <button
                  type="submit"
                  disabled={isApplyingCoupon || !couponCode}
                  className="rounded-r-md border border-l-0 border-primary-600 bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isApplyingCoupon ? 'Applying...' : 'Apply'}
                </button>
              </form>
            </div>

            {/* Checkout button */}
            <div className="mt-6">
              <button
                type="button"
                onClick={handleCheckout}
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-primary-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Checkout
                <ChevronRight size={16} className="ml-2" />
              </button>
            </div>

            {/* Payment methods */}
            <div className="mt-6 border-t border-surface-200 pt-4">
              <p className="mb-2 text-xs text-surface-500">We accept:</p>
              <div className="flex items-center space-x-3">
                <div className="h-8 w-12 rounded-md border border-surface-200 bg-white p-1">
                  <img src="/images/products/image.svg" alt="Visa" className="h-full w-full object-contain" />
                </div>
                <div className="h-8 w-12 rounded-md border border-surface-200 bg-white p-1">
                  <img src="/images/products/image.svg" alt="Mastercard" className="h-full w-full object-contain" />
                </div>
                <div className="h-8 w-12 rounded-md border border-surface-200 bg-white p-1">
                  <img src="/images/products/image.svg" alt="American Express" className="h-full w-full object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;