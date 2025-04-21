import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  react: true,

  rules: {
    'node/prefer-global/process': 'off',
    'ts/no-explicit-any': 'error',
    'no-console': 'warn',
    'react-hooks/exhaustive-deps': 'off',
  },

  ignores: [
    '**/routeTree.gen.ts',
    '**/release/**/*',
    '**/.vinxi/**/*',
    '**/.types/**/*',
    '**/migrations/meta/*.json',
  ],
})
