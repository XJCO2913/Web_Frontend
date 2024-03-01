import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc'; // 使用 @vitejs/plugin-react-swc
import checker from 'vite-plugin-checker';
import { fileURLToPath, URL } from 'url';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)), // 保留 '@' 别名指向 src 目录
      // 以下添加额外的别名
      '~': path.join(process.cwd(), 'node_modules'), // '~' 开头的路径指向 node_modules
      'src/': path.join(process.cwd(), 'src/'), // 'src/' 开头的路径直接指向 src 目录
    },
  },
  server: {
    port: 5173, // 服务器配置
  },
  preview: {
    port: 5173, // 预览配置
  },
});
