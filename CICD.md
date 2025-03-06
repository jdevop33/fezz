# CI/CD Pipeline Documentation

This document explains the Continuous Integration and Continuous Deployment (CI/CD) setup for the Fezz project.

## Overview

The CI/CD pipeline automatically builds, tests, and deploys the application when changes are pushed to the repository. It ensures that:

1. Code is properly tested before deployment
2. Changes are automatically deployed to production when merged to main
3. Pull requests get preview deployments
4. Failed builds don't affect the live site
5. Manual rollbacks are possible if needed

## Workflows

### 1. Build and Test (`build-test.yml`)

Runs on all branches except main and for all pull requests:
- Installs dependencies
- Runs linting (if available)
- Runs tests (if available)
- Builds the application to verify it compiles correctly

### 2. Deploy to Firebase on Merge (`firebase-hosting-merge.yml`)

Runs when changes are pushed to the main branch:
- Builds the application
- Deploys to Firebase Hosting live channel
- Previous version remains available for quick rollback

### 3. Deploy Preview for Pull Requests (`firebase-hosting-pull-request.yml`)

Runs on pull requests:
- Builds the application
- Deploys to a Firebase Hosting preview channel
- Adds a comment to the PR with the preview URL

### 4. Manual Rollback (`firebase-hosting-rollback.yml`)

Can be triggered manually from GitHub Actions:
- Allows specifying a specific version to rollback to
- Or automatically rolls back to the previous version

## Required Secrets

These secrets must be set in the GitHub repository settings:

- `FIREBASE_API_KEY`: Your Firebase API key
- `FIREBASE_AUTH_DOMAIN`: Your Firebase auth domain
- `FIREBASE_PROJECT_ID`: Your Firebase project ID
- `FIREBASE_STORAGE_BUCKET`: Your Firebase storage bucket
- `FIREBASE_MESSAGING_SENDER_ID`: Your Firebase messaging sender ID
- `FIREBASE_APP_ID`: Your Firebase app ID
- `FIREBASE_SERVICE_ACCOUNT`: JSON key for a Firebase service account with deployment permissions
- `FIREBASE_TOKEN`: Firebase CLI token (for rollback workflow)

## How to Trigger a Manual Rollback

1. Go to the "Actions" tab in the GitHub repository
2. Select "Rollback Firebase Hosting" from the workflows list
3. Click "Run workflow"
4. Choose whether to:
   - Leave the version field empty to rollback to the previous version
   - Enter a specific version ID to rollback to that version
5. Click "Run workflow" again

## Best Practices

- Always create a pull request for changes to get a preview deployment
- Review the preview before merging to main
- Add proper tests to catch issues before deployment
- If a bad deployment goes out, use the manual rollback workflow

## Monitoring Deployments

You can monitor deployments:
1. In GitHub Actions tab to see build and deployment progress
2. In Firebase Console under Hosting > Deployment History