/**
 * Setup a local Firebase emulator for development
 */

import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  connectFirestoreEmulator,
  serverTimestamp
} from 'firebase/firestore';
import * as dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

// Load .env file
dotenv.config();

// Firebase configuration
const firebaseConfig = {
  apiKey: "demo-key-for-local-development",
  projectId: "demo-project-local"
};

console.log('Setting up local Firebase emulator...');

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Connect to local emulator
connectFirestoreEmulator(db, 'localhost', 8080);

async function setupLocalDB() {
  try {
    console.log('\nSetting up local database with sample products...');
    
    // Read the catalog data
    let products = [];
    try {
      const catalogData = await fs.readFile('./catalog-data.json', 'utf-8');
      const jsonData = JSON.parse(catalogData);
      // Handle both formats: array of products or object with products array
      products = Array.isArray(jsonData) ? jsonData : jsonData.products;
      
      if (!products || !Array.isArray(products)) {
        throw new Error('JSON file must contain an array of products or an object with a products array');
      }
      
      console.log(`Loaded ${products.length} products from catalog-data.json`);
    } catch (error) {
      console.log('No catalog-data.json found or invalid format, using default sample products');
      // Use sample products if no catalog data
      products = [
        {
          id: "peppermint-16mg",
          itemPN: "PUXX-PEPPERMINT-16",
          description: "Premium Tobacco-Free Nicotine Pouch, 16mg/pouch",
          flavor: "Peppermint",
          strength: 16,
          price: 24.99,
          wholesalePrice: 18.99,
          inventoryCount: 1000,
          category: "nicotine-pouches",
          imageUrl: "/images/products/peppermint-16mg.jpg",
          active: true
        },
        {
          id: "cherry-16mg",
          itemPN: "PUXX-CHERRY-16",
          description: "Premium Tobacco-Free Nicotine Pouch, 16mg/pouch",
          flavor: "Cherry",
          strength: 16,
          price: 24.99,
          wholesalePrice: 18.99,
          inventoryCount: 1000,
          category: "nicotine-pouches", 
          imageUrl: "/images/products/cherry-16mg.jpg",
          active: true
        },
        {
          id: "apple-mint-16mg",
          itemPN: "PUXX-APPLE-MINT-16",
          description: "Premium Tobacco-Free Nicotine Pouch, 16mg/pouch",
          flavor: "Apple Mint",
          strength: 16,
          price: 24.99,
          wholesalePrice: 18.99,
          inventoryCount: 1000,
          category: "nicotine-pouches",
          imageUrl: "/images/products/apple-mint-16mg.jpg",
          active: true
        }
      ];
    }
    
    // Create products collection
    const productsCol = collection(db, 'products');
    console.log('Adding products to local Firestore emulator...');
    
    for (const product of products) {
      const id = product.id || `${product.flavor.toLowerCase().replace(/\s+/g, '-')}-${product.strength}mg`;
      
      // Add timestamps
      const productData = {
        ...product,
        id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await setDoc(doc(productsCol, id), productData);
      console.log(`✅ Added product: ${productData.flavor} ${productData.strength}mg`);
    }
    
    console.log('\n✅ Local database setup complete!');
    console.log('\nIMPORTANT: To use this local database, you need to:');
    console.log('1. Install Firebase CLI: npm install -g firebase-tools');
    console.log('2. Start the emulator: firebase emulators:start');
    console.log('3. Set your app to use the emulator by adding the connectFirestoreEmulator line');

    return true;
  } catch (error) {
    console.error('❌ Error setting up local database:', error);
    return false;
  }
}

// Run setup if executed directly
if (import.meta.url.endsWith(process.argv[1])) {
  setupLocalDB()
    .then(success => {
      if (success) {
        console.log('✅ Setup completed successfully');
      } else {
        console.error('❌ Setup failed');
        process.exit(1);
      }
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Unhandled error:', error);
      process.exit(1);
    });
}

export default setupLocalDB;