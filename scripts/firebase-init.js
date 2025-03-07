/**
 * Simple Firebase initialization script to set up initial database structure
 * Run with: node --experimental-json-modules firebase-init.js
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import * as dotenv from 'dotenv';
import { writeFileSync } from 'fs';

// Load .env file
dotenv.config();

// Firebase configuration - make sure these values are set in your .env file
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Print current config (excluding apiKey)
console.log('Firebase configuration:', {
  ...firebaseConfig,
  apiKey: firebaseConfig.apiKey ? '[HIDDEN]' : undefined
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Define sample data
const sampleProducts = [
  {
    itemPN: 'Apple mint',
    description: 'Tobacco Free Nicotine Pouch, 6mg/pouch',
    strength: 6,
    flavor: 'Apple mint',
    price: 24.99,
    wholesalePrice: 18.99,
    inventoryCount: 10000,
    category: 'nicotine-pouches',
    imageUrl: '/images/products/apple-mint.jpg',
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
    imageUrl: '/images/products/apple-mint.jpg',
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
    imageUrl: '/images/products/cool-mint.jpg',
    active: true
  },
  {
    itemPN: 'Cool mint',
    description: 'Tobacco Free Nicotine Pouch, 12mg/pouch',
    strength: 12,
    flavor: 'Cool mint',
    price: 26.99,
    wholesalePrice: 19.99,
    inventoryCount: 8000,
    category: 'nicotine-pouches',
    imageUrl: '/images/products/cool-mint.jpg',
    active: true
  }
];

// User roles
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

// Categories
const categories = [
  {
    id: 'nicotine-pouches',
    name: 'Nicotine Pouches',
    description: 'Tobacco-free nicotine pouches',
    active: true
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'Accessories for nicotine products',
    active: true
  }
];

// Initialize user roles
async function initializeRoles() {
  console.log('Initializing user roles...');
  
  for (const [role, data] of Object.entries(userRoles)) {
    try {
      await setDoc(doc(db, 'settings', `role_${role}`), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });
      console.log(`✅ Role ${role} initialized`);
    } catch (error) {
      console.error(`❌ Error initializing role ${role}:`, error);
    }
  }
}

// Initialize categories
async function initializeCategories() {
  console.log('Initializing categories...');
  
  for (const category of categories) {
    try {
      await setDoc(doc(db, 'categories', category.id), {
        ...category,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });
      console.log(`✅ Category ${category.name} initialized`);
    } catch (error) {
      console.error(`❌ Error initializing category ${category.name}:`, error);
    }
  }
}

// Initialize products
async function initializeProducts() {
  console.log('Initializing products...');
  
  for (const product of sampleProducts) {
    try {
      const customId = `${product.flavor.toLowerCase().replace(/\s+/g, '-')}-${product.strength}mg`;
      await setDoc(doc(db, 'products', customId), {
        ...product,
        id: customId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });
      console.log(`✅ Product ${customId} initialized`);
    } catch (error) {
      console.error(`❌ Error initializing product ${product.flavor}:`, error);
    }
  }
}

// Create owner account
async function createOwnerAccount(email, password) {
  console.log(`Creating owner account with email: ${email}...`);
  
  try {
    // Create the user account with Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Add user to Firestore as owner
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      displayName: 'System Owner',
      role: 'owner',
      isAdmin: true,
      isOwner: true,
      approved: true,
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    console.log(`✅ Owner account created with UID: ${user.uid}`);
    return user.uid;
  } catch (error) {
    console.error('❌ Error creating owner account:', error);
    if (error.code === 'auth/email-already-in-use') {
      console.log('Owner account already exists. Continuing...');
      return null;
    }
    throw error;
  }
}

// Main function
async function main() {
  console.log('Starting Firebase initialization...');
  
  try {
    // Initialize user roles
    await initializeRoles();
    
    // Initialize categories
    await initializeCategories();
    
    // Initialize products
    await initializeProducts();
    
    // Create owner account - only if requested via command line args
    const shouldCreateOwner = process.argv.includes('--create-owner');
    if (shouldCreateOwner) {
      const email = process.argv[process.argv.indexOf('--create-owner') + 1];
      const password = process.argv[process.argv.indexOf('--create-owner') + 2];
      
      if (!email || !password) {
        console.error('❌ Email and password required for owner creation.');
        console.log('Usage: node firebase-init.js --create-owner email@example.com password');
      } else {
        await createOwnerAccount(email, password);
      }
    }
    
    console.log('✅ Firebase initialization completed successfully!');
    
    // Create a success file
    writeFileSync('firebase-init-success.json', JSON.stringify({
      success: true,
      timestamp: new Date().toISOString(),
      message: 'Firebase initialization completed successfully'
    }, null, 2));
    
  } catch (error) {
    console.error('❌ Error during Firebase initialization:', error);
    
    // Create an error file
    writeFileSync('firebase-init-error.json', JSON.stringify({
      success: false,
      timestamp: new Date().toISOString(),
      error: error.message || String(error)
    }, null, 2));
    
    process.exit(1);
  }
}

// Run the main function
main().catch(console.error);