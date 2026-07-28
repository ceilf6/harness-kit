import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'docs/**', '.gitnexus/**'],
  },
  js.configs.recommended,
  {
    files: ['src/**/*.mjs', 'scripts/**/*.mjs', 'bin/**/*.mjs'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'preserve-caught-error': 'off',
    },
  },
];
