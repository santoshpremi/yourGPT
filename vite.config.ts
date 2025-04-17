import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    optimizeDeps: {
    exclude: ['lottie-web']
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8003",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/trpc": {
        target: "http://localhost:8003",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/trpc/, ""),
      },
    },
  },
  build: {
    assetsInlineLimit: 4096, // 4KB threshold
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
       // chunkFileNames: 'chunks/[name]-[hash].js',
       // entryFileNames: 'entries/[name]-[hash].js'
      },
     // external: ['lottie-web'],

    }
  },
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
    }),
    tsconfigPaths({
      projects: ["tsconfig.json"],
    }),
  ],
});