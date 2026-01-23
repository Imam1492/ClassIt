import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // 1. Main Home Page (Root)
        main: resolve(__dirname, 'index.html'),

        // 2. The New Folders (Clean URLs)
        livogue: resolve(__dirname, 'Livogue/index.html'),
        wellfit: resolve(__dirname, 'wellfit/index.html'),
        tech: resolve(__dirname, 'tech/index.html'),
        about: resolve(__dirname, 'about/index.html'),
        contact: resolve(__dirname, 'contact/index.html'),

        // 3. The 404 Page (Root)
        notFound: resolve(__dirname, '404.html'),
      },
    },
  },
});