import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from '@tanstack/react-start/config'
import { config } from 'dotenv'
import { denyImports, envOnlyMacros } from 'vite-env-only'
import tsconfigPaths from 'vite-tsconfig-paths'
import { parseEnv } from './src/server/env'

config()
await parseEnv()

export default defineConfig({
  server: {
    preset: 'vercel',
    rollupConfig: {
      external: ['node:async_hooks'],
    },
  },

  // https://react.dev/learn/react-compiler
  react: {
    babel: {
      plugins: [
        [
          'babel-plugin-react-compiler',
          {
            target: '19',
          },
        ],
      ],
    },
  },

  tsr: {
    routeFileIgnorePrefix: '_components',
    quoteStyle: 'single',
    semicolons: false,
    appDirectory: 'src',
  },

  vite: {
    define: await defineVitePublicEnv(),
    plugins: [
      tsconfigPaths({
        projects: ['./tsconfig.json'],
      }),
      tailwindcss(),
      envOnlyMacros(),
      denyImports({
        client: { files: ['**/server/*', '**/*.server.*'] },
      }),
    ],
  },
})

async function defineVitePublicEnv() {
  const env = process.env

  const viteDefine = Object.fromEntries(
    Object.entries(env)
      .filter(([key]) => key.startsWith('VITE_'))
      .map(([key, value]) => [`import.meta.env.${key}`, `"${value}"`]),
  )

  return viteDefine
}

declare global {
  interface ImportMetaEnv {
    VITE_ASSETS_URL: string
  }
}
