import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      output: {
        dir: 'dist',
        chunkFileNames: 'src/js/[name].[hash].js',
        entryFileNames: 'src/js/[name].[hash].js',
        assetFileNames: ({name}) => {
          if (/\.(gif|jpe?g|png|svg|webp|avif)$/.test(name ?? '')) {
            return 'src/assets/images/[name].[hash][extname]'
          }
          if (/\.css$/.test(name ?? '')) {
            return 'src/assets/css/[name].[hash][extname]'
          }
          return 'src/[name].[hash][extname]'
        }
      }
    },
    assetsInlineLimit: 0,
    sourcemap: true,
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})