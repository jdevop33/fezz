import React from 'react';

/**
 * ProductPaymentIcons Component
 * 
 * Displays payment method icons in a smaller, more compact format 
 * suitable for use on product pages.
 */
const ProductPaymentIcons: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center gap-2 mt-2">
      {/* Visa */}
      <div className="h-6 w-10 bg-[#1434CB] rounded flex items-center justify-center relative">
        <div className="text-white font-bold italic text-base tracking-tighter">VISA</div>
      </div>

      {/* Mastercard */}
      <div className="h-6 w-10 bg-white rounded flex items-center justify-center relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-[#EB001B]"></div>
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[#F79E1B]"></div>
        <div className="absolute left-1/3 right-1/3 w-1/3 h-full bg-[#FF5F00] opacity-70 z-10"></div>
      </div>

      {/* American Express */}
      <div className="h-6 w-10 bg-[#006FCF] rounded flex items-center justify-center">
        <div className="text-white font-bold text-[10px] tracking-tight">AmEx</div>
      </div>

      {/* PayPal */}
      <div className="h-6 px-2 bg-[#003087] rounded flex items-center justify-center">
        <span className="text-white font-bold text-xs">Pay<span className="text-[#009cde]">Pal</span></span>
      </div>

      {/* Apple Pay */}
      <div className="h-6 px-2 bg-black rounded flex items-center justify-center">
        <span className="text-white font-semibold text-xs">Apple Pay</span>
      </div>

      {/* Google Pay */}
      <div className="h-6 px-2 bg-white border border-gray-200 rounded flex items-center justify-center">
        <span className="font-medium text-xs">
          <span className="text-blue-600">G</span>
          <span className="text-red-500">o</span>
          <span className="text-amber-500">o</span>
          <span className="text-blue-600">g</span>
          <span className="text-green-500">l</span>
          <span className="text-red-500">e</span>
          <span className="text-gray-800 ml-0.5">Pay</span>
        </span>
      </div>
    </div>
  );
};

export default ProductPaymentIcons;