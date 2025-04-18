/**
 * Blob Storage Utility
 * 
 * This file provides utilities for working with Vercel Blob Storage
 * as an alternative to Firebase Storage for image uploads.
 * 
 * Vercel Blob Storage offers a free tier that can be used without
 * requiring a billing plan upgrade.
 */

/**
 * Upload a file to Vercel Blob Storage
 * 
 * @param file The file to upload
 * @param directory The directory to store the file in (e.g., 'products', 'profiles')
 * @param fileName Optional custom file name
 * @returns The URL of the uploaded file
 */
export async function uploadToBlob(
  file: File,
  directory: string,
  fileName?: string
): Promise<string> {
  try {
    // Generate a unique file name if not provided
    const uniqueFileName = fileName || `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const path = `${directory}/${uniqueFileName}`;
    
    // For now, we'll use a simple fetch to a serverless function
    // In production, you would implement the actual Vercel Blob upload
    // This is a placeholder for the actual implementation
    
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);
    
    // In a real implementation, you would call your Vercel serverless function
    // const response = await fetch('/api/upload', {
    //   method: 'POST',
    //   body: formData,
    // });
    
    // For now, we'll simulate the response
    // In a real implementation, you would parse the response from your API
    // const data = await response.json();
    // return data.url;
    
    // Simulate a response for development
    return `/images/${directory}/${uniqueFileName}`;
  } catch (error) {
    console.error('Error uploading to Blob storage:', error);
    throw error;
  }
}

/**
 * Delete a file from Vercel Blob Storage
 * 
 * @param url The URL of the file to delete
 * @returns A promise that resolves when the file is deleted
 */
export async function deleteFromBlob(url: string): Promise<void> {
  try {
    // In a real implementation, you would call your Vercel serverless function
    // await fetch('/api/delete', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ url }),
    // });
    
    // This is a placeholder for the actual implementation
    console.log(`File would be deleted: ${url}`);
  } catch (error) {
    console.error('Error deleting from Blob storage:', error);
    throw error;
  }
}

/**
 * Check if a URL is a Vercel Blob Storage URL
 * 
 * @param url The URL to check
 * @returns True if the URL is a Vercel Blob Storage URL
 */
export function isBlobUrl(url: string): boolean {
  // In a real implementation, you would check if the URL matches your Vercel Blob Storage pattern
  return url.includes('vercel-blob.com') || url.startsWith('/images/');
}

/**
 * Get a public URL for a file in Vercel Blob Storage
 * 
 * @param path The path of the file in Blob Storage
 * @returns The public URL of the file
 */
export function getBlobUrl(path: string): string {
  // In a real implementation, you would construct the URL based on your Vercel Blob Storage configuration
  return `/images/${path}`;
}
