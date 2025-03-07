/**
 * Initialize Firestore database and collections
 * This script checks if the database exists and creates it if necessary
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, serverTimestamp, enableIndexedDbPersistence } from 'firebase/firestore';
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

async function initializeFirestore() {
  try {
    console.log('Initializing Firebase and Firestore...');
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    // Enable offline persistence
    try {
      await enableIndexedDbPersistence(db);
      console.log('Offline persistence enabled');
    } catch (err) {
      console.log('Offline persistence could not be enabled:', err.message);
    }
    
    // Create a test document to verify database access
    try {
      const testDocRef = doc(collection(db, 'system'), 'init');
      await setDoc(testDocRef, {
        initialized: true,
        timestamp: serverTimestamp()
      });
      console.log('✅ Successfully connected to Firestore and created test document');
    } catch (error) {
      console.error('❌ Error creating test document:', error);
      if (error.code === 'permission-denied') {
        console.log('\n⚠️ PERMISSION DENIED: Check your Firebase rules and make sure your account has proper access.');
      } else if (error.code === 'not-found') {
        console.log('\n⚠️ DATABASE NOT FOUND: The Firestore database has not been created yet.');
        console.log('Go to Firebase Console and create a Firestore database:');
        console.log(`https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore`);
      }
      return false;
    }
    
    // Initialize collections
    const collections = ['products', 'categories', 'users', 'orders'];
    for (const collectionName of collections) {
      try {
        const testDoc = doc(collection(db, collectionName), 'initialized');
        await setDoc(testDoc, {
          timestamp: serverTimestamp(),
          initialized: true
        }, { merge: true });
        console.log(`✅ Collection initialized: ${collectionName}`);
      } catch (error) {
        console.error(`❌ Error initializing collection ${collectionName}:`, error);
      }
    }
    
    console.log('\n✅ Firestore initialization complete');
    return true;
  } catch (error) {
    console.error('❌ Fatal error during initialization:', error);
    return false;
  }
}

// Run initialization if executed directly
if (import.meta.url.endsWith(process.argv[1])) {
  initializeFirestore()
    .then(success => {
      if (success) {
        console.log('✅ Database initialized successfully');
      } else {
        console.error('❌ Database initialization failed');
        process.exit(1);
      }
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Unhandled error:', error);
      process.exit(1);
    });
}

export default initializeFirestore;