const fs = require('fs');

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD4GZS0GQYDlPeAOSZAj3TiNiPVlmtiYtM",
  authDomain: "fezz-452821.firebaseapp.com",
  projectId: "fezz-452821",
  storageBucket: "fezz-452821.firebasestorage.app",
  messagingSenderId: "673166874579",
  appId: "1:673166874579:web:9226908a9238356ad04126"
};

// Create .env file content
const envContent = `VITE_FIREBASE_API_KEY=${firebaseConfig.apiKey}
VITE_FIREBASE_AUTH_DOMAIN=${firebaseConfig.authDomain}
VITE_FIREBASE_PROJECT_ID=${firebaseConfig.projectId}
VITE_FIREBASE_STORAGE_BUCKET=${firebaseConfig.storageBucket}
VITE_FIREBASE_MESSAGING_SENDER_ID=${firebaseConfig.messagingSenderId}
VITE_FIREBASE_APP_ID=${firebaseConfig.appId}
`;

// Write to .env file
fs.writeFileSync('.env', envContent);

console.log('Environment variables created successfully!');