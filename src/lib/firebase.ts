import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4GZS0GQYDlPeAOSZAj3TiNiPVlmtiYtM",
  authDomain: "fezz-452821.firebaseapp.com",
  projectId: "fezz-452821",
  storageBucket: "fezz-452821.firebasestorage.app",
  messagingSenderId: "673166874579",
  appId: "1:673166874579:web:9226908a9238356ad04126"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// We're using the production Firebase instance for all environments
// No emulators - this ensures consistent behavior across environments
// For testing, you can create a separate Firebase project if needed
console.log('Using production Firebase instance');

export default app;