import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    },
    cssCodeSplit: false
  },
  server: {
    port: 5173,
    open: true
  }
});
