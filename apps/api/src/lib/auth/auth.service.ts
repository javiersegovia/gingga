import type { DatabaseType } from '@gingga/db'
import type { ContextEnv } from '~/server'
import { Accounts, Sessions, Users, Verifications } from '@gingga/db/schema'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin } from 'better-auth/plugins'
import { getContext } from 'hono/context-storage'
import { apiEnv } from '~/api-env'
import { getDB } from '~/context'
import { sendEmail } from '~/lib/email'
import VerificationEmail from '~/lib/email/templates/verification-email'
import { PASSWORD_MAX, PASSWORD_MIN } from './auth.schema'

export type Session = ReturnType<typeof createServerAuth>['$Infer']['Session']
export type BetterAuth = ReturnType<typeof createServerAuth>

// Define the required environment variables structure
export interface AuthEnv {
  ADMIN_USER_IDS: string
  VITE_API_URL: string
  AUTH_SECRET: string
  VITE_SITE_URL: string
  VITE_SITE_DOMAIN: string
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
  GITHUB_CLIENT_ID: string
  GITHUB_CLIENT_SECRET: string
}

export function getAuth(): BetterAuth {
  const c = getContext<ContextEnv>()

  if (!c.var.auth) {
    // Pass the db instance and apiEnv to createServerAuth
    c.set('auth', createServerAuth(getDB(), apiEnv))
  }

  return c.var.auth
}

export function createServerAuth(
  db: DatabaseType,
  env: AuthEnv,
): ReturnType<typeof betterAuth> {
  const adminUserIds = env.ADMIN_USER_IDS.split(',')

  return betterAuth({
    baseURL: env.VITE_API_URL,
    secret: env.AUTH_SECRET,

    trustedOrigins: [env.VITE_SITE_URL],

    advanced: {
      useSecureCookies: true,
      crossSubDomainCookies: {
        enabled: true,
        domain: `.${env.VITE_SITE_DOMAIN}`,
      },
      defaultCookieAttributes: {
        secure: true,
        httpOnly: true,
        sameSite: 'Lax',
      },
    },
    database: drizzleAdapter(db, {
      provider: 'sqlite',
      // Use the explicitly imported tables for the schema
      schema: {
        user: Users,
        account: Accounts,
        session: Sessions,
        verification: Verifications,
      },
    }),

    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
      requireEmailVerification: true,
      minPasswordLength: PASSWORD_MIN,
      maxPasswordLength: PASSWORD_MAX,
      resetPasswordTokenExpiresIn: 10 * 60,
      async sendResetPassword({ url, user }) {
        sendEmail({
          to: user.email,
          subject: 'Reset your password',
          react: VerificationEmail({
            verifyUrl: url,
            title: 'Reset your password',
          }),
        })
      },
    },
    emailVerification: {
      sendOnSignUp: true,
      expiresIn: 10 * 60,
      autoSignInAfterVerification: true,
      sendVerificationEmail: async ({ user, url }) => {
        sendEmail({
          to: user.email,
          subject: 'Verify your email',
          react: VerificationEmail({
            verifyUrl: url,
            title: 'Verify your email',
          }),
        })
      },
    },
    user: {
      changeEmail: {
        enabled: true,
        sendChangeEmailVerification: async ({ newEmail, url }) => {
          sendEmail({
            to: newEmail,
            subject: 'Verify your new email',
            react: VerificationEmail({
              verifyUrl: url,
              title: 'Verify your new email',
            }),
          })
        },
      },
    },
    account: {
      // TODO: Manually Linking Accounts: https://www.better-auth.com/docs/concepts/users-accounts#manually-linking-accounts
      accountLinking: {
        enabled: true,
        trustedProviders: ['google', 'github'],
      },
    },
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
      github: {
        clientId: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
      },
    },
    plugins: [
      admin({
        adminUserIds,
      }),
    ],
  })
}
