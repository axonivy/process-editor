import { resolve } from 'path';
import { esmExternalRequirePlugin } from 'vite';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [esmExternalRequirePlugin({ external: ['react', 'react-dom'] }), dts({ tsconfigPath: './tsconfig.build.json' })],
  build: {
    outDir: 'lib',
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      fileName: 'process-editor',
      formats: ['es']
    },
    rolldownOptions: {
      external: [
        '@axonivy/ui-components',
        '@axonivy/ui-icons',
        '@eclipse-glsp/client',
        '@tanstack/react-query',
        '@tanstack/react-query-devtools',
        'dompurify',
        'i18next',
        'marked',
        'react-i18next',
        'react-error-boundary',
        'react/jsx-runtime'
      ]
    }
  },
  oxc: {
    jsx: {
      development: false
    }
  },
  test: {
    name: 'editor',
    include: ['src/**/*.test.ts?(x)'],
    alias: {
      '@axonivy/process-editor-protocol': resolve(__dirname, '../protocol/src')
    },
    environment: 'happy-dom',
    setupFiles: ['src/test-utils/setupTests.ts'],
    css: false,
    reporters: process.env.CI ? ['default', 'junit'] : ['default'],
    outputFile: 'report.xml'
  }
});
