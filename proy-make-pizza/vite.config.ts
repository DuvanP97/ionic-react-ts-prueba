import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '',
  plugins: [react()],
  server: {
    proxy: {
      '/heroapi': {
        target: 'https://www.superheroapi.com',
        changeOrigin: true,
        rewrite: p => p.replace(/^\/heroapi/, ''),
      },
    },
  },
});