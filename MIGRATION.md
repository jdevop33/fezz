# Migrating from Supabase to Firebase

This document provides instructions for migrating data from Supabase to Firebase Firestore and resolving common issues.

## Prerequisites

1. Make sure you have created a Firestore database in your Firebase project:
   - Go to: https://console.firebase.google.com/project/fezz-452821/firestore
   - Click "Create database"
   - Select a starting mode ("Production mode" is recommended)
   - Choose a location closest to your users
   - Click "Enable"

2. Ensure you have your environment variables set up in a `.env` file in the project root:

```
# Firebase
VITE_FIREBASE_API_KEY=AIzaSyD4GZS0GQYDlPeAOSZAj3TiNiPVlmtiYtM
VITE_FIREBASE_AUTH_DOMAIN=fezz-452821.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=fezz-452821
VITE_FIREBASE_STORAGE_BUCKET=fezz-452821.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=673166874579
VITE_FIREBASE_APP_ID=1:673166874579:web:9226908a9238356ad04126

# Supabase (your existing Supabase credentials)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Running the Migration

1. Make sure you're logged in to both Firebase and Supabase.

2. Run the migration script:
   ```bash
   npm run migrate
   ```

3. Wait for the migration to complete. This may take a while depending on the amount of data.

4. Check the `migration-results.json` file that will be created in the project root to see the results of the migration.

## Fixing "relation 'public.orders' does not exist" Error

If you encounter this error, it means the Supabase database doesn't have an `orders` table that the migration script is trying to migrate.

**Fix Option 1: Client-Side Initialization**
The app has been updated to automatically create missing collections (including `orders`) when it starts:

1. In your browser, load the application with initialization parameter:
   ```
   http://localhost:5173/?init-db=true
   ```

2. This will trigger the `initializeApplication()` function in `src/lib/initDb.ts` which will:
   - Create the orders collection with a sample order
   - Set up user roles and permissions
   - Create a demo owner account if needed

**Fix Option 2: Manual Collection Creation**
Run the dedicated script to create missing collections:

```bash
node scripts/create-collection.js orders
```

## Setting Up User Approval Workflow

The user approval workflow has been implemented with the following components:

1. **User Roles**: The app defines several user roles in `settings/role_*` documents
   - retail: Regular retail customers
   - wholesale: Wholesale buyers
   - distributor: Product distributors
   - admin: System administrators
   - owner: System owner with full permissions

2. **Approval Status**: Users have status fields
   - `approved`: boolean
   - `status`: 'pending', 'active', or 'rejected'

3. **Admin Dashboard**: Administrators can approve or reject pending accounts at:
   ```
   /admin/approvals
   ```

If you don't have any admin or owner accounts yet, you can:

1. Create an owner account manually with:
   ```bash
   node scripts/create-owner.js
   ```

2. Or let the application auto-create a demo owner when initializing:
   ```
   http://localhost:5173/?init-db=true
   ```

## Database Structure After Migration

### Collections

1. **users**: User accounts and profiles
   - Migrated from Supabase `profiles` table
   - Contains user role, approval status, and profile info

2. **products**: Product catalog
   - Migrated from Supabase `products` table
   - Contains product details, pricing, inventory

3. **orders**: Order history (new collection)
   - Created directly in Firebase
   - Contains order items, pricing, shipping info

4. **settings**: Application settings (new collection)
   - Created directly in Firebase
   - Contains user roles, permissions, and app configuration

## Troubleshooting Other Issues

If you encounter additional migration issues:

1. **Firebase Admin SDK Authentication Errors**:
   - Use client-side Firebase SDK for initialization
   - Check service account key file permissions
   - Verify Firebase project permissions

2. **Missing Collections**:
   - Run the initialization with URL parameter: `?init-db=true`
   - Or manually create collections with `scripts/create-collection.js`

3. **No Admin/Owner Account**:
   - Use the initialization process which creates a demo owner
   - Or manually create an owner with `scripts/create-owner.js`

After migration, remember to update your Firebase security rules to protect your data by following the patterns in `firestore.rules`.