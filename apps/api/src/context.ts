import type { Context as HonoContext } from 'hono'
import type { ContextEnv } from './server'
import { createDatabaseClient, eq } from '@gingga/db'
import { Users } from '@gingga/db/schema'
import { getContext } from 'hono/context-storage'
import { getAuth } from '~/lib/auth/auth.service'

export function getDB() {
  const c = getContext<ContextEnv>()

  if (!c.var.db) {
    c.set('db', createDatabaseClient())
  }

  return c.var.db
}

export async function getAuthSession(h: Headers) {
  const c = getContext<ContextEnv>()

  if (c.var.authSession) {
    return c.var.authSession
  }

  const auth = getAuth()
  const data = await auth.api.getSession({
    headers: h,
  })

  c.set('authSession', data ? { session: data?.session, user: data?.user } : null)

  return c.var.authSession
}

export async function createContext(c: HonoContext) {
  const cookie = c.req.header('Cookie')
  const authorization = c.req.header('Authorization')

  const h = new Headers()
  if (cookie) {
    h.set('Cookie', cookie)
  }
  if (authorization) {
    h.set('Authorization', authorization)
  }

  const db = getDB()
  const auth = getAuth()
  const authSession = await auth.api.getSession({
    headers: h,
  })

  const user = authSession
    ? await db.query.Users.findFirst({
      where: eq(Users.id, authSession.user.id),
      with: {
        membership: true,
      },
    })
    : null

  return {
    headers: h,
    c,
    db,
    auth,
    session: authSession?.session,
    user,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
