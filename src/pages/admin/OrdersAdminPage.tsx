import React, { useState, useEffect } from 'react';
import { 
  getOrdersByStatus, 
  updateOrder, 
  Order,
  listenToQuery,
  COLLECTIONS
} from '../../lib/pouchesDb';
import { orderBy } from 'firebase/firestore';
import { toast } from 'sonner';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Truck, 
  Package, 
  RefreshCw,
  Mail
} from 'lucide-react';

const OrdersAdminPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<Order['status'] | 'all'>('awaiting_payment');
  
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    // Function to fetch orders
    const fetchOrders = async () => {
      try {
        let ordersList: Order[];
        
        if (selectedStatus === 'all') {
          // For all orders, use a direct query
          const unsubscribe = listenToQuery<Order>(
            COLLECTIONS.ORDERS,
            [orderBy('createdAt', 'desc')],
            (result) => {
              setOrders(result);
              setLoading(false);
            }
          );
          
          // Return the unsubscribe function
          return () => unsubscribe();
        } else {
          // For specific status, get orders by status
          const statusOrders = await getOrdersByStatus(selectedStatus);
          setOrders(statusOrders);
          setLoading(false);
          return () => {}; // No cleanup needed for one-time query
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred while fetching orders'));
        setLoading(false);
        return () => {}; // No cleanup needed
      }
    };
    
    // Call the fetch function and store the cleanup function
    const cleanup = fetchOrders();
    
    // Return the cleanup function
    return () => {
      cleanup.then(unsubscribe => unsubscribe());
    };
  }, [selectedStatus]);
  
  // Handle order status update
  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateOrder(orderId, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            <Clock size={12} className="mr-1" />
            Pending
          </span>
        );
      case 'awaiting_payment':
        return (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            <Clock size={12} className="mr-1" />
            Awaiting Payment
          </span>
        );
      case 'paid':
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            <CheckCircle size={12} className="mr-1" />
            Paid
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
            <RefreshCw size={12} className="mr-1" />
            Processing
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
            <Truck size={12} className="mr-1" />
            Shipped
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            <Package size={12} className="mr-1" />
            Delivered
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
            <XCircle size={12} className="mr-1" />
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };
  
  // Format date
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-900">Order Management</h1>
        <p className="mt-2 text-surface-600">
          View and manage customer orders
        </p>
      </div>
      
      {/* Status filter */}
      <div className="mb-6">
        <label htmlFor="status-filter" className="block text-sm font-medium text-surface-700 mb-2">
          Filter by Status
        </label>
        <select
          id="status-filter"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as Order['status'] | 'all')}
          className="mt-1 block w-full rounded-md border-surface-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        >
          <option value="all">All Orders</option>
          <option value="awaiting_payment">Awaiting Payment</option>
          <option value="paid">Paid</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      
      {/* Orders table */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-surface-600">Loading orders...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">
          <p>Error loading orders: {error.message}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-surface-600">No orders found with the selected status.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-surface-200">
            <thead className="bg-surface-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-surface-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-surface-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-surface-900">
                    {order.id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-600">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-600">
                    <div>
                      {order.shippingAddress.name}
                    </div>
                    <div className="text-xs text-surface-500">
                      {order.userEmail}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-600">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-600">
                    <div className="flex space-x-2">
                      {/* View details button */}
                      <button
                        type="button"
                        onClick={() => {
                          // In a real implementation, this would open a modal with order details
                          console.log('View order details:', order);
                        }}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        View
                      </button>
                      
                      {/* Status update buttons based on current status */}
                      {order.status === 'awaiting_payment' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(order.id, 'paid')}
                            className="text-green-600 hover:text-green-900"
                          >
                            Mark Paid
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                            className="text-red-600 hover:text-red-900"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      
                      {order.status === 'paid' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(order.id, 'processing')}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          Process
                        </button>
                      )}
                      
                      {order.status === 'processing' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(order.id, 'shipped')}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Ship
                        </button>
                      )}
                      
                      {order.status === 'shipped' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(order.id, 'delivered')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Mark Delivered
                        </button>
                      )}
                      
                      {/* Email button */}
                      <button
                        type="button"
                        onClick={() => {
                          // In a real implementation, this would open an email composer
                          window.open(`mailto:${order.userEmail}?subject=Your Order ${order.id}`);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="Email Customer"
                      >
                        <Mail size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersAdminPage;
