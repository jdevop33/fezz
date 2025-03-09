/**
 * Check Firebase DB Connection
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, getDocs, collection } from 'firebase/firestore';
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

console.log('Checking Firebase connection with config:', {
  ...firebaseConfig,
  apiKey: '[HIDDEN]'
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Create a test document in the products collection
async function checkFirestoreDB() {
  try {
    console.log('Attempting to list collections...');
    
    // Try to list collections
    const collections = await getDocs(collection(db, 'nonexistent'));
    console.log('Collections:', collections);
    
  } catch (error) {
    console.error('Error connecting to Firestore:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 'permission-denied') {
      console.log('This is a permissions issue - your rules are working but blocking access');
    } else if (error.message && error.message.includes('NOT_FOUND')) {
      console.log('The database or collection does not exist yet');
    }
  }
}

// Run the function
checkFirestoreDB()
  .then(() => {
    console.log('Check complete');
    setTimeout(() => process.exit(0), 3000); // Give some time for operations to complete
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });