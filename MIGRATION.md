# Migrating from Supabase to Firebase

This document provides instructions for migrating data from Supabase to Firebase Firestore.

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

## Verifying Migration

1. Check your Firestore console to verify that data has been migrated:
   - Go to: https://console.firebase.google.com/project/fezz-452821/firestore/data
   - Verify that collections have been created and data has been migrated

2. Run your application using Firebase and verify functionality:
   ```bash
   npm run dev
   ```

## Troubleshooting

If you encounter issues during migration:

1. **Supabase Connection Issues**:
   - Verify your Supabase URL and anon key are correct
   - Check that you have proper permissions to read data

2. **Firebase Connection Issues**:
   - Ensure Firestore database has been created
   - Verify your Firebase config is correct
   - Check that you have proper permissions to write data

3. **Data Mapping Issues**:
   - The migration script uses specific mappings from Supabase to Firestore
   - If your Supabase schema differs, you may need to adjust the mappings in the migration script

## After Migration

After successful migration:

1. Update your application to use Firebase instead of Supabase
2. Deploy your updated application
3. Monitor for any issues

For the "Not found" issue:
- Make sure your routes are correctly defined
- Check that Firebase hosting is correctly set up with proper rewrites in firebase.json
- Verify that your build process is generating the expected files