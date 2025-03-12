import { updateDocument } from './firestore';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { app } from './firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from './firebase';
import { createUser } from './pouchesDb';

/**
 * Checks if an owner account already exists in the system
 * @returns Promise<boolean> True if an owner exists, false otherwise
 */
export async function checkIfOwnerExists(): Promise<boolean> {
  try {
    const ownersQuery = query(
      collection(db, 'users'),
      where('isOwner', '==', true),
      limit(1)
    );
    
    const ownersSnapshot = await getDocs(ownersQuery);
    return !ownersSnapshot.empty;
  } catch (error) {
    console.error('Error checking if owner exists:', error);
    throw error;
  }
}

/**
 * Promotes an existing user to Owner role
 * This function can only be used if no owner exists yet
 * After that, owners can manage admins through the UI
 * 
 * @param email Email of the existing user to promote to owner
 * @param password Password of the existing user
 * @returns Promise<string> The user ID of the new owner
 */
export async function createInitialOwner(email: string, password: string): Promise<string> {
  try {
    console.log(`Setting up initial owner account for ${email}...`);
    
    // Check if an owner already exists
    const ownerExists = await checkIfOwnerExists();
    if (ownerExists) {
      throw new Error('An owner account already exists. Cannot create another owner.');
    }
    
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

/**
 * Creates a new user and sets them as the owner
 * This function can only be used if no owner exists yet
 * 
 * @param email Email for the new owner account
 * @param password Password for the new owner account
 * @param displayName Display name for the owner
 * @returns Promise<string> The user ID of the new owner
 */
export async function createNewOwnerAccount(
  email: string, 
  password: string, 
  displayName: string
): Promise<string> {
  try {
    console.log(`Creating new owner account for ${email}...`);
    
    // Check if an owner already exists
    const ownerExists = await checkIfOwnerExists();
    if (ownerExists) {
      throw new Error('An owner account already exists. Cannot create another owner.');
    }
    
    // Create a new Firebase Auth user
    const auth = getAuth(app);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;
    
    // Create the user document in Firestore with owner privileges
    await createUser(userId, {
      email,
      displayName,
      isOwner: true,
      isAdmin: true,
      role: 'owner',
      approved: true,
      status: 'active'
    });
    
    console.log(`Successfully created new owner account for ${email}!`);
    return userId;
  } catch (error) {
    console.error('Error creating new owner account:', error);
    throw error;
  }
}

// Can be called directly from the console for setup:
// import { createInitialOwner } from './lib/createOwner';
// createInitialOwner('owner@example.com', 'password123').then(userId => console.log('Owner created with ID:', userId));