import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject, 
  listAll,
  UploadMetadata
} from 'firebase/storage';
import { storage } from './firebase';

// Upload a file to Firebase Storage
export async function uploadFile(
  path: string, 
  file: File, 
  metadata?: UploadMetadata
): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file, metadata);
  return getDownloadURL(storageRef);
}

// Get the download URL for a file
export async function getFileUrl(path: string): Promise<string> {
  const storageRef = ref(storage, path);
  return getDownloadURL(storageRef);
}

// Delete a file from Firebase Storage
export async function deleteFile(path: string): Promise<void> {
  const storageRef = ref(storage, path);
  return deleteObject(storageRef);
}

// List all files in a directory
export async function listFiles(path: string): Promise<string[]> {
  const storageRef = ref(storage, path);
  const result = await listAll(storageRef);
  
  return Promise.all(
    result.items.map(itemRef => getDownloadURL(itemRef))
  );
}

// Generate a unique file path for uploading
export function generateFilePath(
  directory: string, 
  fileName: string, 
  userId?: string
): string {
  const timestamp = new Date().getTime();
  const cleanFileName = fileName.replace(/[^a-zA-Z0-9.]/g, '_');
  const userPrefix = userId ? `${userId}/` : '';
  
  return `${directory}/${userPrefix}${timestamp}_${cleanFileName}`;
}

// Extract file extension from file name
export function getFileExtension(fileName: string): string {
  return fileName.split('.').pop()?.toLowerCase() || '';
}

// Check if file is an image
export function isImageFile(file: File): boolean {
  const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  return imageTypes.includes(file.type);
}

// Create a data URL for preview (for images)
export function createFilePreview(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(file);
  });
}