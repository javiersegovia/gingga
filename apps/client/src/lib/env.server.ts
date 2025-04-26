/* eslint-disable ts/no-explicit-any -- is fine here as we are validating the env */
import { configEnv } from '@gingga/config/config-env'
import { dbEnv } from '@gingga/db/db-env'
import { createEnv } from '@t3-oss/env-core'
import { env as cloudflareEnv } from 'cloudflare:workers'
import { z } from 'zod'

export const webEnv = createEnv({
  extends: [dbEnv(), configEnv()],
  shared: {
    VITE_SITE_URL: z.string().url(),
    VITE_API_URL: z.string().url(),
    VITE_ASSETS_URL: z.string().url(),
    VITE_RESEND_EMAIL_FROM: z.string().min(1),
    VITE_SUPPORT_EMAIL: z.string().min(1),
  },
  server: {
    // Web-specific server variables can go here if needed in the future
  },
  runtimeEnv: { ...cloudflareEnv as any },
  skipValidation: !!import.meta.env.SKIP_ENV_VALIDATION,
})

export const clientEnv = createEnv({
  shared: {
    VITE_SITE_URL: z.string().url(),
    VITE_API_URL: z.string().url(),
    VITE_ASSETS_URL: z.string().url(),
    VITE_RESEND_EMAIL_FROM: z.string().min(1),
    VITE_SUPPORT_EMAIL: z.string().min(1),
  },
  server: {},
  runtimeEnv: { ...cloudflareEnv as any },
  skipValidation: !!import.meta.env.SKIP_ENV_VALIDATION,
})

export type ClientEnv = typeof clientEnv
