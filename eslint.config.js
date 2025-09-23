import js from '@eslint/js'
import globals from 'globals'
import html from 'eslint-plugin-html'

export default [
  { ignores: ['dist', 'node_modules'] },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.browser,
        ...globals.es2022,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': ['error', { 
        varsIgnorePattern: '^[A-Z_]',
        argsIgnorePattern: '^_'
      }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': 'error',
      'curly': 'error',
    },
  },
  {
    files: ['**/*.html'],
    plugins: {
      html,
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': 'off', // HTML files may have inline scripts with apparent unused vars
      'no-undef': 'off', // HTML files may reference global variables
    },
  },
]
