import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh
      fastRefresh: true,
    }),
  ],
  build: {
    outDir: 'public/build',
    manifest: true,
    rollupOptions: {
      input: {
        app: './src/client/app.tsx',
      },
      output: {
        entryFileNames: 'app.js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/client'),
    },
  },
  server: {
    port: 5173,
    hmr: {
      host: 'localhost',
      port: 5173,
      protocol: 'ws',
    },
    cors: true,
    // Allow requests from Express server
    origin: 'http://localhost:3000',
  },
});

