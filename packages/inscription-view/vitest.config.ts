import { resolve } from 'path';
import { defineProject } from 'vitest/config';

export default defineProject({
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
