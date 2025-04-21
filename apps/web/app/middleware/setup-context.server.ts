import type { AppAuthSession } from '@gingga/api/src/lib/auth/auth.types'
import type { Session as BetterAuthSessionData } from 'better-auth'
import { createServerAuth } from '@gingga/api/src/lib/auth/auth.service'
import { createDatabaseClient, eq } from '@gingga/db'
import { UserMemberships, Users } from '@gingga/db/schema'
import { getEvent, getWebRequest } from '@tanstack/react-start/server'

export const getDatabase = () => getEvent().context.db
export const getAuth = () => getEvent().context.auth
export const getAuthSession = () => getEvent().context.authSession

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
  }
  else {
    authSession = { isAuthenticated: false }
  }

  return {
    db,
    auth,
    authSession,
  }
}
