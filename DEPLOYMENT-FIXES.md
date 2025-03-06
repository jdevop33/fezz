# Deployment Fixes for "Not Found" Issue

If you're seeing a "Not Found" page after deploying to Firebase Hosting, try these fixes:

## 1. Verify GitHub Secrets

First, check that your GitHub secrets are correctly set up:

1. Go to your GitHub repository > Settings > Secrets and variables > Actions
2. Verify that `FIREBASE_SERVICE_ACCOUNT` contains the complete JSON service account key
3. Make sure all Firebase configuration secrets are present

## 2. Set up environment variables

Run the script to set up your environment variables:

```bash
npm run create-env
```

This will create a `.env` file with the Firebase configuration.

## 2. Create Firestore database

Make sure you've created a Firestore database in the Firebase console:

1. Go to https://console.firebase.google.com/project/fezz-452821/firestore
2. Click "Create database"
3. Choose "Start in production mode"
4. Select a location close to your users
5. Click "Enable"

## 3. Rebuild and redeploy

```bash
npm run build
firebase deploy
```

## 4. Check Firebase Hosting configuration

Make sure your firebase.json has the proper rewrites:

```json
"rewrites": [
  {
    "source": "**",
    "destination": "/index.html"
  }
]
```

## 5. Check routing in App.tsx

Make sure your routes are properly defined and there's a 404 route catch-all:

```jsx
{
  path: "*",
  element: <NotFoundPage />
}
```

## 6. Generate Firebase CI token

For CI/CD deployment:

```bash
firebase login:ci
```

Use the token in your GitHub repository secrets.

## 7. Check console for errors

After deploying, check your browser's console for any errors that might be occurring during loading.