import antfu from '@antfu/eslint-config'

export default antfu(
  {
    formatters: true,
    react: true,
    typescript: {
      parserOptions: {
        project: ['./tsconfig.json', './apps/client/tsconfig.json', './packages/ui/tsconfig.json', './packages/db/tsconfig.json'],
      },
    },
    pnpm: true,
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
      'no-empty-pattern': 'off',
      'ts/no-floating-promises': 'error',
    },
  },
  // Ignores
  {
    ignores: [
      // Specific client ignores
      'apps/client/build/**/*',
      'apps/client/.turbo/**/*',
      'apps/client/.wrangler/**/*',
      'apps/client/.react-router/**/*',
      'apps/client/node_modules/**/*',
      // Global ignores (keep existing ones)
      '**/routeTree.gen.ts',
      '**/release/**/*',
      '**/.vinxi/**/*',
      '**/.types/**/*',
      '**/migrations/meta/*.json',
      'node_modules/**/*', // Keep this global one as well
      'dist/**/*',
      '.turbo/**/*', // Keep this global one as well
      '.wrangler/**/*', // Keep this global one as well
      '.vscode/**/*',
      '.husky/**/*',
      'build/**/*', // Keep this global one as well
      '**/.react-router/**/*', // Keep this global one as well
      '**/worker-configuration.d.ts',
    ],
  },
)
