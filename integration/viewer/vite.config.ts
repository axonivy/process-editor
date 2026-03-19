import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig(() => ({
  plugins: [],
  build: {
    outDir: 'build',
    chunkSizeWarningLimit: 5000
  },
  oxc: {
    decorator: {
      legacy: true,
      emitDecoratorMetadata: true
    }
  },
  css: {
    lightningcss: {
      errorRecovery: true
    }
  },
  server: {
    port: 3001,
    open: false,
    sourcemapIgnoreList(sourcePath, sourcemapPath) {
      return sourcePath.includes('node_modules') && !sourcePath.includes('@eclipse-glsp') && !sourcePath.includes('@axonivy');
    }
  },
  preview: {
    port: 4001
  },
  resolve: {
    alias: {
      '@axonivy/process-editor': resolve(__dirname, '../../packages/editor/src'),
      '@axonivy/process-editor-protocol': resolve(__dirname, '../../packages/protocol/src')
    }
  },
  base: './',
  test: {
    name: 'viewer',
    include: ['src/**/*.test.ts?(x)'],
    globals: true,
    css: false
  }
}));
