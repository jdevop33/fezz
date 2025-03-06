# Fezz CI/CD Setup Instructions

This document provides step-by-step instructions to set up the Continuous Integration and Continuous Deployment (CI/CD) pipeline for the Fezz project.

## Prerequisites

- GitHub repository with the Fezz codebase
- Firebase project set up
- GitHub account with admin access to the repository

## Setting Up Firebase CLI Token

1. Install Firebase CLI if you haven't already:
   ```bash
   npm install -g firebase-tools
   ```

2. Log in to Firebase:
   ```bash
   firebase login
   ```

3. Generate a CI token:
   ```bash
   firebase login:ci
   ```

4. Copy the token that is displayed. This will be used as your `FIREBASE_TOKEN` secret.

## Setting Up GitHub Secrets

Go to your GitHub repository > Settings > Secrets and variables > Actions, and add the following secrets:

1. `FIREBASE_TOKEN`: The token generated in the previous step
2. `FIREBASE_API_KEY`: Your Firebase API key
3. `FIREBASE_AUTH_DOMAIN`: Your Firebase auth domain
4. `FIREBASE_PROJECT_ID`: Your Firebase project ID
5. `FIREBASE_STORAGE_BUCKET`: Your Firebase storage bucket
6. `FIREBASE_MESSAGING_SENDER_ID`: Your Firebase messaging sender ID
7. `FIREBASE_APP_ID`: Your Firebase app ID

You can find these values in your Firebase project settings or the Firebase configuration in your code.

## Enable GitHub Actions

1. Go to your GitHub repository > Actions
2. If Actions aren't already enabled, click the "I understand my workflows, go ahead and enable them" button

## First Deployment

1. Push any change to the main branch, or manually trigger the workflow:
   - Go to Actions > "Deploy to Firebase Hosting on merge"
   - Click "Run workflow" > "Run workflow"

2. Once the workflow completes successfully, your application will be deployed to Firebase Hosting.

## Testing the PR Workflow

1. Create a new branch
2. Make some changes
3. Create a pull request
4. The PR workflow will automatically build your changes and deploy them to a preview channel
5. You'll see a comment on your PR with a link to the preview

## Manual Rollback

If a deployment fails or introduces bugs:

1. Go to Actions > "Rollback Firebase Hosting"
2. Click "Run workflow"
3. You can leave the version field empty to rollback to the previous version
4. Click "Run workflow" again

## Troubleshooting

If your workflows are failing:

1. Check that all required secrets are set correctly
2. Verify that your Firebase project is properly set up
3. Check the workflow logs for specific error messages
4. Make sure your package.json has a "test" script (even if it's just an echo command)

For more details, see the [CICD.md](CICD.md) file.