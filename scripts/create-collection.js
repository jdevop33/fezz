/**
 * Create a Firestore collection
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
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
  apiKey: firebaseConfig.apiKey ? '[HIDDEN]' : undefined
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Create a test document in the products collection
async function createTestDocument() {
  try {
    console.log('Attempting to create a test product...');
    
    // Create test document
    const docRef = doc(collection(db, 'products'), 'test-product');
    await setDoc(docRef, {
      name: 'Test Product',
      description: 'This is a test product',
      price: 19.99,
      createdAt: new Date().toISOString()
    });
    
    console.log('✅ Test product created successfully!');
  } catch (error) {
    console.error('Error creating test product:', error);
  }
}

// Run the function
createTestDocument()
  .then(() => {
    console.log('Done');
    setTimeout(() => process.exit(0), 3000); // Give some time for operations to complete
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });