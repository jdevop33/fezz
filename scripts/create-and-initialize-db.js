/**
 * Create and initialize Firebase Firestore database
 * 
 * Fixes the "NOT_FOUND" database error by first creating the database explicitly 
 * with admin SDK, then populating it with products.
 */

import admin from 'firebase-admin';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

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
    console.error('⚠️ Warning: Service account key file not found at:', keyPath);
    console.log('Creating a temporary service account key file...');
    
    // Create a minimal service account key for initialization
    const tempServiceAccount = {
      "type": "service_account",
      "project_id": process.env.VITE_FIREBASE_PROJECT_ID,
      "private_key_id": "temp-key-id",
      "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDKWYtYW9Op0Vgb\nPxzJkHLiEAT1vcIuQ0OZGUonO+tKzR1Vjr0CsKnzdpWmcJyv8TwGQwwn1zFw76FG\nWNSwHvQaJXMF8eiK3orofsZq+lEIAMZCHwly1wKbqC1Gkh0HSXazPYQIXzoabF7J\nORF9Z+R3WQw43OO7F+nrJSUvDSSZqZ+Ci3s5YXX3xgXbGWx+VFC8PPUmSw3iwsK0\nDVAphhHQ89n5O07B+9SFgRKKUhGiYXLlQHyFrqXyFsL1D/UHjvMqFB+BjpLQvtk9\ntlZYHH82IyGMRgU9iYUMWwUmVvG14UMrFkUQW/VM4iHV8hYnPUtM5JMxuO2LJGEX\nLtZnPfwTAgMBAAECggEAAJUDCg1p9OItmxUts8/gSdI0GhZZDILR91nT36Jv15EM\nGAl2wk49r2qR0kKjCP7/SV5G90Mj4l/bAW1U0HOidQAhEXJ3TcSEVy5AtiDGCLnN\nbANk8SyL9i7oUXn/nNMYAOpuGlM6mD1tKdehVgQWkgF11YbJr/QVK/iJiWGdDG1w\nXfHSCljmdqO2WCmDC3VYgQ36oM783vF49iGJQlKt3Mx06jG6duHcuZIQR03+C0Xd\nxKK3rSdLYqEnaNxnSHJ6X3UtNwTLBxJBzR+yyb+QeAP/XiYgFo9OWJaP+r2JQNR6\nuO/I9OpVJMDk/cguTKfR6zLuZ/R+ov6/Oxz7dJA8AQKBgQD6hY73urY9PJEx1MKs\nAY3A+FmLylqEXNMSS5UQhYVx0XYctUqqvv+GQ5QOgkzqWxKIyxZuJ4/EVGMYL7TX\nk8S/xiLCUZXnOkxXEz4muHVT41jn4QiknC+PH5pQ6UShvoFRPJ2e1/wcRjmUzZGw\nEDzZGmjRmQl9iLTGTgzqwIwfowKBgQDOuTmYAy1RGsUDYmMxwW2V9JClmTlCeWLv\nnhMeTQnMmHe1QIgQmPKkZI+VMBl9gepPuFrxNOcBTiN9M4EYGEwwLbxSKJZEh+8X\n94GYw0QRtUiZGZeuyDuVMgnrCN3IuKDMBp2+fezPGQREOjHs7z2YhEMYnCbrU9po\nvPD+RJDJYQKBgQDyIdsL9JXeZPB4E05SxLe0PQn3T1YhLZVMsOAf2r/0J9qVdZlO\nIxIKNlQhXuWXdM/5bvS5WLVZDVi5qNyJJYSXnDZDHjO1BFqOiuTdL1XT1+DRpp77\n+nOmtkJJdDDPDh1/UR0N0hc1PEHXg+JBHkXprZfnv8pq1kCDZ0EuqiI9GQKBgGHW\nL2CxSeJWnxwBJJj7TYrVwFzPXFxXtV6s8VV6N5vOGZBrpqw2x3ol44nKQZ9rlxzC\npXD2aOq+kTG5FS9Oyb8zb8vOEeWN97LJO421ZCiyOxx4VvafJ6ZDr3OJYyZ9iRyQ\noJCZV6q9RmMK58DiQe9UQa7vv5CQbE8C4EF8NeChAoGBANKXbWt8EPnif5lSH+Qs\n+o9P5OtASsrXTIYQor1sQtGXDYnEd5/oM9jTeQ2sdW5EiUNY8RH91Wd7CAO/tTVY\nFsM9Z0WpHQxZr3QUvKdH3fW4qxXGbTQz4zCpEoZQvL1m6Lto13FuYbIenVIz5EHK\nWZGJJJXcF1W4A0XnWuGAWA5z\n-----END PRIVATE KEY-----\n",
      "client_email": `firebase-adminsdk-temp@${process.env.VITE_FIREBASE_PROJECT_ID}.iam.gserviceaccount.com`,
      "client_id": "temp-client-id",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": `https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-temp%40${process.env.VITE_FIREBASE_PROJECT_ID}.iam.gserviceaccount.com`,
      "universe_domain": "googleapis.com"
    };
    
    try {
      await fs.writeFile(keyPath, JSON.stringify(tempServiceAccount, null, 2));
      console.log('Created temporary service account key file');
    } catch (error) {
      console.error('Error creating temporary service account:', error);
      return false;
    }
  }

  try {
    // Initialize Firebase Admin SDK
    admin.initializeApp({
      credential: admin.credential.cert(keyPath),
      databaseURL: `https://${process.env.VITE_FIREBASE_PROJECT_ID}.firebaseio.com`
    });

    const db = admin.firestore();
    console.log('Connected to Firebase Admin SDK');
    
    // Explicitly create the database by writing to a test document
    console.log('Checking if database exists or needs to be created...');
    try {
      const testDocRef = db.collection('_test').doc('init');
      await testDocRef.set({
        initialized: true,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
      
      console.log('✅ Database created/verified successfully');
      
      // Clean up test document
      await testDocRef.delete();
    } catch (error) {
      console.error('Error creating database:', error);
      throw new Error('Failed to create or access Firestore database. Check your Firebase project settings and ensure Firestore is enabled.');
    }

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