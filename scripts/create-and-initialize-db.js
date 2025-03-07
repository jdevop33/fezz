/**
 * Create and initialize Firebase Firestore database
 * 
 * This script is meant to be run on the actual Firebase project, not locally.
 * It requires proper Firebase admin credentials.
 */

import admin from 'firebase-admin';
import fs from 'fs/promises';
import path from 'path';

// Check if service account key file exists
async function checkServiceAccountKey(keyPath) {
  try {
    await fs.access(keyPath);
    return true;
  } catch (error) {
    return false;
  }
}

async function createAndInitializeDb() {
  console.log('Create and initialize Firebase database');

  // Check for service account key file
  const keyPath = path.resolve(process.cwd(), 'serviceAccountKey.json');
  const hasKeyFile = await checkServiceAccountKey(keyPath);

  if (!hasKeyFile) {
    console.error('❌ Error: Service account key file not found at:', keyPath);
    console.log('\nTo create this file:');
    console.log('1. Go to the Firebase Console: https://console.firebase.google.com/');
    console.log('2. Navigate to Project Settings > Service accounts');
    console.log('3. Click "Generate new private key"');
    console.log('4. Save the file as "serviceAccountKey.json" in the project root');
    return false;
  }

  try {
    // Initialize Firebase Admin SDK
    admin.initializeApp({
      credential: admin.credential.cert(keyPath)
    });

    const db = admin.firestore();
    console.log('Connected to Firebase Admin SDK');

    // Read catalog data
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
    console.log('Adding products to Firestore...');
    const batch = db.batch();
    let batchCount = 0;
    const batchLimit = 500; // Firestore batch limit

    for (const product of products) {
      const id = product.id || `${product.flavor.toLowerCase().replace(/\s+/g, '-')}-${product.strength}mg`;
      
      // Add timestamps
      const productData = {
        ...product,
        id,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };
      
      const docRef = db.collection('products').doc(id);
      batch.set(docRef, productData);
      batchCount++;

      if (batchCount >= batchLimit) {
        await batch.commit();
        console.log(`✅ Committed batch of ${batchCount} products`);
        batchCount = 0;
      }
    }

    // Commit any remaining operations
    if (batchCount > 0) {
      await batch.commit();
      console.log(`✅ Committed final batch of ${batchCount} products`);
    }

    console.log('\n✅ Database initialization complete!');
    return true;
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    return false;
  }
}

// Run the script if executed directly
if (import.meta.url.endsWith(process.argv[1])) {
  createAndInitializeDb()
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

export default createAndInitializeDb;