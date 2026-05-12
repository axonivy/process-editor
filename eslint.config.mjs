import tseslint from 'typescript-eslint';
import eslint from '@eslint/js';
import playwright from 'eslint-plugin-playwright';
import { defineConfig } from 'eslint/config';

export default defineConfig(
  // Base eslint recommended config
  eslint.configs.recommended,

  // TypeScript recommended configs
  ...tseslint.configs.strict,
  {
    name: 'typescript-eslint',
    languageOptions: {
      parserOptions: {
        project: true, // Uses tsconfig.json from current directory
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-invalid-void-type': 'off'
    }
  },

  // Playwright recommended configs
  {
    name: 'eslint-plugin-playwright',
    files: ['**/standalone/webtests/**', '**/*.spec.{js,mjs,cjs,ts,jsx,tsx}'],
    ...playwright.configs['flat/recommended'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'playwright/expect-expect': 'off',
      'playwright/no-skipped-test': [
        'warn',
        {
          allowConditional: true
        }
      ],
      'playwright/no-conditional-in-test': 'off'
    }
  },

  // Project-specific overrides and custom rules
  {
    name: 'ingored-files',
    ignores: [
      '**/node_modules/**',
      '**/eslint.config.*',
      '**/vite*.config.*',
      '**/vitest.workspace.ts',
      '**/playwright.config.*',
      '**/playwright-report/**',
      '**/webpack.config.*',
      '**/orval.config.*',
      '**/*.d.ts',
      '**/lib/*',
      '**/build/*',
      '**/dist/*',
      '**/public/*',
      '**/schemaCodegen.cjs'
    ]
  }
);
