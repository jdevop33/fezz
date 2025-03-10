#!/bin/bash

# Script to start Firebase emulators for local development

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print header
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}= Firebase Emulators for Local Development${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo -e "${RED}Firebase CLI not found. Please install it using:${NC}"
    echo "npm install -g firebase-tools"
    exit 1
fi

# Ensure we're in the project root directory
cd "$(dirname "$0")/.." || exit 1

# Check if .env.local exists and create it if it doesn't
ENV_LOCAL=".env.local"
if [ ! -f "$ENV_LOCAL" ]; then
    echo -e "${YELLOW}Creating .env.local file for emulator configuration...${NC}"
    cat > "$ENV_LOCAL" << EOL
# Firebase Emulator Configuration
VITE_USE_FIREBASE_EMULATORS=true
VITE_FIREBASE_AUTH_EMULATOR_URL=http://localhost:9099
VITE_FIREBASE_FIRESTORE_EMULATOR_URL=localhost:8080
VITE_FIREBASE_STORAGE_EMULATOR_URL=localhost:9199
EOL
    echo -e "${GREEN}Created .env.local with emulator configuration.${NC}"
else
    # Make sure the emulator configuration is in the .env.local file
    if ! grep -q "VITE_USE_FIREBASE_EMULATORS=true" "$ENV_LOCAL"; then
        echo -e "${YELLOW}Adding emulator configuration to .env.local...${NC}"
        cat >> "$ENV_LOCAL" << EOL

# Firebase Emulator Configuration
VITE_USE_FIREBASE_EMULATORS=true
VITE_FIREBASE_AUTH_EMULATOR_URL=http://localhost:9099
VITE_FIREBASE_FIRESTORE_EMULATOR_URL=localhost:8080
VITE_FIREBASE_STORAGE_EMULATOR_URL=localhost:9199
EOL
        echo -e "${GREEN}Updated .env.local with emulator configuration.${NC}"
    fi
fi

# Check if we want to import data
read -p "Do you want to import sample data into the emulators? (y/n) " -n 1 -r IMPORT_DATA
echo ""

IMPORT_FLAG=""
if [[ $IMPORT_DATA =~ ^[Yy]$ ]]; then
    # Check if there's an emulator export directory
    if [ -d "./emulator-data" ]; then
        IMPORT_FLAG="--import=./emulator-data"
        echo -e "${GREEN}Will import data from ./emulator-data${NC}"
    else
        echo -e "${YELLOW}No emulator-data directory found. Will start with empty database.${NC}"
        echo -e "${YELLOW}Data will be automatically exported when you stop the emulators.${NC}"
    fi
fi

# Ask if they want to also start the development server
read -p "Do you want to start the development server as well? (y/n) " -n 1 -r START_DEV
echo ""

# Start the emulators with or without data import
echo -e "${GREEN}Starting Firebase emulators...${NC}"
echo -e "${BLUE}Auth:${NC} http://localhost:9099/auth"
echo -e "${BLUE}Firestore:${NC} http://localhost:8080/firestore"
echo -e "${BLUE}Storage:${NC} http://localhost:9199/storage"
echo -e "${BLUE}Emulator UI:${NC} http://localhost:4000"
echo ""

if [[ $START_DEV =~ ^[Yy]$ ]]; then
    # Start emulators in the background and then start dev server
    echo -e "${GREEN}Starting emulators and development server...${NC}"
    
    # Start emulators in the background
    firebase emulators:start $IMPORT_FLAG --export-on-exit=./emulator-data &
    
    # Wait a moment for emulators to start
    sleep 5
    
    # Start dev server
    npm run dev
    
    # When dev server is killed, also kill emulators
    kill $!
else
    # Just start the emulators
    firebase emulators:start $IMPORT_FLAG --export-on-exit=./emulator-data
fi

echo -e "${GREEN}Emulators stopped. Data has been exported to ./emulator-data${NC}"