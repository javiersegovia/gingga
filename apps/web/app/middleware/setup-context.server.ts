import { createServerAuth } from '~/features/auth/auth.server'
import { createDatabaseClient, eq } from '@gingga/db'
import { getEvent, getWebRequest } from '@tanstack/react-start/server'
import { Users, UserMemberships } from '@gingga/db/schema'
import type { Session as BetterAuthSessionData } from 'better-auth'
import type { AppAuthSession } from '~/features/auth/auth.types'

export const getDatabase = () => getEvent().context.db

export async function setupAppContext() {
  const event = getEvent()
  const db = createDatabaseClient()
  event.context.db = db

  const auth = createServerAuth()
  const req = getWebRequest()

  if (!req) {
    throw new Error('No request found')
  }

  const betterAuthSession = await auth.api.getSession({
    headers: req.headers,
  })

  const userId = betterAuthSession?.user?.id
  let authSession: AppAuthSession

  if (!userId) {
    authSession = { isAuthenticated: false }
    return {
      db,
      auth,
      authSession,
    }
  }

  const [user, membership] = await Promise.all([
    db.select().from(Users).where(eq(Users.id, userId)).get(),
    db.select().from(UserMemberships).where(eq(UserMemberships.userId, userId)).get(),
  ])

  if (user) {
    authSession = {
      isAuthenticated: true,
      session: betterAuthSession.session as BetterAuthSessionData,
      user,
      membership: membership ?? null,
    }
  } else {
    authSession = { isAuthenticated: false }
  }

  return {
    db,
    auth,
    authSession,
  }
}
