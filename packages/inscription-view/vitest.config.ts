import { resolve } from 'path';
import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    name: 'inscription-view',
    include: ['src/**/*.test.ts?(x)'],
    alias: {
      '@axonivy/process-editor-inscription-protocol': resolve(import.meta.dirname, '../inscription-protocol/src'),
      '@axonivy/process-editor-inscription-core': resolve(import.meta.dirname, '../inscription-core/src'),
      'test-utils': resolve(import.meta.dirname, 'src/test-utils/test-utils.tsx')
    },
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-utils/setupTests.tsx'],
    css: false
  }
});
