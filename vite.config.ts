/**
 * CHANGES (SPA → MPA conversion):
 *   - Added rollupOptions.input with 4 HTML entries (home, portfolio, contact, admin)
 *   - Removed 'react-router-dom' from vendor-react manual chunk
 *
 * UNCHANGED:
 *   - All plugins (react, tailwindcss)
 *   - Build target, minify, cssCodeSplit, sourcemap settings
 *   - vendor-motion, vendor-icons, vendor-firebase chunks
 *   - esbuild drop config, define block, resolve alias, server config
 */
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const isProd = mode === 'production';

  return {
    plugins: [react(), tailwindcss()],
    build: {
      target: 'es2020',
      minify: 'esbuild',
      cssCodeSplit: true,
      sourcemap: false,
      reportCompressedSize: false,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          portfolio: path.resolve(__dirname, 'portfolio/index.html'),
          contact: path.resolve(__dirname, 'contact/index.html'),
          admin: path.resolve(__dirname, 'admin/index.html'),
        },
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-motion': ['motion/react'],
            'vendor-icons': ['lucide-react'],
            'vendor-firebase-core': ['firebase/app', 'firebase/auth'],
            'vendor-firebase-firestore': ['firebase/firestore'],
          },
        },
      },
    },
    esbuild: {
      drop: isProd ? ['console', 'debugger'] : [],
      legalComments: 'none',
    },
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: { '@': path.resolve(__dirname, '.') },
    },
    server: { hmr: false },
  };
});
