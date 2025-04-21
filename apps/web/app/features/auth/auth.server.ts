import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { PASSWORD_MAX, PASSWORD_MIN } from './auth.schema'
import { getDatabase } from '~/middleware/setup-context.server'
import { sendEmail } from '~/server/email/email'
import VerificationEmail from '~/server/email/templates/verification-email'
import { getServerEnv } from '~/server/env'
import { Accounts, Sessions, Users, Verifications } from '@gingga/db/schema'
import { admin } from 'better-auth/plugins'

export type Session = ReturnType<typeof createServerAuth>['$Infer']['Session']

export function createServerAuth() {
  const db = getDatabase()
  const env = getServerEnv()

  return betterAuth({
    baseURL: import.meta.env.VITE_SITE_URL,
    secret: env.AUTH_SECRET,
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
          react: VerificationEmail({ verifyUrl: url, title: 'Reset your password' }),
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
          react: VerificationEmail({ verifyUrl: url, title: 'Verify your email' }),
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
            react: VerificationEmail({ verifyUrl: url, title: 'Verify your new email' }),
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
        // We could fetch the admin user ids from the database
        // but for now we will just hardcode them
        adminUserIds: [
          '9c3273d5-3ad1-46aa-97b3-263520392e56', // jsegoviadev@gmail.com - PROD
          'c4674804-5b38-45ed-854e-8b2fed9e8c9e', // guzman.vla@gmail.com - PROD
          'e263dcbc-ac95-40ec-bba6-40746c104d0e', // javiersegoviaa29@gmail.com - PROD
        ],
      }),
    ],
  })
}
