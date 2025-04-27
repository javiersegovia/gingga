// apps/api/src/context.ts
import type { Session } from 'better-auth'
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

export async function getUserById(id: string) {
  const db = getDB()
  return await db.query.Users.findFirst({
    where: eq(Users.id, id),
  })
}

export async function getAuthSession(h: Headers) {
  const c = getContext<ContextEnv>()
  console.log('getAuthSession inside ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
  console.log(c.var.__environment)

  if (c.var.authSession) {
    return c.var.authSession
  }
  const data = await getAuth().api.getSession({
    headers: h,
  })

  console.log('data')
  console.log(data)

  c.set('authSession', data ? { isAuthenticated: true, session: data?.session, user: await getUserById(data.user.id) } : { isAuthenticated: false })
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

  console.log('createContext inside... ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
  console.log(c.var.__environment)

  const db = getDB()
  const auth = getAuth()
  const authSession = await getAuthSession(h)

  return {
    headers: h,
    c,
    db,
    auth,
    authSession,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
export type AuthSession = {
  isAuthenticated: true
  session: Session
  user: Awaited<ReturnType<typeof getUserById>>
} | {
  isAuthenticated: false
}
