import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import ProductForm from './ProductForm';

// Define a proper type for the form data
interface ProductFormData {
  name: string;
  description: string;
  category_id: string;
  price: number;
  inventory_count: number;
  sku: string;
  image_url: string;
  is_active: boolean;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  initialData?: Partial<ProductFormData>;
  categories: Array<{ id: string; name: string }>;
  onSubmit: (data: ProductFormData) => void;
}

function ProductModal({ isOpen, onClose, title, initialData, categories, onSubmit }: ProductModalProps) {
  // Handle Escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby={title} role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-surface-900/50 backdrop-blur-sm transition-opacity dark:bg-surface-900/70" 
        onClick={onClose} 
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="w-full max-w-4xl transform rounded-2xl bg-white dark:bg-surface-800 shadow-soft-2xl border border-surface-200 dark:border-surface-700 text-left transition-all animate-fade-in dark:text-white"
        >
          <div className="relative">
            {/* Close Button */}
            <button
              type="button"
              className="absolute top-4 right-4 rounded-full p-2 transition-colors text-surface-500 hover:text-surface-900 hover:bg-surface-100 dark:text-surface-400 dark:hover:text-white dark:hover:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-surface-200 dark:border-surface-700">
              <h2 className="text-xl font-semibold text-surface-900 dark:text-white">
                {title}
              </h2>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
              <ProductForm
                initialData={initialData}
                categories={categories}
                onSubmit={onSubmit}
                onCancel={onClose}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;