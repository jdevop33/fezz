import { initializeProductsDatabase, initializeUserRoles, Product } from './pouchesDb';
import { createInitialOwner } from './createOwner';
import { 
  collection,
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  query,
  where,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import type { User } from './types';

// Sample product data based on the nicotine pouches inventory
const sampleProducts: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    itemPN: 'Apple mint',
    description: 'Tobacco Free Nicotine Pouch, 6mg/pouch',
    strength: 6,
    flavor: 'Apple mint',
    price: 24.99,
    wholesalePrice: 18.99,
    inventoryCount: 10000,
    category: 'nicotine-pouches',
    imageUrl: '/images/products/apple-mint-6mg.jpg',
    active: true
  },
  {
    itemPN: 'Apple mint',
    description: 'Tobacco Free Nicotine Pouch, 12mg/pouch',
    strength: 12,
    flavor: 'Apple mint',
    price: 26.99,
    wholesalePrice: 19.99,
    inventoryCount: 5000,
    category: 'nicotine-pouches',
    imageUrl: '/images/products/apple-mint-12mg.jpg',
    active: true
  },
  {
    itemPN: 'Cool mint',
    description: 'Tobacco Free Nicotine Pouch, 6mg/pouch',
    strength: 6,
    flavor: 'Cool mint',
    price: 24.99,
    wholesalePrice: 18.99,
    inventoryCount: 10000,
    category: 'nicotine-pouches',
    imageUrl: '/images/products/cool-mint-6mg.jpg',
    active: true
  },
  {
    itemPN: 'Cool mint',
    description: 'Tobacco Free Nicotine Pouch, 16mg/pouch',
    strength: 16,
    flavor: 'Cool mint',
    price: 26.99,
    wholesalePrice: 19.99,
    inventoryCount: 8000,
    category: 'nicotine-pouches',
    imageUrl: '/images/products/cool-mint-16mg.jpg',
    active: true
  }
];

// Initialize the database with better error handling and recovery
export async function initializeDatabase(): Promise<void> {
  console.log('Starting database initialization process...');
  
  try {
    // Check if DB has been initialized already
    const settingsRef = doc(collection(db, 'settings'), 'db_init');
    const settingsDoc = await getDoc(settingsRef);
    
    if (settingsDoc.exists()) {
      console.log('Database already initialized');
      return;
    }
    
    // First initialize orders collection if it doesn't exist
    await initializeOrdersCollection();
    
    // Initialize user roles
    console.log('Step 1: Initializing user roles...');
    try {
      await initializeUserRoles();
      console.log('User roles initialized successfully.');
    } catch (roleError) {
      console.error('Error initializing user roles:', roleError);
      console.log('Continuing with product initialization despite role initialization failure.');
    }
    
    // Initialize products with a short delay to allow Firebase to process
    console.log('Waiting 1 second before proceeding to product initialization...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Step 2: Initializing products...');
    try {
      await initializeProductsDatabase(sampleProducts);
      console.log('Products initialized successfully.');
    } catch (productError) {
      console.error('Error initializing products:', productError);
      // Try the alternate method if the first method fails
      await initializeProductsDirectly();
    }
    
    // Mark database as initialized
    await setDoc(settingsRef, {
      initialized: true,
      timestamp: serverTimestamp(),
      version: '1.0.0'
    });
    
    console.log('Database initialization completed successfully!');
  } catch (error) {
    console.error('Fatal error during database initialization:', error);
    throw error;
  }
}

