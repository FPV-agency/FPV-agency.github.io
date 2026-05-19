import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Загружаем переменные окружения (например, твой GEMINI_API_KEY)
  const env = loadEnv(mode, '.', '');

  return {
    // Используем './' для максимальной совместимости с GitHub Pages
    base: './', 
    
    plugins: [
      react(),
      tailwindcss(),
    ],
    
    define: {
      // Прокидываем ключ API в клиентскую часть
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    
    resolve: {
      alias: {
        // Настраиваем алиас @ для удобных импортов
        '@': path.resolve(__dirname, './src'),
      },
    },
    
    server: {
      // Отключаем HMR, если это требуется для стабильности в AI Studio
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    
    build: {
      // Убеждаемся, что сборка идет в папку dist
      outDir: 'dist',
      // Очищаем папку перед каждой сборкой
      emptyOutDir: true,
      // Выключаем сорсмапы для фронтенда, чтобы убрать eval
      sourcemap: false,
    }
  };
});