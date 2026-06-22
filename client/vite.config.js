import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Vite configuration for SessionPulse client.
 *
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
  plugins: [react()],

  server: {
    port: 3000,
    // Proxy API calls to the Express backend in development.
    // This avoids CORS issues when running client and server separately.
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },

  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
