import imageManifest from './imageManifest.json';

/**
 * Get the correct image path for a product based on flavor and strength
 * 
 * @param flavor The product flavor (e.g. "apple-mint")
 * @param strength The nicotine strength (e.g. 6, 12, 16)
 * @param fallback Optional fallback image path if specific image not found
 * @returns The image path
 */
export function getProductImagePath(
  flavor: string, 
  strength: number, 
  fallback: string = imageManifest.placeholder || '/images/products/placeholder.svg'
): string {
  try {
    // Normalize flavor to lowercase with hyphens
    const normalizedFlavor = flavor.toLowerCase().replace(/\s+/g, '-');
    
    // Check if flavor exists in main products manifest
    if (imageManifest.products[normalizedFlavor]) {
      // Check if strength exists for this flavor
      const strengthStr = String(strength);
      if (imageManifest.products[normalizedFlavor][strengthStr]) {
        return imageManifest.products[normalizedFlavor][strengthStr];
      }
      
      // If exact strength not found, try to find closest strength
      const availableStrengths = Object.keys(imageManifest.products[normalizedFlavor]).map(Number);
      if (availableStrengths.length > 0) {
        // Find closest strength
        const closestStrength = availableStrengths.reduce((prev, curr) => 
          Math.abs(curr - strength) < Math.abs(prev - strength) ? curr : prev
        );
        return imageManifest.products[normalizedFlavor][String(closestStrength)];
      }
    }
    
    // Try alternate images if available
    if (imageManifest.alternateImages && imageManifest.alternateImages[normalizedFlavor]) {
      const strengthStr = String(strength);
      if (imageManifest.alternateImages[normalizedFlavor][strengthStr]) {
        return imageManifest.alternateImages[normalizedFlavor][strengthStr];
      }
      
      // If exact strength not found in alternates, try to find closest strength
      const availableAlternateStrengths = Object.keys(imageManifest.alternateImages[normalizedFlavor]).map(Number);
      if (availableAlternateStrengths.length > 0) {
        const closestStrength = availableAlternateStrengths.reduce((prev, curr) => 
          Math.abs(curr - strength) < Math.abs(prev - strength) ? curr : prev
        );
        return imageManifest.alternateImages[normalizedFlavor][String(closestStrength)];
      }
    }
    
    // If still not found, try to find a similar flavor with any strength
    const similarFlavors = Object.keys(imageManifest.products)
      .filter(f => f.includes(normalizedFlavor) || normalizedFlavor.includes(f));
    
    if (similarFlavors.length > 0) {
      const firstFlavor = similarFlavors[0];
      const firstStrength = Object.keys(imageManifest.products[firstFlavor])[0];
      return imageManifest.products[firstFlavor][firstStrength];
    }
    
    // If all else fails, return fallback
    return fallback;
  } catch (err) {
    console.error('Error getting product image path:', err);
    return fallback;
  }
}

/**
 * Get a random banner image from the available banners
 * 
 * @param index Optional specific banner index to use
 * @returns The banner image path
 */
export function getBannerImagePath(index?: number): string {
  try {
    if (!imageManifest.banners.length) {
      return '/images/products/banner.jpg'; // Default
    }
    
    if (typeof index === 'number' && index >= 0 && index < imageManifest.banners.length) {
      return imageManifest.banners[index];
    }
    
    // Return random banner
    const randomIndex = Math.floor(Math.random() * imageManifest.banners.length);
    return imageManifest.banners[randomIndex];
  } catch (err) {
    console.error('Error getting banner image path:', err);
    return '/images/products/banner.jpg';
  }
}

/**
 * Get all available product flavors from the manifest
 * 
 * @returns Array of flavor names
 */
export function getAvailableFlavors(): string[] {
  return Object.keys(imageManifest.products);
}

/**
 * Get all available strengths for a specific flavor
 * 
 * @param flavor The product flavor
 * @returns Array of strengths as numbers
 */
export function getAvailableStrengths(flavor: string): number[] {
  const normalizedFlavor = flavor.toLowerCase().replace(/\s+/g, '-');
  
  if (imageManifest.products[normalizedFlavor]) {
    return Object.keys(imageManifest.products[normalizedFlavor]).map(Number);
  }
  
  return [];
}