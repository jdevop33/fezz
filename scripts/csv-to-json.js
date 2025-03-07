/**
 * Convert CSV product data to JSON catalog format
 * Usage: node csv-to-json.js ./products.csv ./catalog.json
 * 
 * Expected CSV format:
 * itemPN,description,flavor,strength,price,wholesalePrice,inventoryCount,category
 * "Apple mint","Tobacco Free Nicotine Pouch, 6mg/pouch","Apple mint",6,24.99,18.99,10000,"nicotine-pouches"
 */

import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

// Check arguments
if (process.argv.length < 4) {
  console.error('Usage: node csv-to-json.js ./products.csv ./catalog.json');
  process.exit(1);
}

const csvFilePath = process.argv[2];
const jsonOutputPath = process.argv[3];

// Read the CSV file
try {
  const csvContent = fs.readFileSync(csvFilePath, 'utf8');
  
  // Parse CSV
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });
  
  console.log(`Read ${records.length} products from CSV`);
  
  // Transform records to catalog format
  const products = records.map(record => {
    // Generate image filename based on flavor and strength
    const imageName = `${record.flavor.toLowerCase().replace(/\s+/g, '-')}${record.strength ? '-' + record.strength + 'mg' : ''}.jpg`;
    
    // Convert number strings to actual numbers
    const strength = record.strength ? parseInt(record.strength, 10) : null;
    const price = parseFloat(record.price);
    const wholesalePrice = record.wholesalePrice ? parseFloat(record.wholesalePrice) : Math.round((price * 0.8) * 100) / 100;
    const inventoryCount = parseInt(record.inventoryCount || '1000', 10);
    
    return {
      itemPN: record.itemPN || record.flavor,
      description: record.description || `${record.flavor} ${strength ? strength + 'mg' : ''}`,
      strength: strength,
      flavor: record.flavor,
      price: price,
      wholesalePrice: wholesalePrice,
      inventoryCount: inventoryCount,
      category: record.category || 'nicotine-pouches',
      imageUrl: `/images/products/${imageName}`,
      active: true
    };
  });
  
  // Write the JSON file
  fs.writeFileSync(jsonOutputPath, JSON.stringify(products, null, 2));
  
  console.log(`✅ Successfully converted ${products.length} products to JSON`);
  console.log(`✅ Output saved to: ${jsonOutputPath}`);
  
  // Print reminder about images
  console.log('\n📸 REMINDER: Make sure your product images are placed in:');
  console.log('   public/images/products/');
  console.log('\n   Expected image files:');
  products.forEach(product => {
    const imagePath = product.imageUrl.replace(/^\//, '');
    console.log(`   - ${imagePath}`);
  });
  
} catch (error) {
  console.error('❌ Error processing CSV file:', error);
  process.exit(1);
}