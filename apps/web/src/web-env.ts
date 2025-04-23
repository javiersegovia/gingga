import { configEnv } from '@gingga/config/config-env'
import { dbEnv } from '@gingga/db/db-env'
import { createEnv } from '@t3-oss/env-core'
import { config } from 'dotenv'
import { z } from 'zod'

config()

export const webEnv = createEnv({
  extends: [dbEnv(), configEnv()],
  clientPrefix: 'VITE_' as const,
  client: {
    // These are already defined in configEnv.shared,
    // but need to be explicitly listed here for the client build
    VITE_SITE_URL: z.string().url(),
    VITE_API_URL: z.string().url(),
    VITE_ASSETS_URL: z.string().url(),
    VITE_RESEND_EMAIL_FROM: z.string().min(1),
    VITE_SUPPORT_EMAIL: z.string().min(1),
  },
  server: {
    // Web-specific server variables can go here if needed in the future
  },
  runtimeEnv: process.env,
  skipValidation: !!import.meta.env.SKIP_ENV_VALIDATION,
})

// Helper functions (optional, can be removed if not needed)
export function getServerEnv() {
  return webEnv
}

export function getClientEnv() {
  return webEnv
}

export async function parseEnv() {
  // Validation happens automatically in createEnv
  // eslint-disable-next-line no-console -- its fine.
  console.log(
    `Environment variables parsed successfully (${Object.keys(webEnv).length} variables)`,
  )
}
