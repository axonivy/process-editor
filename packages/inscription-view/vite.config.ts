import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react(), dts({ tsconfigPath: './tsconfig.production.json' })],
  build: {
    outDir: 'lib',
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      fileName: 'inscription-view',
      formats: ['es']
    },
    rolldownOptions: {
      external: [
        '@axonivy/ui-components',
        '@axonivy/ui-icons',
        '@hediet/json-rpc',
        '@monaco-editor/react',
        '@tanstack/react-query',
        '@tanstack/react-query-devtools',
        'i18next',
        /^monaco-editor/,
        'react-i18next',
        'react',
        'react-error-boundary',
        'react/jsx-runtime',
        'react-dom'
      ]
    }
  },
  test: {
    name: 'inscription-view',
    include: ['src/**/*.test.ts?(x)'],
    alias: {
      '@axonivy/process-editor-inscription-protocol': resolve(__dirname, '../inscription-protocol/src'),
      '@axonivy/process-editor-inscription-core': resolve(__dirname, '../inscription-core/src'),
      'test-utils': resolve(__dirname, 'src/test-utils/test-utils.tsx')
    },
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-utils/setupTests.tsx'],
    css: false
  }
});
