#!/bin/bash

# Enhanced script for Firebase deployment
# Handles authentication, environment selection, and deployment of Firestore rules and storage rules

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print section headers
print_header() {
  echo -e "\n${GREEN}======================================${NC}"
  echo -e "${GREEN}= $1${NC}"
  echo -e "${GREEN}======================================${NC}\n"
}

# Function to handle errors
handle_error() {
  echo -e "\n${RED}ERROR: $1${NC}"
  exit 1
}

# Check if service account file exists
if [ ! -f "serviceAccountKey.json" ]; then
  echo -e "${YELLOW}⚠️ Service account file not found!${NC}"
  echo ""
  echo "📝 Please download a service account key from the Firebase console and save it as serviceAccountKey.json"
  echo "   or use the GOOGLE_APPLICATION_CREDENTIALS environment variable to specify the path to your key file."
  echo ""
  echo "Example:"
  echo "1. Go to Firebase console > Project settings > Service accounts"
  echo "2. Click 'Generate new private key'"
  echo "3. Save it as serviceAccountKey.json in the project root"
  echo "4. Run this script again"
  echo ""
  echo "Alternatively, you can set GOOGLE_APPLICATION_CREDENTIALS manually:"
  echo "export GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/serviceAccountKey.json"
  echo "npm run deploy"
  
  # Try to continue with Firebase CLI authentication if service account is not available
  echo -e "\n${YELLOW}Attempting to continue with Firebase CLI authentication...${NC}\n"
  firebase login --no-localhost || handle_error "Failed to authenticate with Firebase CLI"
else
  # Set the service account credential if not already set
  if [ -z "$GOOGLE_APPLICATION_CREDENTIALS" ]; then
    export GOOGLE_APPLICATION_CREDENTIALS="$(pwd)/serviceAccountKey.json"
    echo -e "${GREEN}Using service account from: $GOOGLE_APPLICATION_CREDENTIALS${NC}"
  fi
fi

# Ask for the deployment target
print_header "Select deployment target"
echo "1) Development"
echo "2) Staging"
echo "3) Production"
read -p "Enter your choice (1-3) [3]: " choice
choice=${choice:-3}

case "$choice" in
  1)
    TARGET="development"
    PROJECT_ID="fezz-dev"
    ;;
  2)
    TARGET="staging"
    PROJECT_ID="fezz-staging"
    ;;
  3)
    TARGET="production"
    PROJECT_ID="fezz"
    read -p "Are you sure you want to deploy to production? (y/n) [n]: " confirm
    confirm=${confirm:-n}
    if [[ ! $confirm =~ ^[Yy]$ ]]; then
      echo "Deployment cancelled."
      exit 0
    fi
    ;;
  *)
    handle_error "Invalid choice"
    ;;
esac

print_header "Building application for $TARGET"
npm run build || handle_error "Build failed"

# Ask what to deploy
print_header "Select deployment components"
echo "1) Everything (Hosting, Firestore, Storage, Rules)"
echo "2) Hosting only"
echo "3) Rules only (Firestore and Storage)"
echo "4) Firestore and rules only"
read -p "Enter your choice (1-4) [1]: " deploy_choice
deploy_choice=${deploy_choice:-1}

# Deploy based on user choice
print_header "Deploying to Firebase ($TARGET environment)"

case "$deploy_choice" in
  1)
    echo "Deploying everything..."
    firebase deploy --project="$PROJECT_ID" || handle_error "Deployment failed"
    ;;
  2)
    echo "Deploying hosting only..."
    firebase deploy --only hosting --project="$PROJECT_ID" || handle_error "Hosting deployment failed"
    ;;
  3)
    echo "Deploying rules only..."
    firebase deploy --only firestore:rules,storage:rules --project="$PROJECT_ID" || handle_error "Rules deployment failed"
    ;;
  4)
    echo "Deploying Firestore and rules..."
    firebase deploy --only firestore,storage:rules --project="$PROJECT_ID" || handle_error "Firestore deployment failed"
    ;;
  *)
    handle_error "Invalid deployment choice"
    ;;
esac

print_header "🚀 Deployment completed successfully!"

# Optional: Create a deployment record
timestamp=$(date +"%Y-%m-%d %H:%M:%S")
echo "$timestamp - Deployed to $TARGET by $(whoami)" >> deployments.log

echo -e "\n${GREEN}✅ All done!${NC}\n"