/**
 * Simple import script for catalog data
 * Assumes 'products' collection already exists in Firestore
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import fs from 'fs/promises';
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Import products from catalog-data.json
async function importProducts() {
  try {
    console.log('Reading catalog data...');
    
    // Read catalog-data.json
    const data = await fs.readFile('./catalog-data.json', 'utf8');
    const catalogData = JSON.parse(data);
    
    // Get products array
    const products = catalogData.products || [];
    
    if (products.length === 0) {
      console.log('No products found in catalog data');
      return;
    }
    
    console.log(`Found ${products.length} products to import`);
    
    // Import products one by one
    for (const product of products) {
      try {
        // Create a document ID from flavor and strength
        const docId = `${product.flavor.toLowerCase().replace(/\s+/g, '-')}-${product.strength}mg`;
        
        // Add timestamps and ID
        const productData = {
          ...product,
          id: docId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        console.log(`Importing: ${docId}`);
        
        // Add to Firestore
        await setDoc(doc(db, 'products', docId), productData);
        
        console.log(`✅ Imported: ${docId}`);
        
        // Add a small delay between writes
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`❌ Failed to import product:`, product.flavor, error);
      }
    }
    
    console.log('Import completed!');
  } catch (error) {
    console.error('❌ Error reading or parsing catalog data:', error);
  }
}

// Run the import
importProducts()
  .then(() => {
    console.log('Script completed');
    setTimeout(() => process.exit(0), 5000);
  })
  .catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });