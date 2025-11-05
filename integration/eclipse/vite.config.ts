import { resolve } from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { monacoConfigPlugin } from '../monaco-config-plugin';
import { monacoWorkaroundPlugin } from '../monaco-workaround-plugin';

export default defineConfig(() => ({
  plugins: [tsconfigPaths(), monacoWorkaroundPlugin(), monacoConfigPlugin()],
  build: {
    outDir: 'build',
    chunkSizeWarningLimit: 5000
  },
  esbuild: {
    target: 'esnext',
    tsconfigRaw: {
      compilerOptions: {
        experimentalDecorators: true,
        emitDecoratorMetadata: true
      }
    }
  },
  server: {
    port: 3002,
    open: false,
    sourcemapIgnoreList(sourcePath, sourcemapPath) {
      return sourcePath.includes('node_modules') && !sourcePath.includes('@eclipse-glsp') && !sourcePath.includes('@axonivy');
    }
  },
  preview: {
    port: 4002
  },
  base: './',
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
  worker: {
    format: 'es'
  }
}));
