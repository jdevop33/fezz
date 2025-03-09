/**
 * Create a Firestore collection
 * Pass the collection name as an argument to create a specific collection:
 * node create-collection.js orders
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
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

// Define the collections and their initialization structure
const collectionsConfig = {
  users: {
    initDoc: 'collection-info',
    data: {
      description: 'Contains all user accounts and profiles',
      fields: {
        firstName: 'string',
        lastName: 'string',
        email: 'string',
        displayName: 'string',
        role: 'string',
        approved: 'boolean',
        status: 'string',
        createdAt: 'timestamp',
        updatedAt: 'timestamp'
      },
      timestamps: true
    }
  },
  orders: {
    initDoc: 'collection-info',
    data: {
      description: 'Contains all orders and their details',
      fields: {
        userId: 'string',
        items: 'array',
        subtotal: 'number',
        tax: 'number',
        shipping: 'number',
        total: 'number',
        status: 'string',
        paymentMethod: 'string',
        paymentId: 'string',
        shippingAddress: 'object',
        distributorId: 'string',
        trackingNumber: 'string',
        createdAt: 'timestamp',
        updatedAt: 'timestamp'
      },
      timestamps: true
    }
  },
  products: {
    initDoc: 'collection-info',
    data: {
      description: 'Contains all products in the catalog',
      fields: {
        itemPN: 'string',
        description: 'string',
        strength: 'number',
        flavor: 'string',
        price: 'number',
        wholesalePrice: 'number',
        inventoryCount: 'number',
        category: 'string',
        imageUrl: 'string',
        active: 'boolean',
        createdAt: 'timestamp',
        updatedAt: 'timestamp'
      },
      timestamps: true
    }
  },
  pendingUsers: {
    initDoc: 'collection-info',
    data: {
      description: 'Contains user accounts awaiting approval',
      fields: {
        firstName: 'string',
        lastName: 'string',
        email: 'string',
        displayName: 'string',
        uid: 'string',
        role: 'string',
        companyName: 'string',
        phone: 'string',
        businessDescription: 'string',
        status: 'string',
        createdAt: 'timestamp'
      },
      timestamps: true
    }
  }
};

// Create a collection based on its configuration
async function createCollection(collectionName) {
  if (!collectionsConfig[collectionName]) {
    console.error(`Error: Collection "${collectionName}" is not defined in the configuration.`);
    console.log('Available collections:', Object.keys(collectionsConfig).join(', '));
    return false;
  }

  try {
    console.log(`Creating collection "${collectionName}"...`);
    
    const config = collectionsConfig[collectionName];
    const collectionRef = collection(db, collectionName);
    const initDocRef = doc(collectionRef, config.initDoc);
    
    await setDoc(initDocRef, {
      ...config.data,
      initialized: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // For orders collection, create a sample order document
    if (collectionName === 'orders') {
      const sampleOrderRef = doc(collectionRef, 'sample-order');
      await setDoc(sampleOrderRef, {
        userId: 'sample-user',
        items: [
          {
            productId: 'sample-product',
            productName: 'Sample Product',
            quantity: 1,
            unitPrice: 24.99,
            totalPrice: 24.99
          }
        ],
        subtotal: 24.99,
        tax: 2.50,
        shipping: 5.99,
        total: 33.48,
        status: 'pending',
        paymentMethod: 'bank',
        paymentId: 'sample-payment',
        shippingAddress: {
          name: 'Sample Customer',
          street: '123 Sample St',
          city: 'Sample City',
          state: 'Sample State',
          postalCode: '12345',
          country: 'Sample Country',
          phone: '555-123-4567'
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log('✅ Sample order created');
    }
    
    console.log(`✅ Successfully created collection "${collectionName}"`);
    return true;
  } catch (error) {
    console.error(`❌ Error creating collection "${collectionName}":`, error);
    return false;
  }
}

// Determine which collection to create based on command-line arguments
const collectionName = process.argv[2] || 'orders'; // Default to 'orders'

// Run the function
createCollection(collectionName)
  .then(success => {
    if (success) {
      console.log(`✅ Collection "${collectionName}" created successfully`);
    } else {
      console.error(`❌ Failed to create collection "${collectionName}"`);
      process.exit(1);
    }
    setTimeout(() => process.exit(0), 3000); // Give some time for operations to complete
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });