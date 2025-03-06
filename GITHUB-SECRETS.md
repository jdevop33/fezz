# Setting Up GitHub Secrets

Follow these steps to set up GitHub secrets for Firebase deployment:

## 1. Create the Service Account Secret

This is the most important secret for deployment:

1. Go to your GitHub repository's settings
2. Navigate to "Secrets and variables" > "Actions"
3. Click "New repository secret"
4. Name: `FIREBASE_SERVICE_ACCOUNT`
5. Value: Copy and paste the entire service account JSON from FIREBASE-SERVICE-ACCOUNT.md exactly as shown, including all quotes, brackets, and special characters
6. Click "Add secret"

> **IMPORTANT**: Make sure to copy the entire JSON, including opening and closing braces. The JSON must be valid and properly formatted.

## 2. Add Firebase Configuration Secrets

Add the following secrets with values from your Firebase config:

1. `FIREBASE_API_KEY`: "AIzaSyD4GZS0GQYDlPeAOSZAj3TiNiPVlmtiYtM"
2. `FIREBASE_AUTH_DOMAIN`: "fezz-452821.firebaseapp.com"
3. `FIREBASE_PROJECT_ID`: "fezz-452821"
4. `FIREBASE_STORAGE_BUCKET`: "fezz-452821.firebasestorage.app"
5. `FIREBASE_MESSAGING_SENDER_ID`: "673166874579"
6. `FIREBASE_APP_ID`: "1:673166874579:web:9226908a9238356ad04126"

## 3. Verify Secrets

After adding all secrets, your repository should have 7 secrets:

1. `FIREBASE_SERVICE_ACCOUNT`
2. `FIREBASE_API_KEY`
3. `FIREBASE_AUTH_DOMAIN`
4. `FIREBASE_PROJECT_ID`
5. `FIREBASE_STORAGE_BUCKET`
6. `FIREBASE_MESSAGING_SENDER_ID`
7. `FIREBASE_APP_ID`

## 4. Trigger a Deployment

After setting up these secrets:

1. Make a small change to your repository
2. Commit and push to the main branch
3. Go to the "Actions" tab to monitor the deployment

The deployment should now succeed with the service account authentication.