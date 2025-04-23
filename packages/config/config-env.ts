import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export function configEnv() {
  return createEnv({
    server: {
      // SESSION
      AUTH_SECRET: z.string().min(16),

      // AUTH SOCIAL PROVIDERS
      GITHUB_CLIENT_ID: z.string().min(1),
      GITHUB_CLIENT_SECRET: z.string().min(1),
      GITHUB_REDIRECT_URI: z.string().url(),
      GOOGLE_CLIENT_ID: z.string().min(1),
      GOOGLE_CLIENT_SECRET: z.string().min(1),
      GOOGLE_REDIRECT_URI: z.string().url(),

      // EMAIL
      RESEND_API_KEY: z.string().startsWith('re_'),

      // AI SERVICES
      OPENAI_API_KEY: z.string().startsWith('sk-'),
      OPENROUTER_API_KEY: z.string().min(1),
      GATEWAY_BASE_OPENAI_URL: z.string().url(),
      GATEWAY_BASE_OPENROUTER_URL: z.string().url(),

      // UPSTASH REDIS
      KV_URL: z.string().url(),
      KV_REST_API_READ_ONLY_TOKEN: z.string().min(1),
      REDIS_URL: z.string().url(),
      KV_REST_API_TOKEN: z.string().min(1),
      KV_REST_API_URL: z.string().url(),

      // CI/CD & NODE
      GH_TOKEN: z.string().min(1),
      NODE_ENV: z.enum(['development', 'production', 'test']).optional(),

      // COMPOSIO
      COMPOSIO_API_KEY: z.string().min(1),
      COMPOSIO_GOOGLESHEETS_INTEGRATION_ID: z.string().min(1),
      COMPOSIO_GOOGLECALENDAR_INTEGRATION_ID: z.string().min(1),
      COMPOSIO_GMAIL_INTEGRATION_ID: z.string().min(1),
      COMPOSIO_GOOGLEDOCS_INTEGRATION_ID: z.string().min(1),

      // ADMIN
      ADMIN_USER_IDS: z.string().refine(id => id.split(',').length > 0, {
        message: 'ADMIN_USER_IDS must be a comma-separated list of user IDs',
      }),
    },
    shared: {
      VITE_SITE_URL: z.string().url(),
      VITE_SITE_DOMAIN: z.string().min(1), // Note: Only used in API currently
      VITE_API_URL: z.string().url(),
      VITE_ASSETS_URL: z.string().url(),
      VITE_RESEND_EMAIL_FROM: z.string().min(1),
      VITE_SUPPORT_EMAIL: z.string().min(1),
    },
    runtimeEnv: process.env,
  })
}
