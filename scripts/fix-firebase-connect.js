/**
 * Fix Firebase Connection Issues and Setup Required Collections
 * 
 * This script:
 * 1. Verifies connection to Firebase
 * 2. Creates the orders collection if it doesn't exist
 * 3. Ensures proper user approval workflow
 * 
 * Usage: node fix-firebase-connect.js [collection-name]
 * If no collection name is provided, all collections will be fixed.
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Load service account credentials from file
const serviceAccountPath = path.resolve('./serviceAccountKey.json');
console.log('Loading service account from:', serviceAccountPath);

// Check if service account file exists
if (!fs.existsSync(serviceAccountPath)) {
  console.error('Service account file not found:', serviceAccountPath);
  process.exit(1);
}

// Initialize Firebase Admin SDK with service account
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
console.log('Using service account for project:', serviceAccount.project_id);

// Initialize Firebase Admin
initializeApp({
  credential: cert(serviceAccount)
});

// Get Firestore reference
const db = getFirestore();

// Check database connection and collections
async function checkDatabaseStatus() {
  console.log('Checking Firebase database status...');
  
  const collections = ['users', 'products', 'orders', 'settings'];
  const collectionStatus = {};
  
  // Check each collection
  for (const collectionName of collections) {
    try {
      const snapshot = await db.collection(collectionName).limit(1).get();
      collectionStatus[collectionName] = {
        exists: true,
        isEmpty: snapshot.empty,
        count: snapshot.size
      };
    } catch (error) {
      console.error(`Error checking ${collectionName}:`, error.message);
      collectionStatus[collectionName] = {
        exists: false,
        error: error.message
      };
    }
  }
  
  console.log('Collection status:');
  console.table(collectionStatus);
  
  return collectionStatus;
}

// Create or initialize the orders collection
async function fixOrdersCollection() {
  try {
    console.log('Setting up orders collection...');
    
    // Check if orders collection exists
    const snapshot = await db.collection('orders').limit(1).get();
    
    if (snapshot.empty) {
      // Create sample order document
      const sampleOrder = {
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
          country: 'US',
          phone: '555-123-4567'
        },
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      };
      
      await db.collection('orders').doc('sample-order').set(sampleOrder);
      console.log('✅ Created sample order in orders collection');
    } else {
      console.log('✅ Orders collection already exists with data');
    }
    
    return true;
  } catch (error) {
    console.error('Error fixing orders collection:', error);
    return false;
  }
}

// Ensure settings collection has user role definitions
async function fixSettingsCollection() {
  try {
    console.log('Setting up settings collection with user roles...');
    
    const userRoles = {
      retail: {
        name: 'Retail Customer',
        permissions: ['browse_products', 'place_orders', 'track_orders']
      },
      wholesale: {
        name: 'Wholesale Buyer',
        permissions: ['browse_products', 'place_bulk_orders', 'track_orders', 'get_wholesale_prices', 'earn_commissions']
      },
      distributor: {
        name: 'Distributor',
        permissions: ['handle_orders', 'earn_commissions', 'manage_shipping']
      },
      admin: {
        name: 'Administrator',
        permissions: ['manage_users', 'manage_products', 'verify_payments', 'assign_orders', 'manage_commissions']
      },
      owner: {
        name: 'Owner',
        permissions: ['manage_users', 'manage_products', 'verify_payments', 'assign_orders', 'manage_commissions', 'manage_admins', 'view_all_financials', 'approve_accounts']
      }
    };
    
    // Add each role to settings collection
    for (const [role, data] of Object.entries(userRoles)) {
      await db.collection('settings').doc(`role_${role}`).set({
        ...data,
        updatedAt: FieldValue.serverTimestamp()
      }, { merge: true });
      console.log(`✅ Updated ${role} role setting`);
    }
    
    // Add approval workflow settings
    await db.collection('settings').doc('approval_workflow').set({
      requireApproval: true,
      roles: {
        owner: true,
        admin: true,
        wholesale: true,
        distributor: true,
        retail: false // Retail users don't need approval
      },
      notifications: {
        notifyAdminsOfPendingRequests: true,
        notifyUserWhenApproved: true
      },
      updatedAt: FieldValue.serverTimestamp()
    }, { merge: true });
    
    console.log('✅ Updated approval workflow settings');
    return true;
  } catch (error) {
    console.error('Error fixing settings collection:', error);
    return false;
  }
}

// Create a test product if products collection is empty
async function fixProductsCollection() {
  try {
    console.log('Checking products collection...');
    
    // Check if products collection exists and has data
    const snapshot = await db.collection('products').limit(1).get();
    
    if (snapshot.empty) {
      console.log('Adding test products to Firestore...');
      
      // Sample products for nicotine pouches
      const products = [
        {
          itemPN: 'Apple mint',
          description: 'Tobacco Free Nicotine Pouch, 6mg/pouch',
          strength: 6,
          flavor: 'Apple mint',
          price: 24.99,
          wholesalePrice: 19.99,
          inventoryCount: 1000,
          category: 'nicotine-pouches',
          imageUrl: '/images/products/apple-mint-6mg.jpg',
          active: true,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp()
        },
        {
          itemPN: 'Cool mint',
          description: 'Tobacco Free Nicotine Pouch, 16mg/pouch',
          strength: 16,
          flavor: 'Cool mint',
          price: 24.99,
          wholesalePrice: 19.99,
          inventoryCount: 1000,
          category: 'nicotine-pouches',
          imageUrl: '/images/products/cool-mint-16mg.jpg',
          active: true,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp()
        }
      ];
      
      // Create each product with a custom ID
      for (const product of products) {
        const customId = `${product.flavor.toLowerCase().replace(/\s+/g, '-')}-${product.strength}mg`;
        await db.collection('products').doc(customId).set({
          ...product,
          id: customId
        });
        console.log(`✅ Added ${product.flavor} ${product.strength}mg product`);
      }
    } else {
      console.log('✅ Products collection already exists with data');
    }
    
    return true;
  } catch (error) {
    console.error('Error fixing products collection:', error);
    return false;
  }
}

// Fix specific collections based on command-line argument
async function fixCollections(collectionName) {
  if (collectionName) {
    console.log(`Fixing ${collectionName} collection...`);
    
    switch (collectionName) {
      case 'orders':
        return await fixOrdersCollection();
      case 'settings':
        return await fixSettingsCollection();
      case 'products':
        return await fixProductsCollection();
      default:
        console.error(`Unknown collection: ${collectionName}`);
        return false;
    }
  } else {
    // Fix all collections if no specific one is requested
    console.log('Fixing all collections...');
    
    const status = await checkDatabaseStatus();
    
    // Fix orders collection if needed
    if (!status.orders?.exists || status.orders?.isEmpty) {
      await fixOrdersCollection();
    }
    
    // Fix settings collection
    await fixSettingsCollection();
    
    // Fix products collection if needed
    if (!status.products?.exists || status.products?.isEmpty) {
      await fixProductsCollection();
    }
    
    return true;
  }
}

// Add a demo user if users collection is empty
async function addDemoUser() {
  try {
    console.log('Checking if users collection needs a demo owner...');
    
    const snapshot = await db.collection('users').where('isOwner', '==', true).limit(1).get();
    
    if (snapshot.empty) {
      console.log('No owner found, creating demo owner account...');
      
      // Create demo owner
      const ownerId = 'demo-owner';
      const demoOwner = {
        id: ownerId,
        email: 'demo-owner@example.com',
        firstName: 'Demo',
        lastName: 'Owner',
        displayName: 'Demo Owner',
        role: 'owner',
        isOwner: true,
        isAdmin: true,
        approved: true,
        status: 'active',
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      };
      
      await db.collection('users').doc(ownerId).set(demoOwner);
      console.log('✅ Created demo owner account');
      
      // Create demo admin
      const adminId = 'demo-admin';
      const demoAdmin = {
        id: adminId,
        email: 'demo-admin@example.com',
        firstName: 'Demo',
        lastName: 'Admin',
        displayName: 'Demo Admin',
        role: 'admin',
        isAdmin: true,
        isOwner: false,
        approved: true,
        status: 'active',
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      };
      
      await db.collection('users').doc(adminId).set(demoAdmin);
      console.log('✅ Created demo admin account');
      
      // Create pending user for approval demo
      const pendingId = 'pending-user';
      const pendingUser = {
        id: pendingId,
        email: 'pending@example.com',
        firstName: 'Pending',
        lastName: 'User',
        displayName: 'Pending User',
        role: 'distributor',
        isAdmin: false,
        isOwner: false,
        approved: false,
        status: 'pending',
        companyName: 'Demo Distribution Company',
        phone: '555-123-4567',
        businessDescription: 'This is a demo pending user awaiting approval',
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      };
      
      await db.collection('users').doc(pendingId).set(pendingUser);
      console.log('✅ Created demo pending user account');
      
      return true;
    } else {
      console.log('✅ Owner account already exists');
      return false;
    }
  } catch (error) {
    console.error('Error creating demo users:', error);
    return false;
  }
}

// Main function that runs all fixes
async function main() {
  try {
    // Get collection name from command-line arguments
    const collectionName = process.argv[2];
    
    console.log('Starting database fixes...');
    
    // First check database status
    await checkDatabaseStatus();
    
    // Then fix collections
    const success = await fixCollections(collectionName);
    
    // Add demo users if needed
    await addDemoUser();
    
    // Final status check
    console.log('\nFinal database status:');
    await checkDatabaseStatus();
    
    return success;
  } catch (error) {
    console.error('Error in main function:', error);
    return false;
  }
}

// Run the script if executed directly
if (process.argv[1].endsWith('fix-firebase-connect.js')) {
  main()
    .then(success => {
      if (success) {
        console.log('\n✅ Firebase connection issues fixed successfully!');
      } else {
        console.error('\n❌ Some issues were not fixed');
      }
      // Exit the process
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Fatal error:', error);
      process.exit(1);
    });
} else {
  console.log('Imported as a module');
}

export default main;