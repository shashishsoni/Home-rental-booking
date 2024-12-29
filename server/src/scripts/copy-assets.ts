import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const copyUploads = async () => {
  const srcDir = path.join(__dirname, '../public/uploads');
  const destDir = path.join(__dirname, '../../dist/public/uploads');

  try {
    // Ensure the destination directory exists
    await fs.promises.mkdir(destDir, { recursive: true });
    
    // Copy the uploads directory
    await fs.promises.cp(srcDir, destDir, { recursive: true, force: true });
    console.log('Successfully copied uploads directory to dist');
  } catch (err) {
    console.error('Error copying uploads directory:', err);
    process.exit(1);
  }
};

copyUploads(); 