import { Timestamp } from 'firebase/firestore';

// Base document interface for all Firestore documents
export interface BaseDocument {
  id: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Unified Product interface to be used across the application
export interface Product extends BaseDocument {
  // Required fields from Firestore
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
  
  // UI & display fields
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  count?: number; // Number of pouches per package
  originalPrice?: number; // For displaying discounts
}

// User Interface
export interface User extends BaseDocument {
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  photoURL?: string;
  role?: 'retail' | 'wholesale' | 'distributor' | 'admin' | 'owner';
  approved?: boolean;
  referrerId?: string;
  commissionRate?: number;
  createdOrders?: string[];
  companyName?: string;
  accountType?: 'referrer' | 'distributor' | 'both';
  phone?: string;
  businessDescription?: string;
  status?: string;
  isAdmin?: boolean;
  isOwner?: boolean;
}

// Cart item interface
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
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

// Exporting types isn't necessary here as we're using export interface directly

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