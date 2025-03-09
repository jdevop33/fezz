/**
 * Update Firebase config and import products
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import fs from 'fs/promises';

// Updated Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4GZS0GQYDlPeAOSZAj3TiNiPVlmtiYtM",
  authDomain: "fezz-452821.firebaseapp.com",
  projectId: "fezz-452821",
  storageBucket: "fezz-452821.firebasestorage.app",
  messagingSenderId: "673166874579",
  appId: "1:673166874579:web:9226908a9238356ad04126",
  measurementId: "G-KBD1RTNQTD"
};

console.log('Using updated Firebase configuration');

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Import products from catalog data
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
    
    // Import one product first as a test
    const testProduct = products[0];
    const testId = `${testProduct.flavor.toLowerCase().replace(/\s+/g, '-')}-${testProduct.strength}mg`;
    
    console.log(`Testing with product: ${testId}`);
    
    try {
      // Add timestamps and ID
      const productData = {
        ...testProduct,
        id: testId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add to Firestore
      await setDoc(doc(db, 'products', testId), productData);
      
      console.log(`✅ Test successful! Continuing with remaining products...`);
      
      // Import remaining products one by one
      for (let i = 1; i < products.length; i++) {
        const product = products[i];
        const docId = `${product.flavor.toLowerCase().replace(/\s+/g, '-')}-${product.strength}mg`;
        
        // Add timestamps and ID
        const data = {
          ...product,
          id: docId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        console.log(`Importing (${i+1}/${products.length}): ${docId}`);
        
        // Add to Firestore
        await setDoc(doc(db, 'products', docId), data);
        
        console.log(`✅ Imported: ${docId}`);
        
        // Add a small delay between writes
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
    } catch (error) {
      console.error(`❌ Failed initial product test:`, error);
      return;
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
    setTimeout(() => process.exit(0), 3000);
  })
  .catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });