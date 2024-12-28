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
      protocol: 'ws', // Ensure WebSocket connection uses the correct protocol
      host: 'home-rental-booking-1.onrender.com', // Adjust as needed for production environment
    },
    // Proxy configuration for API requests
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Your backend API URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    // Enable asset inlining for smaller assets
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Create chunks from dependencies (ensure better code-splitting)
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
    // Additional build optimizations
    sourcemap: false, // Disable source maps for production builds to save memory
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext', // Compile to the latest ECMAScript version for reduced size
    },
    // Disable pre-bundling of dependencies to save memory
    disabled: true,
  },
});
