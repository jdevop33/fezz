import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CreditCard, ShoppingBag, Shield, Truck, BanknoteIcon } from 'lucide-react';
import { useCart } from '../lib/hooks';
import { useAuth } from '../lib/hooks';
import { toast } from 'sonner';
import { createOrder, Order, Address } from '../lib/pouchesDb';
import { sendOrderConfirmationEmail, sendOrderNotificationToOwner, generatePaymentInstructions } from '../lib/emailUtils';

interface ShippingFormData {
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
}

interface PaymentFormData {
  cardName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { items, subtotal, clearCart, isEmpty } = useCart();

  const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'check' | 'other'>('bank_transfer');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Shipping and payment form data
  const [shippingData, setShippingData] = useState<ShippingFormData>({
    firstName: currentUser?.displayName?.split(' ')[0] || '',
    lastName: currentUser?.displayName?.split(' ').slice(1).join(' ') || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: currentUser?.email || ''
  });

  const [paymentData, setPaymentData] = useState<PaymentFormData>({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  // Calculate order totals
  const shippingCost = shippingMethod === 'standard' ? (subtotal >= 50 ? 0 : 5.99) : 12.99;
  const taxAmount = subtotal * 0.07; // 7% tax
  const total = subtotal + shippingCost + taxAmount;

  // Age verification is required for nicotine products
  const [isAgeVerified, setIsAgeVerified] = useState(false);

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="rounded-full bg-surface-100 p-6">
          <ShoppingBag size={48} className="text-surface-400" />
        </div>
        <h2 className="mt-6 text-2xl font-semibold text-surface-900">Your cart is empty</h2>
        <p className="mt-2 text-surface-600">You need to add products to your cart before checkout.</p>
        <Link
          to="/products"
          className="mt-8 rounded-md bg-primary-600 px-6 py-3 text-sm font-medium text-white hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic form validation
    for (const [key, value] of Object.entries(shippingData)) {
      if (key !== 'apartment' && !value.trim()) {
        toast.error(`Please fill out your ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return;
      }
    }

    // Age verification is required
    if (!isAgeVerified) {
      toast.error('You must verify that you are 21 or older to purchase these products');
      return;
    }

    setStep('payment');
    window.scrollTo(0, 0);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // No validation needed for manual payment methods
    setStep('review');
    window.scrollTo(0, 0);
  };

  const handleOrderSubmit = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // Create shipping address object from form data
      const shippingAddress: Address = {
        name: `${shippingData.firstName} ${shippingData.lastName}`,
        street: shippingData.address,
        city: shippingData.city,
        state: shippingData.state,
        postalCode: shippingData.zipCode,
        country: 'US', // Default to US for now
        phone: shippingData.phone
      };

      // Convert cart items to order items
      const orderItems = items.map(item => ({
        productId: item.productId,
        productName: item.product.itemPN || `${item.product.flavor} ${item.product.strength}mg`,
        quantity: item.quantity,
        unitPrice: item.product.price,
        totalPrice: item.product.price * item.quantity
      }));

      // Generate payment instructions based on selected method
      const instructions = generatePaymentInstructions({
        id: 'temp-id', // Will be replaced with actual order ID
        paymentMethod
      } as Order);

      // Create order object
      const orderData = {
        userId: currentUser?.uid || '',
        userEmail: shippingData.email,
        items: orderItems,
        subtotal,
        tax: taxAmount,
        shipping: shippingCost,
        total,
        status: 'awaiting_payment',
        paymentMethod,
        paymentInstructions: instructions,
        shippingAddress,
        emailSent: false
      };

      // Create order in Firestore
      const orderId = await createOrder(orderData);

      // Send confirmation email to customer
      const emailSent = await sendOrderConfirmationEmail({
        ...orderData,
        id: orderId
      } as Order);

      // Send notification to owner/admin
      await sendOrderNotificationToOwner({
        ...orderData,
        id: orderId
      } as Order);

      // Update order with email status
      if (emailSent) {
        // In a real implementation, we would update the order document
        console.log(`Email sent successfully for order ${orderId}`);
      }

      toast.success('Your order has been placed! Check your email for payment instructions.');

      // Clear the cart
      clearCart();

      // Redirect to order confirmation
      setTimeout(() => {
        navigate('/dashboard/orders', { state: { orderPlaced: true } });
      }, 1500);
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('There was a problem placing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format card number with spaces for readability
  const formatCardNumber = (input: string) => {
    const cleaned = input.replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.substring(0, 19); // Limit to 16 digits + 3 spaces
  };

  // Format expiry date with slash
  const formatExpiryDate = (input: string) => {
    const cleaned = input.replace(/\D/g, '');

    if (cleaned.length > 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }

    return cleaned;
  };

  return (
    <div className="bg-surface-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center mb-8">
          <h1 className="text-2xl font-bold text-surface-900 text-center">Checkout</h1>

          {/* Checkout steps */}
          <div className="mt-4 flex items-center justify-center">
            <span className={`flex h-8 w-8 items-center justify-center rounded-full ${step === 'shipping' || step === 'payment' || step === 'review' ? 'bg-primary-600 text-white' : 'bg-surface-200 text-surface-700'}`}>
              1
            </span>
            <span className={`mx-2 h-1 w-16 ${step === 'payment' || step === 'review' ? 'bg-primary-600' : 'bg-surface-200'}`}></span>
            <span className={`flex h-8 w-8 items-center justify-center rounded-full ${step === 'payment' || step === 'review' ? 'bg-primary-600 text-white' : 'bg-surface-200 text-surface-700'}`}>
              2
            </span>
            <span className={`mx-2 h-1 w-16 ${step === 'review' ? 'bg-primary-600' : 'bg-surface-200'}`}></span>
            <span className={`flex h-8 w-8 items-center justify-center rounded-full ${step === 'review' ? 'bg-primary-600 text-white' : 'bg-surface-200 text-surface-700'}`}>
              3
            </span>
          </div>
          <div className="mt-2 flex items-center justify-center text-sm">
            <span className={`w-24 text-center ${step === 'shipping' ? 'font-semibold text-primary-600' : 'text-surface-600'}`}>
              Shipping
            </span>
            <span className="w-16"></span>
            <span className={`w-24 text-center ${step === 'payment' ? 'font-semibold text-primary-600' : 'text-surface-600'}`}>
              Payment
            </span>
            <span className="w-16"></span>
            <span className={`w-24 text-center ${step === 'review' ? 'font-semibold text-primary-600' : 'text-surface-600'}`}>
              Review
            </span>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Checkout forms */}
          <div className="lg:col-span-7">
            {/* Shipping form */}
            {step === 'shipping' && (
              <div className="rounded-lg border border-surface-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-medium text-surface-900 mb-4">Shipping Information</h2>

                <form onSubmit={handleShippingSubmit}>
                  <div className="mb-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-surface-700">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={shippingData.firstName}
                        onChange={(e) => setShippingData({...shippingData, firstName: e.target.value})}
                        className="mt-1 block w-full rounded-md border-surface-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-surface-700">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={shippingData.lastName}
                        onChange={(e) => setShippingData({...shippingData, lastName: e.target.value})}
                        className="mt-1 block w-full rounded-md border-surface-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-surface-700">
                        Street Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={shippingData.address}
                        onChange={(e) => setShippingData({...shippingData, address: e.target.value})}
                        className="mt-1 block w-full rounded-md border-surface-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="apartment" className="block text-sm font-medium text-surface-700">
                        Apartment, suite, etc. (optional)
                      </label>
                      <input
                        type="text"
                        id="apartment"
                        name="apartment"
                        value={shippingData.apartment || ''}
                        onChange={(e) => setShippingData({...shippingData, apartment: e.target.value})}
                        className="mt-1 block w-full rounded-md border-surface-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-surface-700">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={shippingData.city}
                        onChange={(e) => setShippingData({...shippingData, city: e.target.value})}
                        className="mt-1 block w-full rounded-md border-surface-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-surface-700">
                        State / Province
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={shippingData.state}
                        onChange={(e) => setShippingData({...shippingData, state: e.target.value})}
                        className="mt-1 block w-full rounded-md border-surface-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium text-surface-700">
                        ZIP / Postal Code
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={shippingData.zipCode}
                        onChange={(e) => setShippingData({...shippingData, zipCode: e.target.value})}
                        className="mt-1 block w-full rounded-md border-surface-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-surface-700">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={shippingData.phone}
                        onChange={(e) => setShippingData({...shippingData, phone: e.target.value})}
                        className="mt-1 block w-full rounded-md border-surface-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="email" className="block text-sm font-medium text-surface-700">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={shippingData.email}
                        onChange={(e) => setShippingData({...shippingData, email: e.target.value})}
                        className="mt-1 block w-full rounded-md border-surface-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-6 mb-4">
                    <h3 className="text-base font-medium text-surface-900 mb-3">Shipping Method</h3>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div
                        className={`relative rounded-lg border p-4 ${
                          shippingMethod === 'standard'
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-surface-200'
                        }`}
                      >
                        <label htmlFor="shipping-standard" className="flex cursor-pointer items-start text-sm">
                          <input
                            type="radio"
                            id="shipping-standard"
                            name="shipping-method"
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 mt-1"
                            checked={shippingMethod === 'standard'}
                            onChange={() => setShippingMethod('standard')}
                          />
                          <div className="ml-3 flex flex-col">
                            <span className="block font-medium text-surface-900">Standard Shipping</span>
                            <span className="block text-surface-500">
                              {subtotal >= 50 ? 'Free' : '$5.99'} · 3-5 business days
                            </span>
                          </div>
                        </label>
                      </div>

                      <div
                        className={`relative rounded-lg border p-4 ${
                          shippingMethod === 'express'
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-surface-200'
                        }`}
                      >
                        <label htmlFor="shipping-express" className="flex cursor-pointer items-start text-sm">
                          <input
                            type="radio"
                            id="shipping-express"
                            name="shipping-method"
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 mt-1"
                            checked={shippingMethod === 'express'}
                            onChange={() => setShippingMethod('express')}
                          />
                          <div className="ml-3 flex flex-col">
                            <span className="block font-medium text-surface-900">Express Shipping</span>
                            <span className="block text-surface-500">
                              $12.99 · 1-2 business days
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Age verification */}
                  <div className="mt-6 mb-2 rounded-md bg-amber-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Shield className="h-5 w-5 text-amber-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-amber-800">Age Verification Required</h3>
                        <div className="mt-2 text-sm text-amber-700">
                          <p>
                            You must be 21 years or older to purchase nicotine products. By checking this box, you confirm that you are at least 21 years of age. Age verification will be required upon delivery.
                          </p>
                        </div>
                        <div className="mt-3">
                          <div className="flex items-center">
                            <input
                              id="age-verification"
                              name="age-verification"
                              type="checkbox"
                              className="h-4 w-4 rounded border-amber-300 text-primary-600 focus:ring-primary-600"
                              checked={isAgeVerified}
                              onChange={(e) => setIsAgeVerified(e.target.checked)}
                              required
                            />
                            <label htmlFor="age-verification" className="ml-3 text-sm font-medium text-amber-800">
                              I confirm I am 21 years of age or older
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <Link
                      to="/cart"
                      className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
                    >
                      <ChevronLeft size={16} className="mr-1" />
                      Back to Cart
                    </Link>

                    <button
                      type="submit"
                      className="flex items-center rounded-md border border-transparent bg-primary-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                      Continue to Payment
                      <ChevronRight size={16} className="ml-2" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Payment form */}
            {step === 'payment' && (
              <div className="rounded-lg border border-surface-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-medium text-surface-900 mb-4">Payment Method</h2>

                <form onSubmit={handlePaymentSubmit}>
                  <div className="mb-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div
                        className={`relative rounded-lg border p-4 ${
                          paymentMethod === 'bank_transfer'
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-surface-200'
                        }`}
                      >
                        <label htmlFor="payment-bank" className="flex cursor-pointer items-start text-sm">
                          <input
                            type="radio"
                            id="payment-bank"
                            name="payment-method"
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 mt-1"
                            checked={paymentMethod === 'bank_transfer'}
                            onChange={() => setPaymentMethod('bank_transfer')}
                          />
                          <div className="ml-3 flex flex-col">
                            <span className="block font-medium text-surface-900">Bank Transfer</span>
                            <span className="block text-surface-500">
                              Pay via bank transfer
                            </span>
                          </div>
                        </label>
                      </div>

                      <div
                        className={`relative rounded-lg border p-4 ${
                          paymentMethod === 'check'
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-surface-200'
                        }`}
                      >
                        <label htmlFor="payment-check" className="flex cursor-pointer items-start text-sm">
                          <input
                            type="radio"
                            id="payment-check"
                            name="payment-method"
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 mt-1"
                            checked={paymentMethod === 'check'}
                            onChange={() => setPaymentMethod('check')}
                          />
                          <div className="ml-3 flex flex-col">
                            <span className="block font-medium text-surface-900">Check</span>
                            <span className="block text-surface-500">
                              Pay by check
                            </span>
                          </div>
                        </label>
                      </div>

                      <div
                        className={`relative rounded-lg border p-4 ${
                          paymentMethod === 'other'
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-surface-200'
                        }`}
                      >
                        <label htmlFor="payment-other" className="flex cursor-pointer items-start text-sm">
                          <input
                            type="radio"
                            id="payment-other"
                            name="payment-method"
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 mt-1"
                            checked={paymentMethod === 'other'}
                            onChange={() => setPaymentMethod('other')}
                          />
                          <div className="ml-3 flex flex-col">
                            <span className="block font-medium text-surface-900">Other</span>
                            <span className="block text-surface-500">
                              Contact for options
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Payment information message */}
                  <div className="mb-6 rounded-md bg-blue-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <BanknoteIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">Payment Information</h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <p>
                            After placing your order, you will receive detailed payment instructions via email.
                            Your order will be processed once payment is confirmed.
                          </p>
                          {paymentMethod === 'bank_transfer' && (
                            <p className="mt-2">
                              For bank transfers, please include your order number in the payment reference.
                            </p>
                          )}
                          {paymentMethod === 'check' && (
                            <p className="mt-2">
                              For check payments, please include your order number in the memo line.
                            </p>
                          )}
                          {paymentMethod === 'other' && (
                            <p className="mt-2">
                              For other payment methods, we will contact you with available options.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setStep('shipping');
                        window.scrollTo(0, 0);
                      }}
                      className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
                    >
                      <ChevronLeft size={16} className="mr-1" />
                      Back to Shipping
                    </button>

                    <button
                      type="submit"
                      className="flex items-center rounded-md border border-transparent bg-primary-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                      Review Order
                      <ChevronRight size={16} className="ml-2" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Order review */}
            {step === 'review' && (
              <div className="rounded-lg border border-surface-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-medium text-surface-900 mb-4">Review Your Order</h2>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-surface-900 mb-2">Shipping Address</h3>
                  <div className="rounded-md bg-surface-50 p-3 text-sm">
                    <p className="font-medium">{shippingData.firstName} {shippingData.lastName}</p>
                    <p>{shippingData.address}</p>
                    {shippingData.apartment && <p>{shippingData.apartment}</p>}
                    <p>{shippingData.city}, {shippingData.state} {shippingData.zipCode}</p>
                    <p className="mt-1">{shippingData.email}</p>
                    <p>{shippingData.phone}</p>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <h3 className="text-sm font-medium text-surface-900">Shipping Method</h3>
                    <button
                      type="button"
                      onClick={() => {
                        setStep('shipping');
                        window.scrollTo(0, 0);
                      }}
                      className="text-xs font-medium text-primary-600 hover:text-primary-500"
                    >
                      Change
                    </button>
                  </div>
                  <p className="text-sm text-surface-600">
                    {shippingMethod === 'standard' ? 'Standard Shipping (3-5 business days)' : 'Express Shipping (1-2 business days)'}
                  </p>

                  <div className="mt-4 flex justify-between items-center">
                    <h3 className="text-sm font-medium text-surface-900">Payment Method</h3>
                    <button
                      type="button"
                      onClick={() => {
                        setStep('payment');
                        window.scrollTo(0, 0);
                      }}
                      className="text-xs font-medium text-primary-600 hover:text-primary-500"
                    >
                      Change
                    </button>
                  </div>
                  <p className="text-sm text-surface-600">
                    {paymentMethod === 'bank_transfer' && 'Bank Transfer'}
                    {paymentMethod === 'check' && 'Check'}
                    {paymentMethod === 'other' && 'Other Payment Method'}
                  </p>
                </div>

                <h3 className="text-sm font-medium text-surface-900 mb-2">Order Items</h3>
                <ul className="divide-y divide-surface-200 mb-6">
                  {items.map((item) => (
                    <li key={item.productId} className="flex py-4">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-surface-200 bg-white">
                        <img
                          src={item.product.imageUrl || '/images/products/placeholder.svg'}
                          alt={item.product.flavor}
                          className="h-full w-full object-contain object-center"
                        />
                      </div>
                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-surface-900">
                            <h4>{item.product.itemPN || `${item.product.flavor} ${item.product.strength}mg`}</h4>
                            <p className="ml-4">${(item.product.price * item.quantity).toFixed(2)}</p>
                          </div>
                          <p className="mt-1 text-sm text-surface-500">{item.product.flavor} • {item.product.strength}mg</p>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <p className="text-surface-500">Qty {item.quantity}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={handleOrderSubmit}
                  disabled={isSubmitting}
                  className="mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-primary-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:bg-primary-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Processing...' : 'Place Order'}
                </button>

                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setStep('payment');
                      window.scrollTo(0, 0);
                    }}
                    className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
                  >
                    <ChevronLeft size={16} className="mr-1" />
                    Back to Payment
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order summary */}
          <div className="mt-8 lg:col-span-5 lg:mt-0">
            <div className="rounded-lg border border-surface-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-medium text-surface-900 mb-4">Order Summary</h2>

              <div className="flow-root">
                <ul className="divide-y divide-surface-200">
                  {items.map((item) => (
                    <li key={item.productId} className="flex py-4">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-surface-200 bg-white">
                        <img
                          src={item.product.imageUrl || '/images/products/placeholder.svg'}
                          alt={item.product.flavor}
                          className="h-full w-full object-contain object-center"
                        />
                      </div>
                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-surface-900">
                            <h4>{item.product.itemPN || `${item.product.flavor} ${item.product.strength}mg`}</h4>
                            <p className="ml-4">${(item.product.price * item.quantity).toFixed(2)}</p>
                          </div>
                          <p className="mt-1 text-sm text-surface-500">{item.product.flavor} • {item.product.strength}mg</p>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <p className="text-surface-500">Qty {item.quantity}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 space-y-4 border-t border-surface-200 pt-4">
                <div className="flex justify-between text-sm">
                  <p className="text-surface-600">Subtotal</p>
                  <p className="font-medium text-surface-900">${subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-surface-600">Shipping</p>
                  <p className="font-medium text-surface-900">${shippingCost.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-surface-600">Tax (7%)</p>
                  <p className="font-medium text-surface-900">${taxAmount.toFixed(2)}</p>
                </div>
                <div className="flex justify-between border-t border-surface-200 pt-4">
                  <p className="text-base font-medium text-surface-900">Order total</p>
                  <p className="text-base font-medium text-surface-900">${total.toFixed(2)}</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-surface-400" />
                  <p className="ml-2 text-sm text-surface-500">
                    Secure Checkout
                  </p>
                </div>
                <div className="flex items-center">
                  <Truck className="h-5 w-5 text-surface-400" />
                  <p className="ml-2 text-sm text-surface-500">
                    Free shipping on orders over $50
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;