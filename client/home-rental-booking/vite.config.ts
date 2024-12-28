import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Disable chunk size reporting
    reportCompressedSize: false,
    // Minimize console output during build
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': [
            'react', 
            'react-dom',
            '@mui/material', 
            '@mui/icons-material',
            'react-router-dom',
            '@reduxjs/toolkit'
          ],
        }
      }
    }
  },
  // Reduce logging to errors only
  logLevel: 'error'
})