import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const copyUploads = async () => {
  const srcDir = path.join(process.cwd(), 'src', 'public', 'uploads');
  const destDir = path.join(process.cwd(), 'dist', 'public', 'uploads');

  try {
    // Ensure the destination directory exists
    await fs.promises.mkdir(path.join(process.cwd(), 'dist', 'public'), { recursive: true });
    
    // Copy the uploads directory
    await fs.promises.cp(srcDir, destDir, { recursive: true, force: true });

    // Move files from dist/src to dist root
    const srcFiles = path.join(process.cwd(), 'dist', 'src');
    const destFiles = path.join(process.cwd(), 'dist');
    
    if (fs.existsSync(srcFiles)) {
      await fs.promises.cp(srcFiles, destFiles, { recursive: true, force: true });
      await fs.promises.rm(srcFiles, { recursive: true, force: true });
    }

    console.log('Successfully copied files maintaining public/uploads structure');
  } catch (err) {
    console.error('Error copying files:', err);
    process.exit(1);
  }
};

copyUploads(); 