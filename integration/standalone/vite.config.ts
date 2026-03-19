import monacoConfigPlugin from '@axonivy/monaco-vite-plugin';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => ({
  plugins: [monacoConfigPlugin()],
  oxc: {
    decorator: {
      legacy: true,
      emitDecoratorMetadata: true
    }
  },
  build: {
    outDir: 'build',
    chunkSizeWarningLimit: 5000
  },
  css: {
    lightningcss: {
      errorRecovery: true
    }
  },
  server: {
    port: 3000,
    open: false,
    sourcemapIgnoreList(sourcePath, sourcemapPath) {
      return sourcePath.includes('node_modules') && !sourcePath.includes('@eclipse-glsp') && !sourcePath.includes('@axonivy');
    },
    proxy: {
      '/process-test-project': { target: process.env.BASE_URL ?? 'http://localhost:8080/' },
      '/dev-workflow-ui': { target: process.env.BASE_URL ?? 'http://localhost:8080/' },
      '/~Developer-process-test-project': { target: process.env.BASE_URL ?? 'http://localhost:8080/' }
    }
  },
  preview: {
    port: 4000
  },
  resolve: {
    alias: {
      '@axonivy/process-editor': resolve(__dirname, '../../packages/editor/src'),
      '@axonivy/process-editor-inscription': resolve(__dirname, '../../packages/inscription/src'),
      '@axonivy/process-editor-inscription-view': resolve(__dirname, '../../packages/inscription-view/src'),
      '@axonivy/process-editor-inscription-core': resolve(__dirname, '../../packages/inscription-core/src'),
      '@axonivy/process-editor-inscription-protocol': resolve(__dirname, '../../packages/inscription-protocol/src'),
      '@axonivy/process-editor-protocol': resolve(__dirname, '../../packages/protocol/src')
    }
  },
  base: './',
  worker: {
    format: 'es'
  }
}));
