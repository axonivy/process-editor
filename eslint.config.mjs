import config from '@axonivy/eslint-config';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  ...config.base,
  ...config.i18n,
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
    name: 'ingored-files',
    ignores: ['./integration/monaco-workaround-plugin.ts']
  },
  {
    name: 'general',
    rules: {
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: 'svg' // Ignore unused svg imports as needed for snabbdom VNodes to work
        }
      ]
    }
  },
  {
    name: 'packages/editor',
    rules: {
      'react/no-unknown-property': 'off'
    }
  }
);
