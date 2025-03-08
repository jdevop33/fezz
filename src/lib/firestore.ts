import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
  DocumentData,
  QueryConstraint,
  Timestamp,
  onSnapshot,
  DocumentReference
} from 'firebase/firestore';
import { db } from './firebase';

// Types
export type FirestoreTimestamp = Timestamp;
export type FirestoreDocumentData = DocumentData;

// Create a new document with a generated ID
export async function createDocument<T extends DocumentData>(
  collectionName: string, 
  data: T
) {
  return addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

// Create or update a document with a specific ID
export async function setDocument<T extends DocumentData>(
  collectionName: string, 
  docId: string, 
  data: T, 
  merge = true
) {
  const docRef = doc(db, collectionName, docId);
  
  return setDoc(
    docRef, 
    {
      ...data,
      updatedAt: serverTimestamp()
    }, 
    { merge }
  );
}

// Update specific fields in an existing document
export async function updateDocument<T extends Partial<DocumentData>>(
  collectionName: string, 
  docId: string, 
  data: T
) {
  const docRef = doc(db, collectionName, docId);
  
  return updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
}

// Get a document by ID
export async function getDocument<T = DocumentData>(
  collectionName: string, 
  docId: string
): Promise<T | null> {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T;
  } else {
    return null;
  }
}

// Delete a document by ID
export async function deleteDocument(
  collectionName: string, 
  docId: string
) {
  const docRef = doc(db, collectionName, docId);
  return deleteDoc(docRef);
}

// Query documents (with optional filters, ordering, and limits)
export async function queryDocuments<T = DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef, ...constraints);
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  })) as T[];
}

// Listen to real-time updates on a document
export function listenToDocument<T = DocumentData>(
  collectionName: string,
  docId: string,
  callback: (data: T | null) => void
) {
  const docRef = doc(db, collectionName, docId);
  
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() } as T);
    } else {
      callback(null);
    }
  });
}

// Listen to real-time updates on a query
export function listenToQuery<T = DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = [],
  callback: (data: T[]) => void
) {
  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef, ...constraints);
  
  return onSnapshot(q, (querySnapshot) => {
    const docs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    })) as T[];
    
    callback(docs);
  });
}

// Helper function to create a fully typed document reference
export function getDocRef<T = DocumentData>(
  collectionName: string, 
  docId: string
): DocumentReference<T> {
  return doc(db, collectionName, docId) as DocumentReference<T>;
}

// Helper functions for common query constraints
export { 
  where, 
  orderBy, 
  limit, 
  serverTimestamp,
  Timestamp
};