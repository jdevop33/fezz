/**
 * Combined script to migrate data from Supabase to Firebase and initialize the application
 * Run with: node --experimental-json-modules migrate-and-initialize.js
 */

import { createClient } from '@supabase/supabase-js';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs, query, limit, serverTimestamp } from 'firebase/firestore';
import dotenv from 'dotenv';
import { promises as fs } from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

// Function to check if migration is needed by checking if Firestore already has data
async function checkIfMigrationNeeded() {
  console.log('Checking if migration is needed...');
  
  // Firebase configuration
  const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN, 
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID
  };
  
  // Initialize Firebase
  const firebaseApp = initializeApp(firebaseConfig);
  const db = getFirestore(firebaseApp);
  
  const collections = ['products', 'users', 'orders', 'settings'];
  const collectionCounts = {};
  
  // Check each collection for existing data
  for (const collectionName of collections) {
    try {
      const q = query(collection(db, collectionName), limit(1));
      const snapshot = await getDocs(q);
      collectionCounts[collectionName] = snapshot.size;
    } catch (error) {
      console.error(`Error checking collection ${collectionName}:`, error);
      collectionCounts[collectionName] = 'error';
    }
  }
  
  console.log('Current Firestore state:');
  console.table(collectionCounts);
  
  // Determine if migration is needed - if all collections are empty
  const needsMigration = Object.values(collectionCounts).every(count => count === 0);
  
  return { 
    needsMigration,
    collectionCounts
  };
}

// Function to run the database initialization
async function runInitialization() {
  console.log('Running database initialization...');
  
  // Sample product data based on the nicotine pouches inventory
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
  
  // Firebase configuration
  const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN, 
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID
  };
  
  // Initialize Firebase
  const firebaseApp = initializeApp(firebaseConfig);
  const db = getFirestore(firebaseApp);
  
  // Initialize user roles
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
  
  console.log('Setting up user roles...');
  for (const [role, data] of Object.entries(userRoles)) {
    try {
      await setDoc(doc(db, 'settings', `role_${role}`), {
        ...data,
        updatedAt: serverTimestamp()
      }, { merge: true });
      console.log(`Role ${role} initialized`);
    } catch (error) {
      console.error(`Error setting up role ${role}:`, error);
    }
  }
  
  // Initialize products
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
      console.log(`Product ${customId} initialized`);
    } catch (error) {
      console.error(`Error initializing product ${product.flavor}:`, error);
    }
  }
  
  console.log('Database initialization completed!');
}

// Import the migration script
import { migrateData } from './migrate-to-firebase.js';

// Main function
async function main() {
  try {
    console.log('Starting migration and initialization process...');
    
    // Check if migration is needed
    const { needsMigration, collectionCounts } = await checkIfMigrationNeeded();
    
    if (needsMigration) {
      console.log('Migration is needed. Starting migration from Supabase to Firebase...');
      
      // Check if Supabase environment variables are set
      if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
        console.error('Supabase environment variables not found. Cannot proceed with migration.');
        console.log('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
        process.exit(1);
      }
      
      // Run the migration
      await migrateData();
      
      console.log('Migration completed. Waiting 2 seconds before initialization...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    } else {
      console.log('Migration is not needed. Firestore already has data.');
    }
    
    // Run initialization for any missing data
    await runInitialization();
    
    console.log('All tasks completed successfully!');
  } catch (error) {
    console.error('Error during migration and initialization:', error);
    process.exit(1);
  }
}

// Run the main function
main().catch(console.error);