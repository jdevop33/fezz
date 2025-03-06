import { 
  where, 
  orderBy, 
  Timestamp, 
  QueryConstraint, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  createDocument, 
  setDocument, 
  updateDocument, 
  getDocument, 
  deleteDocument,
  queryDocuments,
  listenToDocument,
  listenToQuery
} from './firestore';

// Base interface for firestore documents
export interface BaseDocument {
  id: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Product Interface
export interface Product extends BaseDocument {
  itemPN: string;
  description: string;
  strength: number;
  flavor: string;
  price: number;
  wholesalePrice: number;
  inventoryCount: number;
  category: string;
  imageUrl: string;
  active: boolean;
}

// User Interface
export interface User extends BaseDocument {
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'retail' | 'wholesale' | 'distributor' | 'admin';
  approved: boolean;
  referrerId?: string;
  commissionRate?: number;
  createdOrders?: string[];
}

// Order Interface
export interface Order extends BaseDocument {
  userId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'crypto' | 'bank' | 'highRisk';
  paymentId?: string;
  shippingAddress: Address;
  distributorId?: string;
  wholesalerId?: string;
  trackingNumber?: string;
}

// Order Item Interface
export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// Address Interface
export interface Address {
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

// Transaction Interface
export interface Transaction extends BaseDocument {
  orderId: string;
  userId: string;
  amount: number;
  paymentMethod: 'crypto' | 'bank' | 'highRisk';
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  notes?: string;
}

// Commission Interface
export interface Commission extends BaseDocument {
  userId: string;
  orderId: string;
  amount: number;
  status: 'pending' | 'paid';
  paidAt?: Timestamp;
  paymentId?: string;
}

// Collection Names
export const COLLECTIONS = {
  PRODUCTS: 'products',
  USERS: 'users',
  ORDERS: 'orders',
  TRANSACTIONS: 'transactions',
  COMMISSIONS: 'commissions',
  SETTINGS: 'settings'
};

// Product Functions
export const createProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const docRef = await createDocument(COLLECTIONS.PRODUCTS, product);
  return docRef.id;
};

export const getProduct = async (productId: string): Promise<Product | null> => {
  return getDocument<Product>(COLLECTIONS.PRODUCTS, productId);
};

export const updateProduct = async (productId: string, data: Partial<Product>): Promise<void> => {
  return updateDocument(COLLECTIONS.PRODUCTS, productId, data);
};

export const deleteProduct = async (productId: string): Promise<void> => {
  return deleteDocument(COLLECTIONS.PRODUCTS, productId);
};

export const getAllProducts = async (activeOnly = true): Promise<Product[]> => {
  const constraints: QueryConstraint[] = [];
  
  if (activeOnly) {
    constraints.push(where('active', '==', true));
  }
  
  constraints.push(orderBy('flavor', 'asc'));
  constraints.push(orderBy('strength', 'asc'));
  
  return queryDocuments<Product>(COLLECTIONS.PRODUCTS, constraints);
};

export const getProductsByCategory = async (category: string, activeOnly = true): Promise<Product[]> => {
  const constraints: QueryConstraint[] = [
    where('category', '==', category)
  ];
  
  if (activeOnly) {
    constraints.push(where('active', '==', true));
  }
  
  constraints.push(orderBy('flavor', 'asc'));
  constraints.push(orderBy('strength', 'asc'));
  
  return queryDocuments<Product>(COLLECTIONS.PRODUCTS, constraints);
};

export const getProductsByFlavor = async (flavor: string, activeOnly = true): Promise<Product[]> => {
  const constraints: QueryConstraint[] = [
    where('flavor', '==', flavor)
  ];
  
  if (activeOnly) {
    constraints.push(where('active', '==', true));
  }
  
  constraints.push(orderBy('strength', 'asc'));
  
  return queryDocuments<Product>(COLLECTIONS.PRODUCTS, constraints);
};

// User Functions
export const createUser = async (userId: string, userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> => {
  return setDocument(COLLECTIONS.USERS, userId, {
    ...userData,
    approved: userData.role === 'retail' // Auto-approve retail customers
  });
};

export const getUser = async (userId: string): Promise<User | null> => {
  return getDocument<User>(COLLECTIONS.USERS, userId);
};

export const updateUser = async (userId: string, data: Partial<User>): Promise<void> => {
  return updateDocument(COLLECTIONS.USERS, userId, data);
};

export const getUsersByRole = async (role: User['role']): Promise<User[]> => {
  return queryDocuments<User>(COLLECTIONS.USERS, [
    where('role', '==', role)
  ]);
};

export const getPendingApprovals = async (): Promise<User[]> => {
  return queryDocuments<User>(COLLECTIONS.USERS, [
    where('approved', '==', false),
    where('role', 'in', ['wholesale', 'distributor'])
  ]);
};

export const listenToUserData = (userId: string, callback: (user: User | null) => void) => {
  return listenToDocument<User>(COLLECTIONS.USERS, userId, callback);
};

// Order Functions
export const createOrder = async (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const docRef = await createDocument(COLLECTIONS.ORDERS, order);
  return docRef.id;
};

export const getOrder = async (orderId: string): Promise<Order | null> => {
  return getDocument<Order>(COLLECTIONS.ORDERS, orderId);
};

export const updateOrder = async (orderId: string, data: Partial<Order>): Promise<void> => {
  return updateDocument(COLLECTIONS.ORDERS, orderId, data);
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  return queryDocuments<Order>(COLLECTIONS.ORDERS, [
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  ]);
};

export const getDistributorOrders = async (distributorId: string): Promise<Order[]> => {
  return queryDocuments<Order>(COLLECTIONS.ORDERS, [
    where('distributorId', '==', distributorId),
    orderBy('createdAt', 'desc')
  ]);
};

export const getOrdersByStatus = async (status: Order['status']): Promise<Order[]> => {
  return queryDocuments<Order>(COLLECTIONS.ORDERS, [
    where('status', '==', status),
    orderBy('createdAt', 'desc')
  ]);
};

export const listenToOrder = (orderId: string, callback: (order: Order | null) => void) => {
  return listenToDocument<Order>(COLLECTIONS.ORDERS, orderId, callback);
};

// Transaction Functions
export const createTransaction = async (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const docRef = await createDocument(COLLECTIONS.TRANSACTIONS, transaction);
  return docRef.id;
};

export const getTransaction = async (transactionId: string): Promise<Transaction | null> => {
  return getDocument<Transaction>(COLLECTIONS.TRANSACTIONS, transactionId);
};

export const updateTransaction = async (transactionId: string, data: Partial<Transaction>): Promise<void> => {
  return updateDocument(COLLECTIONS.TRANSACTIONS, transactionId, data);
};

export const getOrderTransactions = async (orderId: string): Promise<Transaction[]> => {
  return queryDocuments<Transaction>(COLLECTIONS.TRANSACTIONS, [
    where('orderId', '==', orderId),
    orderBy('createdAt', 'desc')
  ]);
};

// Commission Functions
export const createCommission = async (commission: Omit<Commission, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const docRef = await createDocument(COLLECTIONS.COMMISSIONS, commission);
  return docRef.id;
};

export const getCommission = async (commissionId: string): Promise<Commission | null> => {
  return getDocument<Commission>(COLLECTIONS.COMMISSIONS, commissionId);
};

export const updateCommission = async (commissionId: string, data: Partial<Commission>): Promise<void> => {
  return updateDocument(COLLECTIONS.COMMISSIONS, commissionId, data);
};

export const getUserCommissions = async (userId: string): Promise<Commission[]> => {
  return queryDocuments<Commission>(COLLECTIONS.COMMISSIONS, [
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  ]);
};

export const getPendingCommissions = async (): Promise<Commission[]> => {
  return queryDocuments<Commission>(COLLECTIONS.COMMISSIONS, [
    where('status', '==', 'pending'),
    orderBy('createdAt', 'asc')
  ]);
};

// Database Initialization Function
export async function initializeProductsDatabase(products: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<void> {
  try {
    for (const product of products) {
      await createProduct(product);
    }
    console.log('Products database initialized successfully!');
  } catch (error) {
    console.error('Error initializing products database:', error);
    throw error;
  }
}

export async function initializeUserRoles(): Promise<void> {
  try {
    const userRoles = {
      retail: {
        name: 'Retail Customer',
        permissions: ['browse_products', 'place_orders', 'track_orders']
      },
      wholesale: {
        name: 'Wholesale Buyer',
        permissions: ['browse_products', 'place_bulk_orders', 'track_orders', 'get_wholesale_prices', 'earn_commissions']
      },
      distributor: {
        name: 'Distributor',
        permissions: ['handle_orders', 'earn_commissions', 'manage_shipping']
      },
      admin: {
        name: 'Administrator',
        permissions: ['manage_users', 'manage_products', 'verify_payments', 'assign_orders', 'manage_commissions']
      }
    };

    for (const [role, data] of Object.entries(userRoles)) {
      await setDocument(COLLECTIONS.SETTINGS, `role_${role}`, data);
    }
    
    console.log('User roles initialized successfully!');
  } catch (error) {
    console.error('Error initializing user roles:', error);
    throw error;
  }
}