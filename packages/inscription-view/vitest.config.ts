import { defineProject } from 'vitest/config';
import { resolve } from 'path';

export default defineProject({
  test: {
    name: 'inscription-view',
    include: ['src/**/*.test.ts?(x)'],
    alias: {
      '@axonivy/process-editor-inscription-protocol': resolve(__dirname, '../inscription-protocol/src'),
      'test-utils': resolve(__dirname, 'src/test-utils/test-utils.tsx')
    },
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-utils/setupTests.tsx'],
    css: false
  }
});
