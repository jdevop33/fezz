import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Package, Truck, CheckCircle, RefreshCw, ExternalLink, Search } from 'lucide-react';
import { useAuth } from '../lib/hooks';
import { toast } from 'sonner';

// Order status type
type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled';

// Order interface
interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  trackingNumber?: string;
  carrier?: string;
}

const OrdersPage: React.FC = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  // Check if an order was just placed (from checkout page)
  useEffect(() => {
    if (location.state?.orderPlaced) {
      toast.success('Your order has been successfully placed!');
    }
  }, [location.state]);

  // Fetch orders from the backend (simulated)
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        // In a real app, this would be an API call to fetch the user's orders
        // For now, we'll simulate some mock data
        setTimeout(() => {
          const mockOrders: Order[] = [
            {
              id: 'ORD-12345',
              date: '2025-03-01T14:30:00Z',
              status: 'delivered',
              total: 49.98,
              items: [
                {
                  id: 'apple-mint-6mg',
                  name: 'Apple Mint 6mg',
                  price: 24.99,
                  quantity: 2,
                  imageUrl: '/images/products/apple-mint-6mg.jpg'
                }
              ],
              trackingNumber: '1Z999AA10123456784',
              carrier: 'UPS'
            },
            {
              id: 'ORD-12346',
              date: '2025-02-15T09:45:00Z',
              status: 'shipped',
              total: 74.97,
              items: [
                {
                  id: 'spearmint-16mg',
                  name: 'Spearmint 16mg',
                  price: 24.99,
                  quantity: 1,
                  imageUrl: '/images/products/spearmint-16mg.jpg'
                },
                {
                  id: 'cola-12mg',
                  name: 'Cola 12mg',
                  price: 24.99,
                  quantity: 2,
                  imageUrl: '/images/products/cola-12mg.jpg'
                }
              ],
              trackingNumber: '9400111202555888000027',
              carrier: 'USPS'
            },
            {
              id: 'ORD-12347',
              date: '2025-03-08T16:20:00Z',
              status: 'processing',
              total: 99.96,
              items: [
                {
                  id: 'cherry-16mg',
                  name: 'Cherry 16mg',
                  price: 24.99,
                  quantity: 4,
                  imageUrl: '/images/products/cherry-16mg.jpg'
                }
              ]
            }
          ];

          setOrders(mockOrders);
          setLoading(false);
        }, 800); // Simulate network delay
      } catch {
        setError('Failed to load your orders. Please try again later.');
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  // Filter orders based on search query and status filter
  const filteredOrders = orders.filter(order => {
    // Status filter
    if (statusFilter !== 'all' && order.status !== statusFilter) {
      return false;
    }

    // Search query (check order ID, tracking number, and product names)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesOrderId = order.id.toLowerCase().includes(query);
      const matchesTracking = order.trackingNumber?.toLowerCase().includes(query) || false;
      const matchesProducts = order.items.some(item => 
        item.name.toLowerCase().includes(query)
      );

      return matchesOrderId || matchesTracking || matchesProducts;
    }

    return true;
  });

  // Format date string to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Get status badge style based on order status
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'processing':
        return (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            <RefreshCw size={12} className="mr-1" />
            Processing
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            <Truck size={12} className="mr-1" />
            Shipped
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            <CheckCircle size={12} className="mr-1" />
            Delivered
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
            <Package size={12} className="mr-1" />
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  // Get tracking URL based on carrier
  const getTrackingUrl = (trackingNumber: string, carrier: string) => {
    if (carrier === 'UPS') {
      return `https://www.ups.com/track?tracknum=${trackingNumber}`;
    } else if (carrier === 'USPS') {
      return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`;
    } else if (carrier === 'FedEx') {
      return `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`;
    }
    return '#';
  };

  return (
    <div className="bg-surface-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-surface-900">Your Orders</h1>
          <p className="mt-2 text-surface-600">
            Track, manage, and review your past orders and their current status.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 rounded-lg border border-surface-200 bg-white p-4 sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex-1 sm:pr-4">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search size={16} className="text-surface-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                placeholder="Search orders by ID, tracking number, or product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full rounded-md border-0 py-2 pl-10 text-surface-900 ring-1 ring-inset ring-surface-300 placeholder:text-surface-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm"
              />
            </div>
          </div>

          <div className="mt-4 sm:mt-0">
            <label htmlFor="status-filter" className="sr-only">
              Filter by status
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
              className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-surface-900 ring-1 ring-inset ring-surface-300 focus:ring-2 focus:ring-primary-600 sm:text-sm"
            >
              <option value="all">All orders</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="mt-6 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>Please try refreshing the page or contact customer support if the issue persists.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No orders found */}
        {!loading && !error && filteredOrders.length === 0 && (
          <div className="rounded-md border border-surface-200 bg-white p-6 text-center">
            <Package className="mx-auto h-12 w-12 text-surface-400" />
            <h3 className="mt-2 text-lg font-medium text-surface-900">No orders found</h3>
            {orders.length > 0 ? (
              <p className="mt-1 text-surface-600">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            ) : (
              <p className="mt-1 text-surface-600">
                You haven't placed any orders yet. Start shopping to create your first order!
              </p>
            )}
            <div className="mt-6">
              <Link
                to="/products"
                className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Browse Products
              </Link>
            </div>
          </div>
        )}

        {/* Orders list */}
        {!loading && !error && filteredOrders.length > 0 && (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="overflow-hidden rounded-lg border border-surface-200 bg-white shadow-sm">
                {/* Order header */}
                <div className="border-b border-surface-200 bg-surface-50 px-4 py-4 sm:px-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h2 className="text-lg font-semibold text-surface-900">
                        Order #{order.id}
                      </h2>
                      <p className="text-sm text-surface-500">
                        Placed on {formatDate(order.date)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(order.status)}
                      <span className="font-medium text-surface-900">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Order items */}
                <div className="divide-y divide-surface-200">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex p-4 sm:p-6">
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-surface-200">
                        <img
                          src={item.imageUrl || '/images/products/placeholder.svg'}
                          alt={item.name}
                          className="h-full w-full object-contain object-center"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/products/placeholder.svg';
                          }}
                        />
                      </div>
                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between">
                            <h3 className="text-base font-medium text-surface-900">
                              <Link to={`/products/${item.id}`} className="hover:text-primary-600">
                                {item.name}
                              </Link>
                            </h3>
                            <p className="ml-4 text-base font-medium text-surface-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                          <p className="mt-1 text-sm text-surface-500">
                            ${item.price.toFixed(2)} each
                          </p>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <p className="text-surface-500">Qty {item.quantity}</p>
                          <div className="flex">
                            <Link
                              to={`/products/${item.id}`}
                              className="font-medium text-primary-600 hover:text-primary-500"
                            >
                              View Product
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order footer with tracking info */}
                <div className="border-t border-surface-200 px-4 py-4 sm:px-6">
                  {(order.status === 'shipped' || order.status === 'delivered') && order.trackingNumber && order.carrier ? (
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="text-sm">
                        <span className="font-medium text-surface-900">Tracking Number: </span>
                        <span className="text-surface-600">{order.trackingNumber}</span>
                      </div>
                      <a
                        href={getTrackingUrl(order.trackingNumber, order.carrier)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
                      >
                        Track Order
                        <ExternalLink size={14} className="ml-1" />
                      </a>
                    </div>
                  ) : order.status === 'processing' ? (
                    <p className="text-sm text-surface-600">
                      Your order is being processed. Tracking information will be available once shipped.
                    </p>
                  ) : order.status === 'cancelled' ? (
                    <p className="text-sm text-surface-600">
                      This order has been cancelled. If you have any questions, please contact customer support.
                    </p>
                  ) : (
                    <p className="text-sm text-surface-600">
                      Order details are being updated. Check back later for more information.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back to Dashboard link */}
        <div className="mt-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            <ChevronRight size={16} className="mr-1 rotate-180" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;