/**
 * Import product catalog data from a JSON file into Firebase Firestore
 * Usage: node --experimental-json-modules import-products.js ./catalog-data.json
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import * as dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

// Load .env file
dotenv.config();

// Check for JSON file argument
if (process.argv.length < 3) {
  console.error('Please provide a JSON file path: node import-products.js ./catalog-data.json');
  process.exit(1);
}

const jsonFilePath = process.argv[2];

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

// Import products from JSON file
async function importProducts() {
  try {
    console.log(`Reading product data from ${jsonFilePath}...`);
    
    // Read and parse the JSON file
    const fileContent = await fs.readFile(jsonFilePath, 'utf-8');
    const products = JSON.parse(fileContent);
    
    if (!Array.isArray(products)) {
      throw new Error('JSON file must contain an array of products');
    }
    
    console.log(`Found ${products.length} products to import`);
    
    // Process each product
    let importedCount = 0;
    let errorCount = 0;
    
    for (const product of products) {
      try {
        // Validate required fields
        if (!product.itemPN || !product.flavor) {
          console.warn(`Skipping product missing required fields:`, product);
          errorCount++;
          continue;
        }
        
        // Generate ID based on flavor and strength (or use provided ID)
        const productId = product.id || `${product.flavor.toLowerCase().replace(/\s+/g, '-')}-${product.strength}mg`;
        
        // Add timestamps and ensure id field
        const productData = {
          ...product,
          id: productId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        
        // Set the document in Firestore
        await setDoc(doc(db, 'products', productId), productData, { merge: true });
        console.log(`✅ Imported: ${productId}`);
        importedCount++;
        
        // Add a small delay to avoid overwhelming Firestore
        if (importedCount % 10 === 0) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error(`❌ Error importing product:`, product, error);
        errorCount++;
      }
    }
    
    console.log(`Import completed:`);
    console.log(`- Successfully imported: ${importedCount} products`);
    console.log(`- Errors: ${errorCount} products`);
    
  } catch (error) {
    console.error('❌ Error during import:', error);
    process.exit(1);
  }
}

// Run the import
importProducts()
  .then(() => {
    console.log('✅ Import process completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Fatal error during import:', error);
    process.exit(1);
  });