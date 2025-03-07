import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase app
export const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Initialize Analytics only in production and if supported by the browser
export const analytics = async () => {
  if (import.meta.env.PROD && import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
    if (await isSupported()) {
      return getAnalytics(app);
    }
  }
  return null;
};

// Use emulators in development mode if enabled
const useEmulators = import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true';

if (useEmulators) {
  console.log('Using Firebase emulators for local development');
  // Auth emulator usually runs on port 9099
  connectAuthEmulator(auth, 'http://localhost:9099');
  // Firestore emulator usually runs on port 8080
  connectFirestoreEmulator(db, 'localhost', 8080);
  // Storage emulator usually runs on port 9199
  connectStorageEmulator(storage, 'localhost', 9199);
  // Functions emulator usually runs on port 5001
  connectFunctionsEmulator(functions, 'localhost', 5001);
} else {
  console.log('Using production Firebase instance');
}

export default app;