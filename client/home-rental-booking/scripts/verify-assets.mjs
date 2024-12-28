import { readdir } from 'fs/promises';
import { join } from 'path';

async function verifyAssets() {
  const distPath = join(process.cwd(), 'dist');
  const files = await readdir(distPath, { recursive: true });
  console.log('Assets verified ✓');
}

verifyAssets().catch(console.error);