import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { monacoWorkaroundPlugin } from '../monaco-workaround-plugin';

export default defineConfig(() => ({
  plugins: [react(), tsconfigPaths(), monacoWorkaroundPlugin()],
  build: {
    outDir: 'build',
    chunkSizeWarningLimit: 5000,
    rollupOptions: {
      input: {
        index: './index.html',
        mock: './mock.html'
      },
      output: {
        manualChunks(id: string) {
          if (id.includes('monaco-languageclient') || id.includes('vscode')) {
            return 'monaco-chunk';
          }
        }
      }
    }
  },
  server: { port: 3003 },
  preview: { port: 4003 },
  resolve: {
    alias: {
      '@axonivy/process-editor-inscription-core': resolve(__dirname, '../../packages/inscription-core/src'),
      '@axonivy/process-editor-inscription-view': resolve(__dirname, '../../packages/inscription-view/src'),
      '@axonivy/process-editor-inscription-protocol': resolve(__dirname, '../../packages/inscription-protocol/src')
    }
  },
  base: './',
  optimizeDeps: {
    needsInterop: [
      'monaco-editor/esm/vs/editor/standalone/browser/accessibilityHelp/accessibilityHelp.js',
      'monaco-editor/esm/vs/editor/standalone/browser/inspectTokens/inspectTokens.js'
    ]
  }
}));
