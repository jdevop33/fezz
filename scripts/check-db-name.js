/**
 * Check Firebase database name
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc } from 'firebase/firestore';

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

console.log('Checking Firebase database name with updated config');

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Try to read and write to Firestore
async function checkFirestore() {
  try {
    console.log('Checking if we can create a test collection...');
    
    // Try to add a document to a test collection
    await setDoc(doc(db, 'test_collection', 'test_doc'), {
      name: 'Test Document',
      timestamp: new Date().toISOString()
    });
    
    console.log('Successfully wrote to Firestore!');
    
    // Try to read from the test collection
    const querySnapshot = await getDocs(collection(db, 'test_collection'));
    
    console.log('Successfully read from Firestore!');
    console.log(`Found ${querySnapshot.size} documents in test_collection`);
    
    querySnapshot.forEach(doc => {
      console.log(`Document ID: ${doc.id}`);
      console.log(`Document data:`, doc.data());
    });
    
    return true;
  } catch (error) {
    console.error('Error accessing Firestore:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 'permission-denied') {
      console.log('This is a permissions issue. Check your Firestore rules.');
    } else if (error.message && error.message.includes('NOT_FOUND')) {
      console.log('The database or collection does not exist yet.');
    }
    
    return false;
  }
}

// Run the check
checkFirestore()
  .then(success => {
    if (success) {
      console.log('Firestore check completed successfully!');
    } else {
      console.log('Firestore check failed.');
    }
    
    setTimeout(() => process.exit(0), 3000);
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });