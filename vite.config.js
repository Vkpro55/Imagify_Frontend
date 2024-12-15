import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      fabric: 'fabric/dist/fabric.js', // Point directly to the UMD build
    },
  },
});
