import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { sentryVitePlugin } from "@sentry/vite-plugin";
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
  },
    build: {
    sourcemap: true, // Source map generation must be turned on
  },
  plugins: [
    // Put the Sentry vite plugin after all other plugins
    sentryVitePlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: "no-7p",
      project: "javascript-react-xf",
    }),
  ],
});