import { resolve } from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { monacoWorkaroundPlugin } from '../monaco-workaround-plugin';

export default defineConfig(() => ({
  plugins: [tsconfigPaths(), monacoWorkaroundPlugin()],
  esbuild: {
    target: 'esnext',
    tsconfigRaw: {
      compilerOptions: {
        experimentalDecorators: true,
        emitDecoratorMetadata: true
      }
    }
  },
  build: {
    outDir: 'build',
    chunkSizeWarningLimit: 5000,
    rollupOptions: {
      output: {
        manualChunks: id => {
          if (id.includes('monaco-languageclient') || id.includes('vscode')) {
            return 'monaco-chunk';
          }
        }
      }
    }
  },
  server: {
    port: 3000,
    open: false,
    sourcemapIgnoreList(sourcePath, sourcemapPath) {
      return sourcePath.includes('node_modules') && !sourcePath.includes('@eclipse-glsp') && !sourcePath.includes('@axonivy');
    },
    proxy: {
      // needed for custom images on screenshots
      '/process-test-project': { target: process.env.BASE_URL ?? 'http://localhost:8081/' }
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
  optimizeDeps: {
    needsInterop: [
      'monaco-editor/esm/vs/editor/standalone/browser/accessibilityHelp/accessibilityHelp.js',
      'monaco-editor/esm/vs/editor/standalone/browser/inspectTokens/inspectTokens.js'
    ],
    exclude: ['vscode']
  }
}));