// Initialize orders collection with a sample order
async function initializeOrdersCollection(): Promise<boolean> {
  try {
    console.log('Initializing orders collection...');
    
    // Check if orders collection has any documents
    const ordersQuery = query(collection(db, 'orders'), limit(1));
    const ordersSnapshot = await getDocs(ordersQuery);
    
    if (ordersSnapshot.empty) {
      // Create sample order
      const sampleOrder = {
        userId: 'sample-user',
        items: [
          {
            productId: 'sample-product',
            productName: 'Sample Product',
            quantity: 1,
            unitPrice: 24.99,
            totalPrice: 24.99
          }
        ],
        subtotal: 24.99,
        tax: 2.50,
        shipping: 5.99,
        total: 33.48,
        status: 'pending',
        paymentMethod: 'bank',
        paymentId: 'sample-payment',
        shippingAddress: {
          name: 'Sample Customer',
          street: '123 Sample St',
          city: 'Sample City',
          state: 'Sample State',
          postalCode: '12345',
          country: 'US',
          phone: '555-123-4567'
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await setDoc(doc(collection(db, 'orders'), 'sample-order'), sampleOrder);
      console.log('Sample order created');
    } else {
      console.log('Orders collection already has data');
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing orders collection:', error);
    return false;
  }
}

// Alternative method to initialize products directly
async function initializeProductsDirectly(): Promise<boolean> {
  try {
    console.log('Initializing products directly...');
    
    // Check if products collection has any documents
    const productsQuery = query(collection(db, 'products'), limit(1));
    const productsSnapshot = await getDocs(productsQuery);
    
    if (productsSnapshot.empty) {
      console.log('Products collection empty, adding sample products...');
      
      // Create each product with a custom ID
      for (const product of sampleProducts) {
        const customId = `${product.flavor.toLowerCase().replace(/\s+/g, '-')}-${product.strength}mg`;
        await setDoc(doc(collection(db, 'products'), customId), {
          ...product,
          id: customId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        console.log(`Added ${product.flavor} ${product.strength}mg product`);
      }
    } else {
      console.log('Products collection already has data');
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing products directly:', error);
    return false;
  }
}

// Create an initial owner account for first-time setup
export async function setupInitialOwner(email: string, password: string): Promise<string> {
  console.log('Setting up initial owner account...');
  try {
    const ownerId = await createInitialOwner(email, password);
    console.log('Initial owner account created successfully!');
    return ownerId;
  } catch (error) {
    console.error('Error creating initial owner account:', error);
    throw error;
  }
}

// Check and create a demo owner if no owner exists
export async function ensureOwnerExists(): Promise<boolean> {
  try {
    console.log('Checking if owner exists...');
    
    // Check if an owner already exists
    const ownersQuery = query(
      collection(db, 'users'), 
      where('isOwner', '==', true),
      limit(1)
    );
    const ownersSnapshot = await getDocs(ownersQuery);
    
    if (ownersSnapshot.empty) {
      console.log('No owner found, creating demo owner...');
      
      // Create demo owner
      const ownerId = 'demo-owner';
      const demoOwner = {
        id: ownerId,
        email: 'demo-owner@example.com',
        firstName: 'Demo',
        lastName: 'Owner',
        displayName: 'Demo Owner',
        role: 'owner',
        isOwner: true,
        isAdmin: true,
        approved: true,
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await setDoc(doc(collection(db, 'users'), ownerId), demoOwner);
      console.log('Demo owner created');
      
      // Create demo pending user for approval workflow
      const pendingId = 'pending-user';
      const pendingUser = {
        id: pendingId,
        email: 'pending@example.com',
        firstName: 'Pending',
        lastName: 'User',
        displayName: 'Pending User',
        role: 'distributor',
        isAdmin: false,
        isOwner: false,
        approved: false,
        status: 'pending',
        companyName: 'Demo Distribution Company',
        phone: '555-123-4567',
        businessDescription: 'This is a demo pending user awaiting approval',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await setDoc(doc(collection(db, 'users'), pendingId), pendingUser);
      console.log('Demo pending user created');
      
      return true;
    } else {
      console.log('Owner already exists');
      return false;
    }
  } catch (error) {
    console.error('Error ensuring owner exists:', error);
    return false;
  }
}

// Function to be called on application startup
export async function initializeApplication(): Promise<boolean> {
  try {
    // Initialize database if needed
    await initializeDatabase();
    
    // Ensure owner exists
    await ensureOwnerExists();
    
    return true;
  } catch (error) {
    console.error('Error initializing application:', error);
    return false;
  }
}

// Export the default function for backwards compatibility
export default initializeDatabase;