/**
 * Manual import of products to Firestore
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import * as dotenv from 'dotenv';

// Load .env file
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

// Print current config (excluding apiKey)
console.log('Firebase configuration:', {
  ...firebaseConfig,
  apiKey: firebaseConfig.apiKey ? '[HIDDEN]' : undefined
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
    wholesalePrice: 19.99
  },
  {
    id: "spearmint-16mg",
    flavor: "Spearmint",
    itemPN: "Spearmint-16",
    price: 24.99,
    active: true,
    category: "nicotine-pouches",
    description: "Tobacco Free Nicotine Pouch, 16mg/pouch",
    imageUrl: "/images/products/spearmint-16mg.jpg",
    inventoryCount: 5000,
    strength: 16,
    wholesalePrice: 19.99
  },
  {
    id: "cherry-6mg",
    flavor: "Cherry",
    itemPN: "Cherry-6",
    price: 24.99,
    active: true,
    category: "nicotine-pouches",
    description: "Tobacco Free Nicotine Pouch, 6mg/pouch",
    imageUrl: "/images/products/cherry-6mg.jpg",
    inventoryCount: 5000,
    strength: 6,
    wholesalePrice: 19.99
  }
];

// Import products
async function importProducts() {
  try {
    console.log(`Manually importing ${products.length} sample products...`);
    
    for (const product of products) {
      try {
        // Add timestamps
        const productData = {
          ...product,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        
        // Set the document in Firestore
        await setDoc(doc(db, 'products', product.id), productData);
        console.log(`✅ Imported: ${product.id}`);
        
      } catch (error) {
        console.error(`❌ Error importing product:`, product.id, error);
      }
    }
    
    console.log(`Import completed!`);
    
  } catch (error) {
    console.error('❌ Error during import:', error);
    process.exit(1);
  }
}

// Run the import
importProducts()
  .then(() => {
    console.log('✅ Manual import process completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Fatal error during import:', error);
    process.exit(1);
  });