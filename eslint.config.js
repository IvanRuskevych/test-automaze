import tsParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import path from 'path';
import tseslint from 'typescript-eslint';
import { fileURLToPath } from 'url';

export default tseslint.config([
  {
    ignores: [
      '**/.idea/**',
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/generated/**',
      'packages/backend/codegen.ts',
    ],
  },

  {
    files: ['packages/**/*.{ts,tsx,js,jsx}'],

    plugins: {
      prettier: prettierPlugin,
      import: importPlugin,
      react: reactPlugin,
    },

    extends: [
      ...tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
      prettierConfig,
    ],

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: ['./packages/frontend/tsconfig.eslint.json', './packages/backend/tsconfig.eslint.json'],
        tsconfigRootDir: path.resolve(path.dirname(fileURLToPath(import.meta.url))),
        ecmaFeatures: { jsx: true },
      },

      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },

    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'no-unused-vars': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/ban-ts-comment': ['warn', { 'ts-ignore': 'allow-with-description' }],
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',

      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-useless-fragment': 'warn',
      'react/self-closing-comp': 'warn',
      'react/jsx-curly-brace-presence': ['warn', { props: 'never', children: 'never' }],

      'import/order': ['warn', { groups: [['builtin', 'external', 'internal']], 'newlines-between': 'always' }],
      'import/no-unresolved': 'error',
      'import/no-extraneous-dependencies': 'error',

      quotes: ['error', 'single', { avoidEscape: true }],
      'max-len': [
        'warn',
        {
          code: 120,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
      'prettier/prettier': ['warn', { semi: true, singleQuote: true, trailingComma: 'all', endOfLine: 'auto' }],
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'no-irregular-whitespace': 'error',
      'no-mixed-spaces-and-tabs': 'error',
    },

    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: ['tsconfig.eslint.json'],
        },
      },
    },
  },
]);
