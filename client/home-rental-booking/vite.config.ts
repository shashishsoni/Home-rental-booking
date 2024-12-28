import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),  // This resolves @ to the src folder
    },
  },
  server: {
    // Enable HMR for production-like environment
    hmr: {
      protocol: 'ws', // Ensure WebSocket connection uses the correct protocol
      host: 'home-rental-booking-1.onrender.com', // Use the correct host if applicable
    },
    // Set proxy to handle requests from the server (if needed for local dev)
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Set your backend API URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    // Configure build options for proper handling of assets and types
    assetsInlineLimit: 4096, // Increase asset inline limit for large assets
    rollupOptions: {
      output: {
        // Ensure proper asset handling during build
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id
              .toString()
              .split('node_modules/')[1]
              .split('/')[0]
              .toString();
          }
        },
      },
    },
  },
});
