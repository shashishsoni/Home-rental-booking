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
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-redux': ['react-redux', '@reduxjs/toolkit', 'redux-persist'],
          'vendor-router': ['react-router-dom'],
          'vendor-ui': ['framer-motion', '@mui/material', '@emotion/react'],
        },
        dir: 'dist',
        entryFileNames: 'src/[name].[hash].js',
        chunkFileNames: 'src/chunks/[name].[hash].js',
        assetFileNames: (assetInfo: { name?: string }) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1] || '';
          if (assetInfo.name && /\.(png|jpe?g|gif|svg|webp|avif)$/.test(assetInfo.name)) {
            return 'src/assets/images/[name].[hash].[ext]';
          }
          if (ext === 'css') {
            return 'src/assets/css/[name].[hash].[ext]';
          }
          return 'src/assets/[name].[hash].[ext]';
        }
      }
    }
  }
});
