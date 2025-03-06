#!/bin/bash

# Script for manual Firebase deployment

# Check if service account file exists
if [ ! -f "service-account.json" ]; then
  echo "❌ Service account file not found!"
  echo ""
  echo "📝 Please download a service account key from the Firebase console and save it as service-account.json"
  echo "   or use the GOOGLE_APPLICATION_CREDENTIALS environment variable to specify the path to your key file."
  echo ""
  echo "Example:"
  echo "1. Get a service account key from https://console.firebase.google.com/project/fezz-452821/settings/serviceaccounts/adminsdk"
  echo "2. Save it as service-account.json in the project root"
  echo "3. Run this script again"
  echo ""
  echo "Alternatively, you can set GOOGLE_APPLICATION_CREDENTIALS manually:"
  echo "export GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/service-account.json"
  echo "npm run deploy"
  
  exit 1
fi

# Build the application
echo "Building the application..."
npm run build

# Set the service account credential if not already set
if [ -z "$GOOGLE_APPLICATION_CREDENTIALS" ]; then
  export GOOGLE_APPLICATION_CREDENTIALS="$(pwd)/service-account.json"
  echo "Using service account from: $GOOGLE_APPLICATION_CREDENTIALS"
fi

# Deploy to Firebase
echo "Deploying to Firebase..."
firebase deploy --only hosting

echo "✅ Deployment complete!"