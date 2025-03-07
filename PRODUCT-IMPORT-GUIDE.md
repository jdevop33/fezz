# Product Import Guide

This guide explains how to import product data into your Firebase Firestore database.

## Option 1: CSV Import (Recommended)

### Step 1: Prepare your CSV file
Create a CSV file with these columns:
```
itemPN,description,flavor,strength,price,wholesalePrice,inventoryCount,category
"PUXX-PEPPERMINT-16","Premium Tobacco-Free Nicotine Pouch, 16mg/pouch","Peppermint",16,24.99,18.99,1000,"nicotine-pouches"
```

Required columns:
- `itemPN`: Product ID or name (e.g., "PUXX-PEPPERMINT-16")
- `flavor`: Product flavor (e.g., "Peppermint")
- `strength`: Nicotine strength in mg (e.g., 16)
- `price`: Retail price (e.g., 24.99)

Optional columns:
- `description`: Product description
- `wholesalePrice`: Wholesale price (if not provided, calculated as 80% of retail price)
- `inventoryCount`: Available inventory (default: 1000)
- `category`: Product category (default: "nicotine-pouches")

### Step 2: Prepare your product images
Prepare your product images and name them according to this pattern:
```
[flavor]-[strength]mg.jpg
```

Examples:
- `peppermint-16mg.jpg`
- `cherry-16mg.jpg`
- `apple-mint-22mg.jpg`

Place these images in the `public/images/products/` directory.

### Step 3: Convert CSV to JSON
Run the following command to convert your CSV file to JSON:
```bash
npm run csv-to-json ./your-products.csv ./catalog-data.json
```

### Step 4: Import to Firebase
There are two options for importing to Firebase:

#### Option A: Use Firebase Emulator (for development)
1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Start the emulator:
```bash
npm run emulators
```

3. Set up local database:
```bash
npm run setup:local-db
```

4. Run the app with emulator:
```bash
npm run dev:emulate
```

#### Option B: Use Real Firebase (for production)
1. Create a service account key:
   - Go to Firebase Console > Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save as `serviceAccountKey.json` in project root

2. Initialize database with your products:
```bash
npm run create:firebase-db
```

## Option 2: Google AI Studio Import

If you have a large number of products or complex product data, you can use Google AI Studio to help with the import process:

1. Organize your product data in Google Drive:
   - Create a folder structure with product images and data spreadsheets
   - Use the schema provided in this guide for the AI to understand your data format

2. Use the following structured output schema in Google AI Studio:
```json
{
  "type": "object",
  "properties": {
    "products": {
      "type": "array",
      "description": "Array of product items to import into Firebase",
      "items": {
        "type": "object",
        "properties": {
          "itemPN": {
            "type": "string",
            "description": "Product ID or name"
          },
          "description": {
            "type": "string",
            "description": "Full product description"
          },
          "flavor": {
            "type": "string",
            "description": "Product flavor name"
          },
          "strength": {
            "type": "number",
            "description": "Nicotine strength in mg"
          },
          "price": {
            "type": "number",
            "description": "Retail price in USD"
          },
          "wholesalePrice": {
            "type": "number",
            "description": "Wholesale price in USD (optional)"
          },
          "inventoryCount": {
            "type": "number",
            "description": "Available inventory quantity"
          },
          "category": {
            "type": "string",
            "description": "Product category identifier"
          },
          "imageUrl": {
            "type": "string",
            "description": "Image URL path"
          },
          "active": {
            "type": "boolean",
            "description": "Whether the product is active"
          }
        },
        "required": ["itemPN", "flavor", "price"]
      }
    }
  },
  "required": ["products"]
}
```

3. Save the AI-generated output as `catalog-data.json`
4. Follow Step 4 above to import to Firebase

## Troubleshooting

### Database Access Issues
If you encounter "NOT_FOUND" errors when connecting to Firebase:
1. Ensure the Firestore database has been created in the Firebase Console
2. Check that your service account has proper permissions
3. Verify your project ID in `.env` matches your Firebase project

### Image Issues
If images don't display correctly:
1. Check image paths in the database match the actual file locations
2. Verify image files exist in `public/images/products/`
3. Confirm image formats are supported (.jpg, .png, .webp)

### Data Format Issues
If your data isn't importing correctly:
1. Check your CSV format for extra commas or quotes
2. Ensure numeric fields (price, strength) contain valid numbers
3. Verify your JSON structure matches the expected schema