import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import checker from 'vite-plugin-checker';
import { fileURLToPath, URL } from 'url';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),

  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~': path.join(process.cwd(), 'node_modules'),
      'src/': path.join(process.cwd(), 'src/'),
    },
  },
  server: {
    port: 5173,
  },
  preview: {
    port: 5173,
  },
});
