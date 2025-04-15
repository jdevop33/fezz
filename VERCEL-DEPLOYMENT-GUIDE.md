# Vercel Deployment Guide

This guide provides step-by-step instructions for deploying the Fezz application to Vercel while using Firebase for backend services.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. A Firebase project (already set up)
3. Node.js and npm installed locally
4. Git repository with your code

## Step 1: Prepare Your Environment Variables

Vercel needs to know about your Firebase configuration. You'll need to add these environment variables to your Vercel project:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_ENABLE_ANALYTICS`
- `VITE_APP_NAME`
- `VITE_APP_DESCRIPTION`
- `VITE_APP_URL`
- `VITE_CONTACT_EMAIL`

You can find these values in your `.env` file.

## Step 2: Deploy Using the Vercel CLI

### Install the Vercel CLI

```bash
npm install -g vercel
```

### Login to Vercel

```bash
vercel login
```

### Deploy to Vercel

From your project directory:

```bash
npm run deploy:vercel
```

This will start an interactive setup process. Follow the prompts to configure your project.

### For Production Deployment

```bash
npm run deploy:vercel:prod
```

## Step 3: Deploy Using the Vercel Dashboard

Alternatively, you can deploy directly from the Vercel dashboard:

1. Go to [vercel.com](https://vercel.com) and log in
2. Click "Add New" > "Project"
3. Import your Git repository
4. Configure your project:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add Environment Variables:
   - Click "Environment Variables"
   - Add all the variables from your `.env` file
6. Click "Deploy"

## Step 4: Configure Custom Domain (Optional)

1. In the Vercel dashboard, go to your project
2. Click "Settings" > "Domains"
3. Add your custom domain and follow the verification steps

## Step 5: Verify Deployment

1. Once deployed, Vercel will provide a URL for your application
2. Visit the URL to ensure everything is working correctly
3. Test key functionality:
   - User authentication
   - Product browsing
   - Cart functionality
   - Order submission

## Troubleshooting

### Firebase Authentication Issues

If you encounter authentication issues, ensure:
- Your Firebase project has the Vercel domain added to the authorized domains list
- Go to Firebase Console > Authentication > Settings > Authorized domains
- Add your Vercel domain (e.g., `your-app.vercel.app`)

### CORS Issues

If you encounter CORS issues with Firebase:
- Go to Firebase Console > Firestore > Rules
- Ensure your rules allow access from your Vercel domain

### Environment Variable Issues

If your app can't connect to Firebase:
- Check that all environment variables are correctly set in Vercel
- Verify that variable names match exactly (they are case-sensitive)
- Remember that changes to environment variables require redeployment

## Maintenance

### Updating Your Deployment

When you make changes to your code:

1. Push changes to your Git repository
2. Vercel will automatically rebuild and deploy (if using Git integration)
3. Or manually redeploy using:
   ```bash
   npm run deploy:vercel:prod
   ```

### Monitoring

- Use Vercel Analytics to monitor performance and usage
- Use Firebase Console to monitor backend services

## Cost Management

- Monitor your Firebase usage in the Firebase Console
- Set up budget alerts in Google Cloud Console
- Vercel's Hobby plan is free for personal projects with limitations
