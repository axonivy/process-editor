import { defineConfig } from 'vite';
import { resolve } from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig(() => ({
  plugins: [tsconfigPaths(), nodePolyfills()],
  build: {
    outDir: 'build',
    chunkSizeWarningLimit: 5000,
    rollupOptions: {
      input: { diagram: './diagram.html' }
    }
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
      path: 'path-browserify',
      '@axonivy/process-editor': resolve(__dirname, '../../editor/src')
    }
  }
}));
