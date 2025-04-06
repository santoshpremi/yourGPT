import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8003', // Point to backend port
        changeOrigin: true,
        ws: true,
        secure: false,
      },
      '/trpc': {
        target: 'http://localhost:8003', // Remove separate trpc proxy
        changeOrigin: true,
        secure: false
      }
    }
  }
});