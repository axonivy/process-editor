import { defineConfig } from 'vite';
import { resolve } from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig(() => ({
  plugins: [tsconfigPaths(), nodePolyfills()],
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
    chunkSizeWarningLimit: 5000
  },
  server: {
    port: 3000,
    open: false,
    sourcemapIgnoreList(sourcePath, sourcemapPath) {
      return sourcePath.includes('node_modules') && !sourcePath.includes('@eclipse-glsp') && !sourcePath.includes('@axonivy');
    },
    proxy: {
      // needed for custom images on screenshots
      '/glsp-test-project': { target: process.env.BASE_URL ?? 'http://localhost:8081/' }
    }
  },
  preview: {
    port: 4000
  },
  resolve: {
    alias: {
      '@axonivy/process-editor': resolve(__dirname, '../../editor/src')
    }
  },
  base: './'
}));
