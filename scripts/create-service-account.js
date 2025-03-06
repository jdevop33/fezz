/**
 * DEPRECATED: This script has been replaced by prepare-sa-key.js
 * For security reasons, service account keys should not be hardcoded in the repository.
 * 
 * Please use the prepare-sa-key.js script instead:
 * node prepare-sa-key.js <path-to-service-account-json>
 */

console.log('❌ ERROR: This script has been deprecated for security reasons.');
console.log('');
console.log('✅ Please use the new script instead:');
console.log('   node scripts/prepare-sa-key.js <path-to-service-account-json>');
console.log('');
console.log('📝 Instructions:');
console.log('1. Download a new service account key from the Firebase/GCP console');
console.log('2. Run the prepare-sa-key.js script with the path to the downloaded file');
console.log('3. Follow the instructions provided by the script to add the key to GitHub');
console.log('');
console.log('⚠️ IMPORTANT: For security reasons, you should revoke the old service account key');
console.log('   that was previously hardcoded in this file.');

process.exit(1);