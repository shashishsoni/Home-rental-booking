import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react')) {
              return 'react-vendor'; // Separate React-related modules
            }
            if (id.includes('mui') || id.includes('@emotion')) {
              return 'mui-vendor'; // Separate Material UI and Emotion
            }
            return 'vendor'; // Default for other node_modules
          }
        },
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: ({ name }) => {
          if (/\.(gif|jpe?g|png|svg|webp)$/.test(name ?? '')) {
            return 'assets/images/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
    assetsInlineLimit: 0,
    sourcemap: true,
    chunkSizeWarningLimit: 1000, // Allow up to 1 MB per chunk
    minify: 'esbuild',
    target: 'es2019',
  },
  publicDir: 'public',
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg', '**/*.webp'],
});
