import type { ContextEnv } from '~/server'
import { Accounts, Sessions, Users, Verifications } from '@gingga/db/schema'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin } from 'better-auth/plugins'
import { getContext } from 'hono/context-storage'
import { getDB } from '~/context'
import { apiEnv } from '~/env'
import { sendEmail } from '~/lib/email'
import VerificationEmail from '~/lib/email/templates/verification-email'
import { PASSWORD_MAX, PASSWORD_MIN } from './auth.schema'

export type Session = ReturnType<typeof createServerAuth>['$Infer']['Session']
export type BetterAuth = ReturnType<typeof createServerAuth>

export function getAuth() {
  const c = getContext<ContextEnv>()

  if (!c.var.auth) {
    c.set('auth', createServerAuth())
  }

  return c.var.auth
}

export function createServerAuth() {
  const db = getDB()
  const adminUserIds = apiEnv.ADMIN_USER_IDS.split(',')

  return betterAuth({
    baseURL: apiEnv.VITE_SITE_URL,
    secret: apiEnv.AUTH_SECRET,
    database: drizzleAdapter(db, {
      provider: 'sqlite',
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
        clientId: apiEnv.GOOGLE_CLIENT_ID,
        clientSecret: apiEnv.GOOGLE_CLIENT_SECRET,
      },
      github: {
        clientId: apiEnv.GITHUB_CLIENT_ID,
        clientSecret: apiEnv.GITHUB_CLIENT_SECRET,
      },
    },
    plugins: [
      admin({
        adminUserIds,
      }),
    ],
  })
}
