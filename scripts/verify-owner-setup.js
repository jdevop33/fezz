/**
 * Owner Setup Verification Script
 * 
 * This script helps you verify if an owner account exists in the system
 * and provides instructions on how to set up the initial owner.
 * 
 * Usage:
 * 1. Run this script with Node.js
 *    node scripts/verify-owner-setup.js
 * 
 * 2. Follow the instructions to complete the owner setup process
 */

// Import Firebase dependencies
const { initializeApp } = require('firebase/app');
const { 
  getFirestore, 
  collection, 
  query, 
  where, 
  getDocs, 
  limit 
} = require('firebase/firestore');

// Load environment variables or use defaults
require('dotenv').config();

// Firebase configuration - replace with your actual config or load from environment variables
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkIfOwnerExists() {
  console.log('Checking if an owner account exists...');
  
  try {
    const ownersQuery = query(
      collection(db, 'users'),
      where('isOwner', '==', true),
      limit(1)
    );
    
    const ownersSnapshot = await getDocs(ownersQuery);
    
    if (!ownersSnapshot.empty) {
      console.log('✅ Owner account found!');
      ownersSnapshot.forEach(doc => {
        const owner = doc.data();
        console.log(`Owner details:`);
        console.log(`- ID: ${doc.id}`);
        console.log(`- Email: ${owner.email}`);
        console.log(`- Name: ${owner.displayName || 'Not set'}`);
        console.log(`- Created: ${owner.createdAt ? new Date(owner.createdAt.seconds * 1000).toLocaleString() : 'Unknown'}`);
      });
      return true;
    } else {
      console.log('❌ No owner account found. You need to set up an owner account.');
      console.log('\nSetup Instructions:');
      console.log('1. Start your application (npm run dev)');
      console.log('2. Navigate to the setup page: http://localhost:5173/setup');
      console.log('3. Follow the instructions to create an owner account.');
      console.log('\nOnce complete, run this script again to verify the owner account was created.');
      return false;
    }
  } catch (error) {
    console.error('Error checking for owner account:', error);
    throw error;
  }
}

// Generate an admin setup token for emergency access
function generateAdminSetupToken() {
  const token = Math.random().toString(36).substring(2, 15) + 
                Math.random().toString(36).substring(2, 15);
  
  console.log('\n🔑 Emergency Admin Setup Token:');
  console.log(`To reset or create a new owner in an emergency, use the following URL:`);
  console.log(`http://localhost:5173/setup?admin-setup=${token}`);
  console.log(`\nStore this token securely for emergency access.`);
  
  return token;
}

// Main function
async function main() {
  console.log('===========================================');
  console.log('🛡️  Owner Account Setup Verification Tool 🛡️');
  console.log('===========================================\n');
  
  try {
    const ownerExists = await checkIfOwnerExists();
    
    console.log('\n-------------------------------------------');
    
    if (!ownerExists) {
      console.log('\nNo owner found. You should set up an owner account immediately.');
    } else {
      console.log('\nOwner account exists. Your system is correctly set up.');
      console.log('You can log in as the owner to manage your system.');
    }
    
    // Generate an admin setup token for emergency access
    const adminToken = generateAdminSetupToken();
    
    console.log('\n===========================================');
    console.log('Verification completed successfully!');
    console.log('===========================================');
    
  } catch (error) {
    console.error('\nVerification failed:', error);
    console.log('\nPlease check your Firebase configuration and try again.');
  }
}

// Run the main function
main().catch(console.error);