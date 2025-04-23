import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: [
      'next/core-web-vitals',
      'next/typescript',
      'prettier',
      'plugin:tailwindcss/recommended',
      'next',
    ],
    plugins: ['prettier', 'tailwindcss'],
    rules: {
      'prettier/prettier': 'error',
      '@next/next/no-img-element': 'off',
      'tailwindcss/no-custom-classname': 'off',
    },
    overrides: [
      {
        files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
      },
      {
        files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
        rules: {
          '@typescript-eslint/no-explicit-any': 'off',
          '@typescript-eslint/no-unused-vars': 'off',
          'react-hooks/exhaustive-deps': 'off',
        },
      },
      {
        files: ['cypress.config.ts', 'cypress/**/*.ts', 'cypress/**/*.tsx'],
        parserOptions: {
          project: './cypress/tsconfig.spec.json', // Use Cypress-specific tsconfig
          tsconfigRootDir: __dirname,
        },
      },
    ],
    parserOptions: {
      project: './tsconfig.json',
      tsconfigRootDir: '.',
    },
  }),
  {
    ignores: [
      'node_modules',
      '.next',
      '.husky',
      'coverage',
      '.prettierignore',
      '.stylelintignore',
      '.eslintignore',
      'stories',
      'storybook-static',
      '*.log',
      'playwright-report',
      '.nyc_output',
      'test-results',
      'junit.xml',
      'docs',
      'eslint.config.mjs',
      '*.db',
      'components/ui',
    ],
  },
];

export default eslintConfig;
