import { createClient } from '@supabase/supabase-js';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import dotenv from 'dotenv';
import fs from 'fs';

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

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

// Initialize Firebase and Supabase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Mapping from Supabase to Firestore
const mapping = {
  profiles: {
    collection: 'users',
    transform: (data) => {
      return {
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        displayName: `${data.first_name} ${data.last_name}`,
        companyName: data.company_name,
        isReferrer: data.is_referrer,
        isDistributor: data.is_distributor,
        accountType: determineAccountType(data.is_referrer, data.is_distributor),
        approved: data.is_approved,
        isAdmin: data.is_admin || false,
        isOwner: false,
        status: data.is_approved ? 'active' : 'pending',
        role: determineRole(data.is_referrer, data.is_distributor, data.is_admin),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
    }
  },
  categories: {
    collection: 'categories',
    transform: (data) => data,
  },
  products: {
    collection: 'products',
    transform: (data) => ({
      itemPN: data.name || '',
      description: data.description || '',
      strength: data.strength || 0,
      flavor: data.flavor || '',
      price: data.price || 0,
      wholesalePrice: Math.round((data.price * 0.8) * 100) / 100, // 20% discount for wholesale
      inventoryCount: data.inventory_count || 0,
      category: data.category_id || 'uncategorized',
      imageUrl: data.image_url || '',
      active: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }),
  },
  orders: {
    collection: 'orders',
    transform: (data) => ({
      userId: data.user_id,
      items: data.items || [],
      subtotal: data.subtotal || 0,
      tax: data.tax || 0,
      shipping: data.shipping || 0,
      total: data.total || 0,
      status: data.status || 'pending',
      paymentMethod: data.payment_method || 'bank',
      paymentId: data.payment_id,
      shippingAddress: data.shipping_address || {},
      distributorId: data.distributor_id,
      trackingNumber: data.tracking_number,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }),
  }
};

function determineAccountType(isReferrer, isDistributor) {
  if (isReferrer && isDistributor) return 'both';
  if (isReferrer) return 'referrer';
  if (isDistributor) return 'distributor';
  return 'customer';
}

function determineRole(isReferrer, isDistributor, isAdmin) {
  if (isAdmin) return 'admin';
  if (isDistributor) return 'distributor';
  if (isReferrer) return 'wholesale';
  return 'retail';
}

export async function migrateData() {
  console.log('Starting migration from Supabase to Firestore...');
  const results = {
    success: [],
    errors: []
  };

  for (const [table, config] of Object.entries(mapping)) {
    try {
      console.log(`Migrating data from '${table}'...`);
      
      // Fetch data from Supabase
      const { data, error } = await supabase.from(table).select('*');
      
      if (error) {
        console.error(`Error fetching data from ${table}:`, error.message);
        results.errors.push({ table, message: error.message });
        continue;
      }
      
      if (!data || data.length === 0) {
        console.log(`No data found in ${table} table.`);
        continue;
      }

      console.log(`Found ${data.length} records in ${table}.`);
      
      // Create a batch of promises for Firestore
      const promises = [];
      const collectionRef = collection(db, config.collection);
      
      for (const item of data) {
        const id = item.id.toString();
        const transformedData = config.transform(item);
        const docRef = doc(collectionRef, id);
        promises.push(setDoc(docRef, transformedData));
      }
      
      // Wait for all operations to complete
      await Promise.all(promises);
      
      console.log(`Successfully migrated ${data.length} records from ${table} to ${config.collection}.`);
      results.success.push({ table, count: data.length });
    } catch (err) {
      console.error(`Error migrating ${table}:`, err);
      results.errors.push({ table, message: err.message });
    }
  }

  console.log('Migration completed!');
  console.log('Summary:', JSON.stringify(results, null, 2));
  
  // Save summary to file
  fs.writeFileSync('migration-results.json', JSON.stringify(results, null, 2));
  
  return results;
}

// If this script is run directly, execute the migration
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateData().catch(console.error);
}