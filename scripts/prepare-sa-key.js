/**
 * This script helps you prepare your GCP service account key for GitHub Actions
 * Run with: node prepare-sa-key.js
 */

const fs = require('fs');
const path = require('path');

// Check if a file path was provided
if (process.argv.length < 3) {
  console.error('Usage: node prepare-sa-key.js <path-to-service-account-json>');
  process.exit(1);
}

const saFilePath = process.argv[2];

try {
  // Read the service account JSON file
  const saContent = fs.readFileSync(saFilePath, 'utf8');
  
  // Parse it to ensure it's valid JSON
  JSON.parse(saContent);
  
  console.log('\n===== YOUR SERVICE ACCOUNT KEY =====');
  console.log(saContent);
  console.log('===================================\n');
  
  console.log('Instructions:');
  console.log('1. Copy the JSON content above');
  console.log('2. Go to your GitHub repository');
  console.log('3. Navigate to Settings > Secrets and variables > Actions');
  console.log('4. Click "New repository secret"');
  console.log('5. Name: GCP_SA_KEY');
  console.log('6. Value: Paste the JSON content');
  console.log('7. Click "Add secret"');
  console.log('\nNote: No need to encode as base64, the GitHub Action can use JSON directly');
} catch (error) {
  console.error('Error processing the service account file:', error.message);
  process.exit(1);
}