import React from 'react';

/**
 * PaymentIcons Component
 * 
 * Displays a collection of payment method icons/logos.
 * Since we don't want to use low-quality icons, we're creating
 * styled components to represent different payment methods.
 */
const PaymentIcons: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center gap-4 justify-center mt-4">
      {/* Visa */}
      <div className="h-8 w-12 bg-[#1434CB] rounded flex items-center justify-center relative">
        <div className="text-white font-bold italic text-xl tracking-tighter">VISA</div>
      </div>

      {/* Mastercard */}
      <div className="h-8 w-12 bg-white rounded flex items-center justify-center relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-[#EB001B]"></div>
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[#F79E1B]"></div>
        <div className="absolute left-1/3 right-1/3 w-1/3 h-full bg-[#FF5F00] opacity-70 z-10"></div>
      </div>

      {/* American Express */}
      <div className="h-8 w-12 bg-[#006FCF] rounded flex items-center justify-center">
        <div className="text-white font-bold text-xs tracking-tight">AmEx</div>
      </div>

      {/* PayPal */}
      <div className="h-8 px-2 bg-[#003087] rounded flex items-center justify-center">
        <span className="text-white font-bold text-sm">Pay<span className="text-[#009cde]">Pal</span></span>
      </div>

      {/* Apple Pay */}
      <div className="h-8 px-2 bg-black rounded flex items-center justify-center">
        <span className="text-white font-semibold text-sm">Apple Pay</span>
      </div>

      {/* Google Pay */}
      <div className="h-8 px-2 bg-white border border-gray-200 rounded flex items-center justify-center">
        <span className="font-medium text-sm">
          <span className="text-blue-600">G</span>
          <span className="text-red-500">o</span>
          <span className="text-amber-500">o</span>
          <span className="text-blue-600">g</span>
          <span className="text-green-500">l</span>
          <span className="text-red-500">e</span>
          <span className="text-gray-800 ml-1">Pay</span>
        </span>
      </div>
    </div>
  );
};

/**
 * Alternative implementation using a single card-like component
 * that can be used for a more uniform look
 */
export const PaymentMethodCard: React.FC<{
  name: string;
  icon?: React.ReactNode;
  bgColor?: string;
  textColor?: string;
}> = ({ name, icon, bgColor = 'bg-surface-100', textColor = 'text-surface-800' }) => {
  return (
    <div className={`${bgColor} ${textColor} rounded-md py-1 px-3 flex items-center`}>
      {icon && <span className="mr-1">{icon}</span>}
      <span className="text-sm font-medium">{name}</span>
    </div>
  );
};

export default PaymentIcons;