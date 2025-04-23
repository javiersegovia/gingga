import { defineConfig } from 'taze'

export default defineConfig({
  // ignore packages from bumping
  exclude: [
    'webpack',
  ],
  // fetch latest package info from registry without cache
  force: true,
  // write to package.json
  write: true,
  // run `npm install` or `yarn install` right after bumping
  install: true,
  // ignore paths for looking for package.json in monorepo
  ignorePaths: [
    '**/node_modules/**',
    '**/test/**',
    '**/dist/**',
    '**/build/**',
    '**/public/**',
    '**/drizzle/**',
    '**/.turbo/**',
    '**/.vercel/**',
    '**/.output/**',
    '**/.vinxi/**',
    '**/.wrangler/**',
  ],
  // ignore package.json that in other workspaces (with their own .git,pnpm-workspace.yaml,etc.)
  ignoreOtherWorkspaces: true,
  // override with different bumping mode for each package
  packageMode: {
    typescript: 'minor',
    unocss: 'ignore',
  },
  // disable checking for "overrides" package.json field
  depFields: {
    overrides: false,
  },
})
