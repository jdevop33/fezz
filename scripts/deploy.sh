#!/bin/bash

# Script for manual Firebase deployment

# Ensure service account file exists
if [ ! -f "service-account.json" ]; then
  echo "Service account file not found. Creating it..."
  npm run create-sa
fi

# Build the application
echo "Building the application..."
npm run build

# Set the service account credential
export GOOGLE_APPLICATION_CREDENTIALS="$(pwd)/service-account.json"

# Deploy to Firebase
echo "Deploying to Firebase..."
firebase deploy --only hosting

echo "Deployment complete!"