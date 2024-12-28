import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),  // Resolves @ to the src folder
    },
  },
  server: {
    // Enable HMR for production-like environment
    hmr: {
      protocol: 'ws',
      host: 'home-rental-booking-1.onrender.com',  // Correct host
    },
    proxy: {
      '/api': {
        target: 'https://home-rental-booking-1.onrender.com',  // Set your backend API URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    assetsInlineLimit: 4096,  // Inline assets up to this limit
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id
              .toString()
              .split('node_modules/')[1]
              .split('/')[0]
              .toString();  // Split dependencies for better chunking
          }
        },
      },
    },
  },
  optimizeDeps: {
    noDiscovery: true,  // Disable automatic dependency discovery
    include: []         // Empty array to avoid pre-bundling dependencies
  },
  logLevel: 'error',  // Global logging level setting
});
