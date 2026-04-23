import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/hebrew-cards/',  // ← CRITICAL: matches your repo name exactly
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});
