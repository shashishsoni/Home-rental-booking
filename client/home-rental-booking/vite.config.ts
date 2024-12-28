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
  server: {
    hmr: {
      protocol: 'ws',
      host: 'home-rental-booking-1.onrender.com',
    },
    proxy: {
      '/api': {
        target: 'https://home-rental-booking-1.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    // Remove assetsInlineLimit to ensure proper file generation
    rollupOptions: {
      output: {
        // Ensure proper file naming and chunking
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'; // Simplified chunking strategy
          }
        },
      },
    },
  },
  // Remove optimizeDeps configuration as it might interfere with proper bundling
  // optimizeDeps: {
  //   noDiscovery: true,
  //   include: []
  // },
});