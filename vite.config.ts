import { defineConfig } from 'vite';
import { resolve } from 'path'
import solidPlugin from 'vite-plugin-solid';
import devtools from 'solid-devtools/vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => ({
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
  plugins: [
    solidPlugin(),
    devtools(),
    // Generate bundle visualization in stats.html
    mode === 'analyze' && visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  server: {
    port: 3000,
    host: true,
    strictPort: true,
  },
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
    minify: 'terser',
    cssCodeSplit: true,
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Create separate chunks for large dependencies
          if (id.includes('node_modules')) {
            if (id.includes('solid-js')) {
              return 'vendor-solid'
            }
            if (id.includes('lucide')) {
              return 'vendor-icons'
            }
            if (id.includes('solid-form-handler') || id.includes('zod')) {
              return 'vendor-form'
            }
            return 'vendor' // All other dependencies
          }
        },
      },
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
}));
