import { defineConfig } from 'vite';
import { resolve } from 'path'
import solidPlugin from 'vite-plugin-solid';
import devtools from 'solid-devtools/vite';

export default defineConfig({
  envPrefix: ['VITE_'],
  resolve: {
    alias: {
      '@interfaces': resolve(__dirname, './src/static/types'),
      '@components': resolve(__dirname, './src/components'),
      '@containers': resolve(__dirname, './src/containers'),
      '@routes': resolve(__dirname, './src/routes'),
      '@pages': resolve(__dirname, './src/pages'),
      '@styles': resolve(__dirname, './src/styles'),
      '@config': resolve(__dirname, './src/config'),
      '@src': resolve(__dirname, './src'),
      '@assets': resolve(__dirname, './src/assets'),
      '@hooks': resolve(__dirname, './src/utils/hooks'),
      '@store': resolve(__dirname, './src/store'),
      '@static': resolve(__dirname, './src/static'),
    },
  },
  plugins: [solidPlugin(), devtools()],
  server: {
    port: 3000,
    host: true,
    strictPort: true,
  },
  build: {
    target: 'esnext',
  },
});
