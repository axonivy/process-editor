import { defineConfig } from 'eslint/config';
import config from '@axonivy/eslint-config';

export default defineConfig(
  ...config.base,
  // TypeScript recommended configs
  {
    name: 'typescript-eslint',
    languageOptions: {
      parserOptions: {
        project: true, // Uses tsconfig.json from current directory
        tsconfigRootDir: import.meta.dirname
      }
    }
  },
  // Project specific configs
  {
    name: 'general',
    rules: {
      '@typescript-eslint/no-namespace': 'off'
    }
  },
  {
    name: 'packages/editor',
    rules: {
      'react/no-unknown-property': 'off'
    }
  }
);
