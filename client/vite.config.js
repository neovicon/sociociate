import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    minify: 'terser',
    sourcemap: false,
    // Ensure proper chunking for better performance
    chunkSizeWarningLimit: 1000,
  },
  base: '/',
  // Ensure assets are properly referenced with absolute paths
  assetsInclude: ['**/*.{png,svg,jpg,jpeg,gif,webp}'],
})
