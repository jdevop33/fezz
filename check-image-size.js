import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import sizeOf from 'image-size';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
  const pngPath = join(__dirname, 'public/images/products/banner.png');
  const pngDimensions = sizeOf(pngPath);
  console.log('Banner PNG dimensions:', pngDimensions);
} catch (err) {
  console.error('Error checking PNG:', err.message);
}

try {
  const jpgPath = join(__dirname, 'public/images/products/banner.jpg');
  const jpgDimensions = sizeOf(jpgPath);
  console.log('Banner JPG dimensions:', jpgDimensions);
} catch (err) {
  console.error('Error checking JPG:', err.message);
}