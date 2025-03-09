/**
 * Direct Firestore Import Script
 * Uses explicit database reference for 'fdcdb'
 */

import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  initializeFirestore,
  CACHE_SIZE_UNLIMITED
} from 'firebase/firestore';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

console.log('Firebase configuration:', {
  ...firebaseConfig,
  apiKey: '[HIDDEN]'
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with explicit settings
const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED
});

// Sample products
const products = [
  {
    id: "apple-mint-6mg",
    flavor: "Apple mint",
    itemPN: "Apple mint-6",
    price: 24.99,
    active: true,
    category: "nicotine-pouches",
    description: "Tobacco Free Nicotine Pouch, 6mg/pouch",
    imageUrl: "/images/products/apple-mint-6mg.jpg",
    inventoryCount: 10000,
    strength: 6,
    wholesalePrice: 19.99,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Import products
async function importProducts() {
  try {
    console.log(`Manually importing ${products.length} sample products...`);
    
    for (const product of products) {
      try {
        console.log(`Attempting to import product: ${product.id}`);
        
        // Set the document with merge: true
        await setDoc(doc(db, 'products', product.id), product, { merge: true });
        
        console.log(`✅ Successfully imported: ${product.id}`);
      } catch (error) {
        console.error(`❌ Error importing product ${product.id}:`, error);
      }
    }
    
    console.log(`Import completed!`);
  } catch (error) {
    console.error('❌ Error during import:', error);
  }
}

// Run the import
importProducts()
  .then(() => {
    console.log('✅ Import process completed');
    setTimeout(() => process.exit(0), 5000); // Wait a bit longer
  })
  .catch(error => {
    console.error('❌ Fatal error during import:', error);
    process.exit(1);
  });