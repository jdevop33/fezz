/**
 * Fix Firebase Connection and Import a Test Product
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, collection, doc, setDoc } from 'firebase/firestore';
import dotenv from 'dotenv';

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
  apiKey: '[REDACTED]'
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function addTestProduct() {
  try {
    console.log('Adding test product to Firestore...');
    
    // Simple test product
    const testProduct = {
      id: 'test-product',
      name: 'Test Product',
      description: 'This is a test product',
      price: 9.99,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Set document with explicit ID
    await setDoc(doc(db, 'products', 'test-product'), testProduct);
    console.log('✅ Test product added successfully!');
    
  } catch (error) {
    console.error('Error adding test product:', error);
  }
}

// Run the test
addTestProduct()
  .then(() => console.log('Done'))
  .catch(console.error);