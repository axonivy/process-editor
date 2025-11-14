import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { monacoConfigPlugin } from '../monaco-config-plugin';

export default defineConfig(() => ({
  plugins: [react(), tsconfigPaths(), monacoConfigPlugin()],
  build: {
    outDir: 'build',
    chunkSizeWarningLimit: 5000,
    rollupOptions: {
      input: {
        index: './index.html',
        mock: './mock.html'
      }
    }
  },
  server: {
    port: 3003,
    sourcemapIgnoreList(sourcePath, sourcemapPath) {
      return sourcePath.includes('node_modules') && !sourcePath.includes('@eclipse-glsp') && !sourcePath.includes('@axonivy');
    }
  },
  preview: { port: 4003 },
  resolve: {
    alias: {
      '@axonivy/process-editor-inscription-core': resolve(__dirname, '../../packages/inscription-core/src'),
      '@axonivy/process-editor-inscription-view': resolve(__dirname, '../../packages/inscription-view/src'),
      '@axonivy/process-editor-inscription-protocol': resolve(__dirname, '../../packages/inscription-protocol/src')
    }
  },
  base: './',
  worker: {
    format: 'es'
  }
}));
