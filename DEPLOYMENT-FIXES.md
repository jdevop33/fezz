# Deployment Fixes for Firebase Migration

This document outlines common issues and fixes when deploying the application to Firebase.

## Fixing "relation 'public.orders' does not exist" Migration Error

If you encounter this error during migration, it means your Supabase database doesn't have an orders table, but the migration script is trying to access it.

### Solution 1: Use Client-Side Initialization

1. Access the app with initialization parameter:
   ```
   https://your-app-url.web.app/?init-db=true
   ```
   
2. This triggers the improved initialization process that:
   - Creates the orders collection and adds a sample order
   - Sets up user roles and permissions
   - Creates a demo owner account if needed

### Solution 2: Run Manual Setup Script

1. Make sure your Firebase environment variables are set in `.env`
2. Run the collection creation script:
   ```bash
   node scripts/create-collection.js orders
   ```

## User Account Approval Flow

If you need to set up the user approval workflow:

1. Create an owner account by visiting:
   ```
   https://your-app-url.web.app/?init-db=true
   ```
   
2. Login as the demo owner:
   - Email: demo-owner@example.com
   - Password: (set during initialization)

3. Approve or reject pending accounts:
   - Visit the admin approvals page: `/admin/approvals`
   - View pending accounts and approve/reject them

## Setting Up Firebase for Deployment

### 1. Verify GitHub Secrets

First, check that your GitHub secrets are correctly set up:

1. Go to your GitHub repository > Settings > Secrets and variables > Actions
2. Verify that `FIREBASE_SERVICE_ACCOUNT` contains the complete JSON service account key
3. Make sure all Firebase configuration secrets are present

### 2. Set up environment variables

Run the script to set up your environment variables:

```bash
npm run create-env
```

This will create a `.env` file with the Firebase configuration.

### 3. Create Firestore database

Make sure you've created a Firestore database in the Firebase console:

1. Go to https://console.firebase.google.com/project/fezz-452821/firestore
2. Click "Create database"
3. Choose "Start in production mode"
4. Select a location close to your users
5. Click "Enable"

### 4. Deploy to Firebase

Build and deploy the application:

```bash
npm run build
firebase deploy
```

### 5. Check Firebase Hosting configuration

Make sure your firebase.json has the proper rewrites:

```json
"rewrites": [
  {
    "source": "**",
    "destination": "/index.html"
  }
]
```

## Troubleshooting General "Not Found" Issues

### 1. Check routing in App.tsx

Make sure your routes are properly defined and there's a 404 route catch-all:

```jsx
{
  path: "*",
  element: <NotFoundPage />
}
```

### 2. Check Firebase and Firestore configuration

1. Verify your Firebase project has the correct permissions
2. Make sure all collections exist in Firestore
3. Check security rules to ensure proper access

### 3. Look for initialization errors

Check the browser console for initialization errors. If you see database initialization errors:

1. Try forcing initialization with: `/?init-db=true`
2. Clear browser localStorage and reload
3. Manually run the initialization scripts:
   ```bash
   node scripts/fix-firebase-connect.js
   ```

### 4. Check for Auth issues

If users can't sign in or access protected routes:

1. Check Firebase Authentication is enabled
2. Verify security rules in firestore.rules
3. Set up default admin user if needed