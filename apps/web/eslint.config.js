import eslint from '@eslint/js'
import tanstackQueryPlugin from '@tanstack/eslint-plugin-query'
import tanstackRouterPlugin from '@tanstack/eslint-plugin-router'
import prettierConfig from 'eslint-config-prettier'
import prettierRecommended from 'eslint-plugin-prettier/recommended'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'
import reactCompilerPlugin from 'eslint-plugin-react-compiler'

export default [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  {
    ignores: [
      'dist',
      '.vinxi',
      '.wrangler',
      '.vercel',
      '.netlify',
      '.output',
      'build/',
      'node_modules/',
      'pnpm-lock.yaml',
      '*.gen.ts',
      'drizzle/',
      'dist/',
      'public/',
      'worker-configuration.d.ts',
    ],
  },

  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  prettierRecommended,
  ...tanstackQueryPlugin.configs['flat/recommended'],
  ...tanstackRouterPlugin.configs['flat/recommended'],

  reactPlugin.configs.flat?.recommended,
  reactPlugin.configs.flat?.['jsx-runtime'],

  {
    plugins: {
      'react-hooks': reactHooksPlugin,
      import: importPlugin,
      'react-compiler': reactCompilerPlugin,
    },
  },

  {
    settings: {
      'import/resolver': {
        typescript: true,
      },
    },
  },

  {
    rules: {
      ...reactHooksPlugin.configs.recommended.rules,
      'react-compiler/react-compiler': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'import/consistent-type-specifier-style': 'error', // enforces consistent type specifier style for named imports
      'import/first': 'error', // disallow non-import statements appearing before import statements
      'import/newline-after-import': 'error', // Require a newline after the last import/require in a group
      'import/no-absolute-path': 'error', // Forbid import of modules using absolute paths
      'import/no-amd': 'error', // disallow AMD require/define
      'import/no-duplicates': 'error', // disallow imports from duplicate paths
      'react/prop-types': ['error'],
      'react/no-children-prop': 'off',

      'max-params': ['error', 2],
      // Forbid the use of extraneous packages
      // 'import/no-extraneous-dependencies': [
      //   'error',
      //   {
      //     devDependencies: true,
      //     peerDependencies: true,
      //     bundledDependencies: false,
      //     optionalDependencies: true,
      //     packageDir: './',
      //   },
      // ],
      'import/no-mutable-exports': 'error', // Forbid mutable exports
      'import/no-named-default': 'error', // Prevent importing the default as if it were named
      'import/no-named-export': 'off', // we want everything to be a named export
      'import/no-self-import': 'error', // Forbid a module from importing itself
      '@typescript-eslint/no-empty-object-type': 'off',

      // Add rule for unused variables, allowing underscore-prefixed args
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
]
