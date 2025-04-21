import type { Session as BetterAuthSessionData } from 'better-auth'
import type { Context as HonoContext } from 'hono'
import type { ContextEnv } from './server'
import type { AppAuthSession } from '~/lib/auth/auth.types'
import { eq } from '@gingga/db'
import { UserMemberships, Users } from '@gingga/db/schema'
import { getContext } from 'hono/context-storage'
import { createServerAuth } from '~/lib/auth/auth.service'

export const getDB = () => getContext<ContextEnv>().var.db

export async function createContext(c: HonoContext) {
  const cookie = c.req.header('Cookie')
  const authorization = c.req.header('Authorization')
  const db = getDB()

  const h = new Headers()
  if (cookie)
    h.set('Cookie', cookie)
  if (authorization)
    h.set('Authorization', authorization)

  const auth = createServerAuth()
  const betterAuthSession = await auth.api.getSession({
    headers: h,
  })

  const userId = betterAuthSession?.user?.id
  let authSession: AppAuthSession

  if (!userId) {
    authSession = { isAuthenticated: false }
    return {
      db,
      auth,
      authSession,
      c,
    }
  }

  const [user, membership] = await Promise.all([
    db.select().from(Users).where(eq(Users.id, userId)).get(),
    db
      .select()
      .from(UserMemberships)
      .where(eq(UserMemberships.userId, userId))
      .get(),
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
    headers: h,
    db,
    auth,
    authSession,
    c,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
