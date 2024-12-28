import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const distAssetsDir = join(__dirname, '../dist/assets/images');

console.log('Verifying built assets...');
const files = readdirSync(distAssetsDir);
const imageFiles = files.filter(file => 
  file.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)
);

console.log(`Found ${imageFiles.length} image files in dist/assets/images:`);
imageFiles.forEach(file => {
  const filePath = join(distAssetsDir, file);
  const stats = readFileSync(filePath);
  const sizeMB = (stats.length / (1024 * 1024)).toFixed(2);
  console.log(`- ${file} (${sizeMB} MB)`);
});