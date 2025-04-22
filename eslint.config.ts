import antfu from '@antfu/eslint-config'

export default antfu(
  {
    formatters: true,
    react: true,
    typescript: true,
  },

  {
    rules: {
      'node/prefer-global/process': 'off',
      'ts/no-explicit-any': 'error',
      'no-console': 'warn',
      'react-hooks/exhaustive-deps': 'off',
      'react-refresh/only-export-components': 'off',
      'unused-imports/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
      'style/multiline-ternary': 'off',
    },
  },
  // Ignores
  {
    ignores: [
      '**/routeTree.gen.ts',
      '**/release/**/*',
      '**/.vinxi/**/*',
      '**/.types/**/*',
      '**/migrations/meta/*.json',
      'node_modules/**/*',
      'dist/**/*',
      '.turbo/**/*',
      '.wrangler/**/*',
      '.vscode/**/*',
      '.husky/**/*',
    ],
  },
)
