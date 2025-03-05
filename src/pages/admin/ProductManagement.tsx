import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Package, Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ProductModal from '../../components/products/ProductModal';
import DeleteConfirmationModal from '../../components/products/DeleteConfirmationModal';

interface Product {
  id: string;
  name: string;
  description: string;
  category_id: string;
  price: number;
  inventory_count: number;
  sku: string;
  image_url: string | null;
  is_active: boolean;
  category: {
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
}

function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  async function loadProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name)
        `)
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }

  async function loadCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('Failed to load categories');
    }
  }

  async function handleSubmit(data: Partial<Product>) {
    try {
      if (selectedProduct) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(data)
          .eq('id', selectedProduct.id);

        if (error) throw error;
        toast.success('Product updated successfully');
      } else {
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert([data]);

        if (error) throw error;
        toast.success('Product created successfully');
      }

      setIsModalOpen(false);
      setSelectedProduct(null);
      loadProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    }
  }

  async function handleDelete() {
    if (!productToDelete) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productToDelete.id);

      if (error) throw error;

      toast.success('Product deleted successfully');
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  }

  async function toggleProductStatus(productId: string, currentStatus: boolean) {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: !currentStatus })
        .eq('id', productId);

      if (error) throw error;

      toast.success('Product status updated');
      loadProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product status');
    }
  }

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.category?.name && product.category.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-surface-900 dark:text-white">Products</h1>
          <p className="mt-2 text-sm text-surface-600 dark:text-surface-400">
            Manage your product catalog, including prices and inventory.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setSelectedProduct(null);
              setIsModalOpen(true);
            }}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </button>
        </div>
      </div>

      {/* Search and filter */}
      <div className="my-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-surface-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="input pl-10 w-full"
          />
        </div>
        <button
          type="button"
          className="btn-outline flex items-center sm:w-auto"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </button>
      </div>

      <div className="mt-4 card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
            <thead className="bg-surface-50 dark:bg-surface-800/50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-surface-900 dark:text-white sm:pl-6">
                  Product
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-surface-900 dark:text-white">
                  Category
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-surface-900 dark:text-white">
                  SKU
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-surface-900 dark:text-white">
                  Price
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-surface-900 dark:text-white">
                  Inventory
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-surface-900 dark:text-white">
                  Status
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200 dark:divide-surface-700 bg-white dark:bg-surface-800">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-sm text-surface-500 dark:text-surface-400">
                    <div className="flex flex-col items-center">
                      <Package className="h-12 w-12 text-surface-300 dark:text-surface-600 mb-4" />
                      <p className="font-medium text-surface-900 dark:text-white text-base mb-1">No products found</p>
                      <p>Try adjusting your search or filters to find what you're looking for.</p>
                      {searchTerm && (
                        <button 
                          onClick={() => setSearchTerm('')}
                          className="mt-4 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                        >
                          Clear search
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                      <div className="flex items-center">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-10 w-10 rounded-md object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-md bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                            <Package className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="font-medium text-surface-900 dark:text-white">{product.name}</div>
                          <div className="text-surface-500 dark:text-surface-400 max-w-xs truncate">{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-surface-500 dark:text-surface-400">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-100 text-surface-800 dark:bg-surface-700 dark:text-surface-300">
                        {product.category?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-surface-500 dark:text-surface-400 font-mono">
                      {product.sku}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-surface-900 dark:text-white font-medium">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-surface-500 dark:text-surface-400">
                      {product.inventory_count}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <button
                        onClick={() => toggleProductStatus(product.id, product.is_active)}
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          product.is_active
                            ? 'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-400'
                            : 'bg-error-100 text-error-800 dark:bg-error-900/20 dark:text-error-400'
                        }`}
                      >
                        {product.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <div className="flex justify-end space-x-2">
                        <button
                          className="p-1 rounded-md text-surface-400 hover:text-primary-600 hover:bg-surface-100 dark:hover:text-primary-400 dark:hover:bg-surface-700 transition-colors"
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsModalOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </button>
                        <button
                          className="p-1 rounded-md text-surface-400 hover:text-error-600 hover:bg-error-50 dark:hover:text-error-400 dark:hover:bg-error-900/20 transition-colors"
                          onClick={() => {
                            setProductToDelete(product);
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button className="btn-outline py-2">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </button>
            <button className="btn-outline py-2">
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-surface-700 dark:text-surface-400">
                Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                <span className="font-medium">{filteredProducts.length}</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-surface-400 ring-1 ring-inset ring-surface-300 dark:ring-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 focus:z-20 focus:outline-offset-0">
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button aria-current="page" className="relative z-10 inline-flex items-center bg-primary-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
                  1
                </button>
                <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-surface-900 dark:text-white ring-1 ring-inset ring-surface-300 dark:ring-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 focus:z-20 focus:outline-offset-0">
                  2
                </button>
                <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-surface-400 ring-1 ring-inset ring-surface-300 dark:ring-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 focus:z-20 focus:outline-offset-0">
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
        title={selectedProduct ? 'Edit Product' : 'Add Product'}
        initialData={selectedProduct}
        categories={categories}
        onSubmit={handleSubmit}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
      />
    </div>
  );
}
}

export default ProductManagement;