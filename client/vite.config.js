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
    // Ensure assets are properly referenced
    assetsDir: 'assets',
    // Minify for production
    minify: 'terser',
    // Ensure proper sourcemap for debugging
    sourcemap: false,
  },
  base: '/',
})
