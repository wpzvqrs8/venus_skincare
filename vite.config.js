import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        machine1: resolve(__dirname, 'machine1.html'),
        machine2: resolve(__dirname, 'machine2.html')
      }
    }
  },
  publicDir: 'public'
});
