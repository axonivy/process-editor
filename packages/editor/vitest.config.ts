import { defineProject } from 'vitest/config';
import { resolve } from 'path';

export default defineProject({
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
