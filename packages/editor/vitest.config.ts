import { resolve } from 'path';
import { defineProject } from 'vitest/config';

export default defineProject({
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
    css: false
  }
});
