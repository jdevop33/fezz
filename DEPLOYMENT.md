# Deployment Guide

This document provides instructions for deploying the Pouches Worldwide Platform to Vercel.

## Prerequisites

1. A Vercel account (https://vercel.com)
2. A Firebase project with Firestore, Authentication, and Storage enabled
3. Firebase project credentials

## Environment Variables

The following environment variables need to be set in your Vercel project:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_CONTACT_EMAIL=your-contact-email@example.com
```

## Deployment Steps

### 1. Connect to GitHub

1. Push your code to a GitHub repository
2. Log in to Vercel and click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### 2. Configure Environment Variables

1. In the Vercel project settings, go to the "Environment Variables" tab
2. Add all the required environment variables listed above

### 3. Deploy

1. Click "Deploy" to start the deployment process
2. Vercel will build and deploy your application
3. Once deployed, you'll receive a URL for your application

## Post-Deployment

After deployment, you should:

1. Set up Firebase Security Rules for Firestore and Storage
2. Configure Firebase Authentication providers
3. Import initial product data using the Firebase console or the provided import scripts

## Troubleshooting

If you encounter issues with the deployment:

1. Check the build logs in Vercel for any errors
2. Verify that all environment variables are correctly set
3. Ensure Firebase services are properly configured and accessible
4. Check browser console for any client-side errors

## Maintenance

For future updates:

1. Push changes to your GitHub repository
2. Vercel will automatically rebuild and deploy your application
3. You can also manually trigger deployments from the Vercel dashboard
