// productData.ts - Product data types and information
export interface ProductData {
  itemPN: string;
  description: string;
  flavor: string;
  strength: string;
  price: string;
  wholesalePrice: string;
  inventoryCount: number;
  category: 'Light' | 'Medium' | 'Strong' | 'Extra Strong';
  imageFilename: string;
}

// Sample product data for the store
export const products: ProductData[] = [
  {
    itemPN: "PUXX-Applemint-6mg",
    description: "PUXX Apple mint Tobacco Free Nicotine Pouch",
    flavor: "Apple mint",
    strength: "6mg",
    price: "7.99",
    wholesalePrice: "4.79",
    inventoryCount: 10000,
    category: "Light",
    imageFilename: "puxx_apple_mint_6mg.png"
  },
  {
    itemPN: "PUXX-Applemint-12mg",
    description: "PUXX Apple mint Tobacco Free Nicotine Pouch",
    flavor: "Apple mint",
    strength: "12mg",
    price: "9.99",
    wholesalePrice: "5.99",
    inventoryCount: 5000,
    category: "Medium",
    imageFilename: "puxx_apple_mint_12mg.png"
  },
  {
    itemPN: "PUXX-Applemint-16mg",
    description: "PUXX Apple mint Tobacco Free Nicotine Pouch",
    flavor: "Apple mint",
    strength: "16mg",
    price: "11.32",
    wholesalePrice: "6.79",
    inventoryCount: 5000,
    category: "Strong",
    imageFilename: "puxx_apple_mint_16mg.png"
  },
  {
    itemPN: "PUXX-Applemint-22mg",
    description: "PUXX Apple mint Tobacco Free Nicotine Pouch",
    flavor: "Apple mint",
    strength: "22mg",
    price: "13.32",
    wholesalePrice: "7.99",
    inventoryCount: 5000,
    category: "Extra Strong",
    imageFilename: "puxx_apple_mint_22mg.png"
  },
  {
    itemPN: "PUXX-Coolmint-6mg",
    description: "PUXX Cool mint Tobacco Free Nicotine Pouch",
    flavor: "Cool mint",
    strength: "6mg",
    price: "7.99",
    wholesalePrice: "4.79",
    inventoryCount: 10000,
    category: "Light",
    imageFilename: "puxx_cool_mint_6mg.png"
  },
  {
    itemPN: "PUXX-Coolmint-12mg",
    description: "PUXX Cool mint Tobacco Free Nicotine Pouch",
    flavor: "Cool mint",
    strength: "12mg",
    price: "9.99",
    wholesalePrice: "5.99",
    inventoryCount: 5000,
    category: "Medium",
    imageFilename: "puxx_cool_mint_12mg.png"
  },
  {
    itemPN: "PUXX-Coolmint-22mg",
    description: "PUXX Cool mint Tobacco Free Nicotine Pouch",
    flavor: "Cool mint",
    strength: "22mg",
    price: "13.32",
    wholesalePrice: "7.99",
    inventoryCount: 5000,
    category: "Extra Strong",
    imageFilename: "puxx_cool_mint_22mg.png"
  },
  {
    itemPN: "PUXX-Peppermint-6mg",
    description: "PUXX Peppermint Tobacco Free Nicotine Pouch",
    flavor: "Peppermint",
    strength: "6mg",
    price: "7.99",
    wholesalePrice: "4.79",
    inventoryCount: 10000,
    category: "Light",
    imageFilename: "puxx_peppermint_6mg.png"
  },
  {
    itemPN: "PUXX-Peppermint-12mg",
    description: "PUXX Peppermint Tobacco Free Nicotine Pouch",
    flavor: "Peppermint",
    strength: "12mg",
    price: "9.99",
    wholesalePrice: "5.99",
    inventoryCount: 5000,
    category: "Medium",
    imageFilename: "puxx_peppermint_12mg.png"
  },
  {
    itemPN: "PUXX-Peppermint-16mg",
    description: "PUXX Peppermint Tobacco Free Nicotine Pouch",
    flavor: "Peppermint",
    strength: "16mg",
    price: "11.32",
    wholesalePrice: "6.79",
    inventoryCount: 5000,
    category: "Strong",
    imageFilename: "puxx_peppermint_16mg.png"
  },
  {
    itemPN: "PUXX-Peppermint-22mg",
    description: "PUXX Peppermint Tobacco Free Nicotine Pouch",
    flavor: "Peppermint",
    strength: "22mg",
    price: "13.32",
    wholesalePrice: "7.99",
    inventoryCount: 5000,
    category: "Extra Strong",
    imageFilename: "puxx_peppermint_22mg.png"
  },
  {
    itemPN: "PUXX-Cola-6mg",
    description: "PUXX Cola Tobacco Free Nicotine Pouch",
    flavor: "Cola",
    strength: "6mg",
    price: "7.99",
    wholesalePrice: "4.79",
    inventoryCount: 5000,
    category: "Light",
    imageFilename: "puxx_cola_6mg.png"
  },
  {
    itemPN: "PUXX-Cola-12mg",
    description: "PUXX Cola Tobacco Free Nicotine Pouch",
    flavor: "Cola",
    strength: "12mg",
    price: "9.99",
    wholesalePrice: "5.99",
    inventoryCount: 5000,
    category: "Medium",
    imageFilename: "puxx_cola_12mg.png"
  },
  {
    itemPN: "PUXX-Cola-16mg",
    description: "PUXX Cola Tobacco Free Nicotine Pouch",
    flavor: "Cola",
    strength: "16mg",
    price: "11.32",
    wholesalePrice: "6.79",
    inventoryCount: 5000,
    category: "Strong",
    imageFilename: "puxx_cola_16mg.png"
  },
  {
    itemPN: "PUXX-Spearmint-6mg",
    description: "PUXX Spearmint Tobacco Free Nicotine Pouch",
    flavor: "Spearmint",
    strength: "6mg",
    price: "7.99",
    wholesalePrice: "4.79",
    inventoryCount: 10000,
    category: "Light",
    imageFilename: "puxx_spearmint_6mg.png"
  },
  {
    itemPN: "PUXX-Spearmint-12mg",
    description: "PUXX Spearmint Tobacco Free Nicotine Pouch",
    flavor: "Spearmint",
    strength: "12mg",
    price: "9.99",
    wholesalePrice: "5.99",
    inventoryCount: 5000,
    category: "Medium",
    imageFilename: "puxx_spearmint_12mg.png"
  },
  {
    itemPN: "PUXX-Spearmint-16mg",
    description: "PUXX Spearmint Tobacco Free Nicotine Pouch",
    flavor: "Spearmint",
    strength: "16mg",
    price: "11.32",
    wholesalePrice: "6.79",
    inventoryCount: 5000,
    category: "Strong",
    imageFilename: "puxx_spearmint_16mg.png"
  },
  {
    itemPN: "PUXX-Spearmint-22mg",
    description: "PUXX Spearmint Tobacco Free Nicotine Pouch",
    flavor: "Spearmint",
    strength: "22mg",
    price: "13.32",
    wholesalePrice: "7.99",
    inventoryCount: 5000,
    category: "Extra Strong",
    imageFilename: "puxx_spearmint_22mg.png"
  },
  {
    itemPN: "PUXX-Watermelon-6mg",
    description: "PUXX Watermelon Tobacco Free Nicotine Pouch",
    flavor: "Watermelon",
    strength: "6mg",
    price: "7.99",
    wholesalePrice: "4.79",
    inventoryCount: 5000,
    category: "Light",
    imageFilename: "puxx_watermelon_6mg.png"
  },
  {
    itemPN: "PUXX-Watermelon-16mg",
    description: "PUXX Watermelon Tobacco Free Nicotine Pouch",
    flavor: "Watermelon",
    strength: "16mg",
    price: "11.32",
    wholesalePrice: "6.79",
    inventoryCount: 5000,
    category: "Strong",
    imageFilename: "puxx_watermelon_16mg.png"
  },
  {
    itemPN: "PUXX-Cherry-6mg",
    description: "PUXX Cherry Tobacco Free Nicotine Pouch",
    flavor: "Cherry",
    strength: "6mg",
    price: "7.99",
    wholesalePrice: "4.79",
    inventoryCount: 5000,
    category: "Light",
    imageFilename: "puxx_cherry_6mg.png"
  },
  {
    itemPN: "PUXX-Cherry-16mg",
    description: "PUXX Cherry Tobacco Free Nicotine Pouch",
    flavor: "Cherry",
    strength: "16mg",
    price: "11.32",
    wholesalePrice: "6.79",
    inventoryCount: 5000,
    category: "Strong",
    imageFilename: "puxx_cherry_16mg.png"
  }
];

// Helper functions for dealing with products
export const getUniqueProductFlavors = (): string[] => {
  return Array.from(new Set(products.map(product => product.flavor)));
};

export const getUniqueProductStrengths = (): string[] => {
  return Array.from(new Set(products.map(product => product.strength)));
};

export const getProductsByCategory = (category: string): ProductData[] => {
  return products.filter(product => product.category === category);
};

export const getProductsByFlavor = (flavor: string): ProductData[] => {
  return products.filter(product => product.flavor === flavor);
};

export const getProductByPN = (itemPN: string): ProductData | undefined => {
  return products.find(product => product.itemPN === itemPN);
};

// For image paths
export const getProductImagePath = (product: ProductData): string => {
  return `/images/products/${product.imageFilename}`;
};