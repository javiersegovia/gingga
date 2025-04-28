import type { DatabaseType } from '@gingga/db'
import type { QueryClient } from '@tanstack/react-query'
import type { TRPCClient } from '@trpc/client'
import type { TRPCOptionsProxy } from '@trpc/tanstack-react-query'
import type { Session } from 'better-auth'
import type { ExecutionContext as HonoExecutionContext } from 'hono'
import type { unstable_MiddlewareFunction } from 'react-router'
import type { BetterAuth } from '~/lib/auth/auth.server'
import type { TRPCAppRouter } from '~/server/trpc/routers/app.router'
import { createDatabaseClient } from '@gingga/db'
import { getContext } from 'hono/context-storage'
import { getUserById } from '~/features/user/user.service'
import { createServerAuth } from '~/lib/auth/auth.server'
import { webEnv } from '~/lib/env.server'

export type AuthenticatedUser = NonNullable<Awaited<ReturnType<typeof getUserById>>>
export type AuthSession = {
  isAuthenticated: true
  session: Session
  user: AuthenticatedUser
} | {
  isAuthenticated: false
}

export interface AppContext {
  Bindings: Env
  Variables: {
    __environment: 'client'
    request: Request
    cloudflare: CloudflareContextType
    queryClient: QueryClient
    trpcClient: TRPCClient<TRPCAppRouter>
    trpcProxy: TRPCOptionsProxy<TRPCAppRouter>
    db?: DatabaseType
    authSession?: AuthSession
    betterAuth?: BetterAuth
  }
}

export interface CloudflareContextType {
  env: Env
  ctx: HonoExecutionContext
}

export function getHonoContext() {
  return getContext<AppContext>()
}

export function getDB() {
  const c = getHonoContext()

  if (c.var.db) {
    return c.var.db
  }

  const db = createDatabaseClient()
  c.set('db', db)
  return db
}

export const honoContextMiddleware: unstable_MiddlewareFunction = ({ request }, next) => {
  const c = getHonoContext()
  c.set('request', request)
  return next()
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

export const getRequest = () => getContext<AppContext>().var.request
export const getCloudflare = () => getContext<AppContext>().var.cloudflare
export const getQueryClient = () => getContext<AppContext>().var.queryClient
export const getTRPCClient = () => getContext<AppContext>().var.trpcClient
export const getTRPCProxy = () => getContext<AppContext>().var.trpcProxy

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

export async function getAuthSession() {
  const c = getHonoContext()

  if (c.var.authSession) {
    return c.var.authSession
  }
  const data = await getBetterAuth().api.getSession({
    headers: c.req.raw.headers,
  })

  if (!data) {
    return { isAuthenticated: false as const }
  }

  const user = await getUserById(data.user.id)
  if (!user) {
    return { isAuthenticated: false as const }
  }

  const authSession = { isAuthenticated: true as const, session: data?.session, user }
  c.set('authSession', authSession)
  return authSession
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

export function getBetterAuth() {
  const c = getHonoContext()

  if (c.var.betterAuth) {
    return c.var.betterAuth
  }

  const betterAuth = createServerAuth(getDB(), webEnv)
  c.set('betterAuth', betterAuth)
  return betterAuth
}
