/**
 * Script to analyze and fix product image naming inconsistencies
 * 
 * This script:
 * 1. Scans product data and image files in the public directory
 * 2. Identifies images that don't follow the [flavor]-[strength]mg.[extension] convention
 * 3. Generates a report of inconsistencies
 * 4. Can rename files to match the correct pattern if requested
 * 
 * Usage: 
 *   - Report only: node fix-product-images.js
 *   - Report and fix: node fix-product-images.js --fix
 */

import fs from 'fs/promises';
import path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Constants
const PRODUCT_IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'products');
const CATALOG_PATH = path.join(process.cwd(), 'catalog-data.json');
const IMAGE_MANIFEST_PATH = path.join(process.cwd(), 'src', 'lib', 'imageManifest.json');

// Check if we should fix inconsistencies
const shouldFix = process.argv.includes('--fix');

/**
 * Main function
 */
async function main() {
  try {
    console.log('Starting image naming consistency check...');
    
    // Load product data
    const catalogData = await loadCatalogData();
    
    // Load image manifest
    const imageManifest = await loadImageManifest();
    
    // Get all image files in the products directory
    const imageFiles = await listImageFiles();
    
    // Extract product images (excluding banners, icons, etc.)
    const productImages = imageFiles.filter(file => {
      return !file.startsWith('banner') && 
             !file.startsWith('logo') && 
             !file.startsWith('image') && 
             !file.startsWith('hero') && 
             !file.startsWith('card') && 
             !file.startsWith('placeholder') &&
             !file.startsWith('rectban');
    });
    
    console.log(`Found ${productImages.length} product image files`);
    
    // Check for inconsistencies
    const {
      consistentImages,
      inconsistentImages,
      missingImages,
      unmappedImages
    } = analyzeInconsistencies(catalogData, imageManifest, productImages);
    
    // Generate report
    generateReport(consistentImages, inconsistentImages, missingImages, unmappedImages);
    
    // Fix inconsistencies if requested
    if (shouldFix && inconsistentImages.length > 0) {
      await fixInconsistencies(inconsistentImages, imageManifest);
      console.log('\nImage fixes applied successfully!');
    } else if (inconsistentImages.length > 0) {
      console.log('\nTo fix these inconsistencies, run: node fix-product-images.js --fix');
    }
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

/**
 * Load the catalog data from JSON file
 */
async function loadCatalogData() {
  try {
    console.log(`Loading catalog data from ${CATALOG_PATH}...`);
    const data = await fs.readFile(CATALOG_PATH, 'utf-8');
    const parsed = JSON.parse(data);
    const products = parsed.products || parsed;
    
    console.log(`Loaded ${products.length} products from catalog`);
    return products;
  } catch (error) {
    console.error('Error loading catalog data:', error);
    return [];
  }
}

/**
 * Load the image manifest from JSON file
 */
async function loadImageManifest() {
  try {
    console.log(`Loading image manifest from ${IMAGE_MANIFEST_PATH}...`);
    const data = await fs.readFile(IMAGE_MANIFEST_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading image manifest:', error);
    return { products: {}, alternateImages: {} };
  }
}

/**
 * List all image files in the products directory
 */
async function listImageFiles() {
  try {
    console.log(`Scanning image directory: ${PRODUCT_IMAGES_DIR}...`);
    const files = await fs.readdir(PRODUCT_IMAGES_DIR);
    return files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'].includes(ext);
    });
  } catch (error) {
    console.error('Error reading image directory:', error);
    return [];
  }
}

/**
 * Check if an image file follows the convention: [flavor]-[strength]mg.[extension]
 */
function followsNamingConvention(filename) {
  // The pattern matches: flavor (with possible hyphens), followed by a hyphen, number, mg, and an extension
  const pattern = /^([\w-]+)-(\d+)mg\.(jpg|jpeg|png|gif|svg|webp)$/i;
  return pattern.test(filename);
}

/**
 * Extract flavor and strength from an image filename
 */
function extractFlavorAndStrength(filename) {
  const match = filename.match(/^([\w-]+)-(\d+)mg\.(jpg|jpeg|png|gif|svg|webp)$/i);
  if (match) {
    return {
      flavor: match[1],
      strength: parseInt(match[2], 10),
      extension: match[3]
    };
  }
  return null;
}

/**
 * Analyze image naming inconsistencies
 */
function analyzeInconsistencies(products, imageManifest, imageFiles) {
  const consistentImages = [];
  const inconsistentImages = [];
  const missingImages = [];
  const unmappedImages = [];
  
  // Create a map of all images referenced in the product data
  const referencedImages = new Map();
  
  // Add references from catalog data
  products.forEach(product => {
    if (product.imageUrl) {
      const filename = path.basename(product.imageUrl);
      const productId = `${product.flavor.toLowerCase().replace(/\s+/g, '-')}-${product.strength}mg`;
      
      referencedImages.set(filename, {
        source: 'catalog',
        path: product.imageUrl,
        product: productId,
        flavor: product.flavor,
        strength: product.strength
      });
    }
  });
  
  // Add references from image manifest
  Object.entries(imageManifest.products).forEach(([flavor, strengthMap]) => {
    Object.entries(strengthMap).forEach(([strength, imagePath]) => {
      const filename = path.basename(imagePath);
      const productId = `${flavor}-${strength}mg`;
      
      referencedImages.set(filename, {
        source: 'manifest',
        path: imagePath,
        product: productId,
        flavor,
        strength: parseInt(strength, 10)
      });
    }); 
  });
  
  // Add references from alternate images
  if (imageManifest.alternateImages) {
    Object.entries(imageManifest.alternateImages).forEach(([flavor, strengthMap]) => {
      Object.entries(strengthMap).forEach(([strength, imagePath]) => {
        const filename = path.basename(imagePath);
        const productId = `${flavor}-${strength}mg`;
        
        referencedImages.set(filename, {
          source: 'manifest-alternate',
          path: imagePath,
          product: productId,
          flavor,
          strength: parseInt(strength, 10)
        });
      });
    });
  }
  
  // Check each image file against naming convention
  for (const imageFile of imageFiles) {
    const reference = referencedImages.get(imageFile);
    
    if (followsNamingConvention(imageFile)) {
      // Image follows convention
      const details = extractFlavorAndStrength(imageFile);
      
      if (reference) {
        // Image is referenced and follows convention
        consistentImages.push({
          filename: imageFile,
          path: reference.path,
          product: reference.product,
          flavor: reference.flavor,
          strength: reference.strength
        });
      } else {
        // Image follows convention but is not referenced
        unmappedImages.push({
          filename: imageFile,
          flavor: details.flavor,
          strength: details.strength,
          extension: details.extension
        });
      }
    } else {
      // Image doesn't follow naming convention
      if (reference) {
        // Image is referenced but doesn't follow convention
        inconsistentImages.push({
          filename: imageFile,
          path: reference.path,
          product: reference.product,
          flavor: reference.flavor,
          strength: reference.strength,
          proposedName: `${reference.flavor.toLowerCase().replace(/\s+/g, '-')}-${reference.strength}mg${path.extname(imageFile)}`
        });
      } else {
        // Image doesn't follow convention and is not referenced
        unmappedImages.push({
          filename: imageFile,
          proposedName: null
        });
      }
    }
  }
  
  // Find missing images (referenced but not found in directory)
  referencedImages.forEach((reference, filename) => {
    if (!imageFiles.includes(filename)) {
      missingImages.push({
        path: reference.path,
        product: reference.product,
        flavor: reference.flavor,
        strength: reference.strength
      });
    }
  });
  
  return {
    consistentImages,
    inconsistentImages,
    missingImages,
    unmappedImages
  };
}

/**
 * Generate a report of the analysis
 */
function generateReport(consistentImages, inconsistentImages, missingImages, unmappedImages) {
  console.log('\n=============== ANALYSIS REPORT ===============');
  console.log(`Consistent images: ${consistentImages.length}`);
  console.log(`Inconsistent images: ${inconsistentImages.length}`);
  console.log(`Missing images: ${missingImages.length}`);
  console.log(`Unmapped images: ${unmappedImages.length}`);
  
  if (inconsistentImages.length > 0) {
    console.log('\n----- INCONSISTENT IMAGES -----');
    inconsistentImages.forEach((image, index) => {
      console.log(`${index + 1}. ${image.filename}`);
      console.log(`   Flavor: ${image.flavor}, Strength: ${image.strength}mg`);
      console.log(`   Referenced as: ${image.path}`);
      console.log(`   Proposed name: ${image.proposedName}`);
    });
  }
  
  if (missingImages.length > 0) {
    console.log('\n----- MISSING IMAGES -----');
    missingImages.forEach((image, index) => {
      console.log(`${index + 1}. ${image.path}`);
      console.log(`   Product: ${image.product} (${image.flavor}, ${image.strength}mg)`);
    });
  }
  
  if (unmappedImages.length > 0) {
    console.log('\n----- UNMAPPED IMAGES -----');
    unmappedImages.forEach((image, index) => {
      console.log(`${index + 1}. ${image.filename}`);
      if (image.flavor && image.strength) {
        console.log(`   Appears to be: ${image.flavor}, ${image.strength}mg`);
      } else {
        console.log('   Does not follow naming convention');
      }
    });
  }
}

/**
 * Fix inconsistencies by renaming files and updating the image manifest
 */
async function fixInconsistencies(inconsistentImages, imageManifest) {
  console.log('\nApplying fixes for inconsistent images...');
  
  const updates = [];
  const manifestUpdates = [];
  
  for (const image of inconsistentImages) {
    if (!image.proposedName) continue;
    
    const oldPath = path.join(PRODUCT_IMAGES_DIR, image.filename);
    const newPath = path.join(PRODUCT_IMAGES_DIR, image.proposedName);
    
    try {
      // Step 1: Rename the file
      await fs.rename(oldPath, newPath);
      console.log(`Renamed: ${image.filename} → ${image.proposedName}`);
      
      // Track the update
      updates.push({
        oldName: image.filename,
        newName: image.proposedName,
        flavor: image.flavor,
        strength: image.strength
      });
      
      // Step 2: Prepare manifest update
      const normalizedFlavor = image.flavor.toLowerCase().replace(/\s+/g, '-');
      const strengthStr = String(image.strength);
      const newImagePath = `/images/products/${image.proposedName}`;
      
      // Check if this is a main image or alternate
      const isMainImage = image.path === (imageManifest.products[normalizedFlavor]?.[strengthStr]);
      const isAltImage = image.path === (imageManifest.alternateImages?.[normalizedFlavor]?.[strengthStr]);
      
      if (isMainImage) {
        // Update main image in manifest
        manifestUpdates.push({
          type: 'main',
          flavor: normalizedFlavor,
          strength: strengthStr,
          oldPath: image.path,
          newPath: newImagePath
        });
      } else if (isAltImage) {
        // Update alternate image in manifest
        manifestUpdates.push({
          type: 'alternate',
          flavor: normalizedFlavor,
          strength: strengthStr,
          oldPath: image.path,
          newPath: newImagePath
        });
      }
      
    } catch (error) {
      console.error(`Error renaming ${image.filename}:`, error);
    }
  }
  
  // Update the image manifest with the new file names
  if (manifestUpdates.length > 0) {
    console.log('\nUpdating image manifest...');
    
    for (const update of manifestUpdates) {
      if (update.type === 'main') {
        if (!imageManifest.products[update.flavor]) {
          imageManifest.products[update.flavor] = {};
        }
        imageManifest.products[update.flavor][update.strength] = update.newPath;
      } else if (update.type === 'alternate') {
        if (!imageManifest.alternateImages[update.flavor]) {
          imageManifest.alternateImages[update.flavor] = {};
        }
        imageManifest.alternateImages[update.flavor][update.strength] = update.newPath;
      }
    }
    
    // Save updated manifest
    await fs.writeFile(
      IMAGE_MANIFEST_PATH, 
      JSON.stringify(imageManifest, null, 2),
      'utf-8'
    );
    console.log('Image manifest updated successfully');
  }
  
  console.log(`\nRenaming complete. Fixed ${updates.length} image(s)`);
  
  // Generate summary report
  if (updates.length > 0) {
    console.log('\nSummary of changes:');
    updates.forEach((update, index) => {
      console.log(`${index + 1}. ${update.oldName} → ${update.newName}`);
    });
  }
}

// Run the script
main();