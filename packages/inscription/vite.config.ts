import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react(), dts({ tsconfigPath: './tsconfig.json' })],
  build: {
    outDir: 'lib',
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      fileName: 'index',
      formats: ['es']
    },
    rolldownOptions: {
      external: [
        /^@axonivy\/process-editor/,
        '@axonivy/ui-components',
        '@axonivy/ui-icons',
        '@eclipse-glsp/client',
        '@tanstack/react-query',
        '@tanstack/react-query-devtools',
        'i18next',
        'react-i18next',
        'react',
        'react-error-boundary',
        'react/jsx-runtime',
        'react-dom'
      ]
    }
  }
});
