import { initializeProductsDatabase, initializeUserRoles, Product } from './pouchesDb';

// Sample product data based on the nicotine pouches inventory
const sampleProducts: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    itemPN: 'Apple mint',
    description: 'Tobacco Free Nicotine Pouch, 6mg/pouch',
    strength: 6,
    flavor: 'Apple mint',
    price: 24.99,
    wholesalePrice: 18.99,
    inventoryCount: 10000,
    category: 'nicotine-pouches',
    imageUrl: '/images/products/apple-mint.jpg',
    active: true
  },
  {
    itemPN: 'Apple mint',
    description: 'Tobacco Free Nicotine Pouch, 12mg/pouch',
    strength: 12,
    flavor: 'Apple mint',
    price: 26.99,
    wholesalePrice: 19.99,
    inventoryCount: 5000,
    category: 'nicotine-pouches',
    imageUrl: '/images/products/apple-mint.jpg',
    active: true
  },
  {
    itemPN: 'Cool mint',
    description: 'Tobacco Free Nicotine Pouch, 6mg/pouch',
    strength: 6,
    flavor: 'Cool mint',
    price: 24.99,
    wholesalePrice: 18.99,
    inventoryCount: 10000,
    category: 'nicotine-pouches',
    imageUrl: '/images/products/cool-mint.jpg',
    active: true
  },
  {
    itemPN: 'Cool mint',
    description: 'Tobacco Free Nicotine Pouch, 12mg/pouch',
    strength: 12,
    flavor: 'Cool mint',
    price: 26.99,
    wholesalePrice: 19.99,
    inventoryCount: 8000,
    category: 'nicotine-pouches',
    imageUrl: '/images/products/cool-mint.jpg',
    active: true
  },
  {
    itemPN: 'Berry',
    description: 'Tobacco Free Nicotine Pouch, 6mg/pouch',
    strength: 6,
    flavor: 'Berry',
    price: 24.99,
    wholesalePrice: 18.99,
    inventoryCount: 7500,
    category: 'nicotine-pouches',
    imageUrl: '/images/products/berry.jpg',
    active: true
  },
  {
    itemPN: 'Berry',
    description: 'Tobacco Free Nicotine Pouch, 12mg/pouch',
    strength: 12,
    flavor: 'Berry',
    price: 26.99,
    wholesalePrice: 19.99,
    inventoryCount: 6000,
    category: 'nicotine-pouches',
    imageUrl: '/images/products/berry.jpg',
    active: true
  },
  {
    itemPN: 'Citrus',
    description: 'Tobacco Free Nicotine Pouch, 6mg/pouch',
    strength: 6,
    flavor: 'Citrus',
    price: 24.99,
    wholesalePrice: 18.99,
    inventoryCount: 9000,
    category: 'nicotine-pouches',
    imageUrl: '/images/products/citrus.jpg',
    active: true
  },
  {
    itemPN: 'Citrus',
    description: 'Tobacco Free Nicotine Pouch, 12mg/pouch',
    strength: 12,
    flavor: 'Citrus',
    price: 26.99,
    wholesalePrice: 19.99,
    inventoryCount: 7000,
    category: 'nicotine-pouches',
    imageUrl: '/images/products/citrus.jpg',
    active: true
  },
  {
    itemPN: 'Coffee',
    description: 'Tobacco Free Nicotine Pouch, 6mg/pouch',
    strength: 6,
    flavor: 'Coffee',
    price: 24.99,
    wholesalePrice: 18.99,
    inventoryCount: 8500,
    category: 'nicotine-pouches',
    imageUrl: '/images/products/coffee.jpg',
    active: true
  },
  {
    itemPN: 'Coffee',
    description: 'Tobacco Free Nicotine Pouch, 12mg/pouch',
    strength: 12,
    flavor: 'Coffee',
    price: 26.99,
    wholesalePrice: 19.99,
    inventoryCount: 6500,
    category: 'nicotine-pouches',
    imageUrl: '/images/products/coffee.jpg',
    active: true
  }
];

// Initialize the database
export async function initializeDatabase(): Promise<void> {
  try {
    // First initialize the user roles
    await initializeUserRoles();
    
    // Then initialize the products
    await initializeProductsDatabase(sampleProducts);
    
    console.log('Database initialization completed successfully!');
  } catch (error) {
    console.error('Error during database initialization:', error);
    throw error;
  }
}

// You can call this function when setting up the application for the first time
// or call individual initialization functions as needed
export default initializeDatabase;