import { updateDocument } from './firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from './firebase';

/**
 * Promotes a user to Owner role
 * This script should be run only once to set up the initial owner account
 * After that, owners can manage admins through the UI
 */
export async function createInitialOwner(email: string, password: string): Promise<string> {
  try {
    console.log(`Setting up initial owner account for ${email}...`);
    
    // First, authenticate with the provided credentials
    const auth = getAuth(app);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;
    
    // Update the user document to grant owner privileges
    await updateDocument('users', userId, {
      isOwner: true,
      isAdmin: true, // Owners are also admins
      role: 'owner',
      approved: true, // Automatically approve the owner
      status: 'active'
    });
    
    console.log(`Successfully promoted user ${email} to Owner role!`);
    return userId;
  } catch (error) {
    console.error('Error creating initial owner:', error);
    throw error;
  }
}

// Can be called directly from the console for setup:
// import { createInitialOwner } from './lib/createOwner';
// createInitialOwner('owner@example.com', 'password123').then(userId => console.log('Owner created with ID:', userId));