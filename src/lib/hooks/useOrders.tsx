import { useState, useEffect } from 'react';
import { where, orderBy } from 'firebase/firestore';
import { 
  Order,
  getUserOrders,
  getDistributorOrders,
  getOrdersByStatus,
  listenToQuery,
  COLLECTIONS,
  listenToDocument
} from '../pouchesDb';
import { useAuth } from './useAuth';

interface UseOrdersOptions {
  status?: Order['status'];
  sortDirection?: 'asc' | 'desc';
  limit?: number;
}

// Hook for fetching and filtering user orders
export function useUserOrders(options: UseOrdersOptions = {}) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  
  const {
    status,
    sortDirection = 'desc',
    limit
  } = options;

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Function to fetch orders
    const fetchOrders = async () => {
      try {
        let ordersList = await getUserOrders(user.uid);
        
        // Filter by status if provided
        if (status) {
          ordersList = ordersList.filter(order => order.status === status);
        }

        // Apply sort direction (default is already descending by createdAt)
        if (sortDirection === 'asc') {
          ordersList.reverse();
        }

        // Apply limit if provided
        if (limit && limit > 0) {
          ordersList = ordersList.slice(0, limit);
        }

        setOrders(ordersList);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred while fetching orders'));
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, status, sortDirection, limit]);

  return { orders, loading, error };
}

// Hook for real-time user orders updates
export function useUserOrdersRealtime(options: UseOrdersOptions = {}) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  
  const {
    status,
    sortDirection = 'desc',
    limit
  } = options;

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Build query constraints
    const constraints = [
      where('userId', '==', user.uid),
      orderBy('createdAt', sortDirection)
    ];
    
    if (status) {
      constraints.push(where('status', '==', status));
    }

    // Subscribe to real-time updates
    const unsubscribe = listenToQuery<Order>(
      COLLECTIONS.ORDERS,
      constraints,
      (ordersList) => {
        // Apply limit if provided
        let filteredOrders = ordersList;
        
        if (limit && limit > 0) {
          filteredOrders = filteredOrders.slice(0, limit);
        }
        
        setOrders(filteredOrders);
        setLoading(false);
      }
    );

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, [user, status, sortDirection, limit]);

  return { orders, loading, error };
}

// Hook for distributor orders
export function useDistributorOrders(options: UseOrdersOptions = {}) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  
  const {
    status,
    sortDirection = 'desc',
    limit
  } = options;

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Function to fetch orders
    const fetchOrders = async () => {
      try {
        let ordersList = await getDistributorOrders(user.uid);
        
        // Filter by status if provided
        if (status) {
          ordersList = ordersList.filter(order => order.status === status);
        }

        // Apply sort direction (default is already descending by createdAt)
        if (sortDirection === 'asc') {
          ordersList.reverse();
        }

        // Apply limit if provided
        if (limit && limit > 0) {
          ordersList = ordersList.slice(0, limit);
        }

        setOrders(ordersList);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred while fetching distributor orders'));
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, status, sortDirection, limit]);

  return { orders, loading, error };
}

// Hook for admin to view all orders
export function useAllOrders(options: UseOrdersOptions = {}) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const {
    status,
    sortDirection = 'desc',
    limit
  } = options;

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Function to fetch orders
    const fetchOrders = async () => {
      try {
        let ordersList: Order[];
        
        // Get orders by status if provided, otherwise get all orders
        if (status) {
          ordersList = await getOrdersByStatus(status);
        } else {
          // For all orders, use a direct query
          ordersList = await listenToQuery<Order>(
            COLLECTIONS.ORDERS,
            [orderBy('createdAt', sortDirection)]
          );
        }

        // Apply limit if provided
        if (limit && limit > 0) {
          ordersList = ordersList.slice(0, limit);
        }

        setOrders(ordersList);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred while fetching all orders'));
        setLoading(false);
      }
    };

    fetchOrders();
  }, [status, sortDirection, limit]);

  return { orders, loading, error };
}

// Hook for getting a single order by ID
export function useOrder(orderId: string | null) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!orderId) {
      setOrder(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Subscribe to real-time updates for the order
    const unsubscribe = listenToDocument<Order>(
      COLLECTIONS.ORDERS,
      orderId,
      (orderData) => {
        setOrder(orderData);
        setLoading(false);
      }
    );

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, [orderId]);

  return { order, loading, error };
}