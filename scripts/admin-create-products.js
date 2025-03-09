/**
 * Create products using Firebase Admin SDK
 * This script requires serviceAccountKey.json to be present in the project root
 */

import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to service account key file
const serviceAccountPath = join(__dirname, '..', 'serviceAccountKey.json');

try {
  // Read and parse service account key file
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
  
  // Initialize Admin SDK with service account
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
  });
  
  console.log('Firebase Admin SDK initialized successfully');
  
  // Get Firestore instance
  const db = admin.firestore();
  
  // Sample product
  const product = {
    id: "sample-product",
    flavor: "Sample Flavor",
    itemPN: "SAMPLE-001",
    price: 24.99,
    active: true,
    category: "samples",
    description: "This is a sample product",
    imageUrl: "/images/products/sample.jpg",
    inventoryCount: 10,
    strength: 6,
    wholesalePrice: 19.99,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };
  
  // Function to create product
  async function createProduct() {
    try {
      console.log('Adding sample product to Firestore...');
      
      // Set document with ID
      await db.collection('products').doc(product.id).set(product);
      
      console.log('✅ Sample product added successfully!');
      return true;
    } catch (error) {
      console.error('Error adding sample product:', error);
      return false;
    }
  }
  
  // Run the function and exit
  createProduct()
    .then(success => {
      if (success) {
        console.log('Product creation successful');
      } else {
        console.error('Product creation failed');
      }
      process.exit(0);
    })
    .catch(error => {
      console.error('Unhandled error:', error);
      process.exit(1);
    });
    
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error);
  process.exit(1);
}