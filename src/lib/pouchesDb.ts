import { 
  where, 
  orderBy,  
  QueryConstraint
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
// Import types from the central types file
import type { 
  Product, 
  User, 
  Order, 
  OrderItem, 
  Address, 
  Transaction, 
  Commission 
} from './types';

// Re-export these functions so they can be used by other modules
export {
  setDocument,
  listenToDocument,
  listenToQuery,
  queryDocuments,
  createDocument
};

// Re-export types
export type { 
  Product, 
  User, 
  Order, 
  OrderItem, 
  Address, 
  Transaction, 
  Commission 
};

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

export const approveUserAccount = async (userId: string, approved: boolean): Promise<void> => {
  return updateDocument(COLLECTIONS.USERS, userId, { 
    approved,
    status: approved ? 'active' : 'rejected'
  });
};

export const getUsersByRole = async (role: User['role']): Promise<User[]> => {
  return queryDocuments<User>(COLLECTIONS.USERS, [
    where('role', '==', role)
  ]);
};

export const getPendingApprovals = async (): Promise<User[]> => {
  return queryDocuments<User>(COLLECTIONS.USERS, [
    where('approved', '==', false),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc')
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

// Database Initialization Function - optimized for batched operations
export async function initializeProductsDatabase(products: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<void> {
  try {
    // Process in smaller batches to avoid connection timeout
    const batchSize = 3;
    const batches = [];
    
    // Split into batches
    for (let i = 0; i < products.length; i += batchSize) {
      batches.push(products.slice(i, i + batchSize));
    }
    
    console.log(`Initializing products in ${batches.length} batches of ${batchSize} each`);
    
    // Process batches sequentially
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`Processing batch ${i+1}/${batches.length} with ${batch.length} products`);
      
      // Create promises for each product in the batch
      const promises = batch.map(product => {
        // Use a custom ID based on flavor and strength to avoid duplicates
        const customId = `${product.flavor.toLowerCase().replace(/\s+/g, '-')}-${product.strength}mg`;
        return setDocument(COLLECTIONS.PRODUCTS, customId, {
          ...product,
          id: customId
        }, true); // Use merge:true to avoid overwriting existing products
      });
      
      // Wait for all products in this batch to be created
      await Promise.all(promises);
      
      // Add a small delay between batches
      if (i < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    console.log('Products database initialized successfully!');
  } catch (error) {
    console.error('Error initializing products database:', error);
    throw error;
  }
}

export async function initializeUserRoles(): Promise<void> {
  try {
    console.log('Initializing user roles...');
    
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
      },
      owner: {
        name: 'Owner',
        permissions: ['manage_users', 'manage_products', 'verify_payments', 'assign_orders', 'manage_commissions', 'manage_admins', 'view_all_financials', 'approve_accounts']
      }
    };
    
    // Process one role at a time with a delay between each
    const roles = Object.entries(userRoles);
    
    for (let i = 0; i < roles.length; i++) {
      const [role, data] = roles[i];
      console.log(`Setting up role: ${role}`);
      
      await setDocument(COLLECTIONS.SETTINGS, `role_${role}`, data, true); // Use merge: true
      
      // Add a small delay between roles
      if (i < roles.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
    
    console.log('User roles initialized successfully!');
  } catch (error) {
    console.error('Error initializing user roles:', error);
    throw error;
  }
}