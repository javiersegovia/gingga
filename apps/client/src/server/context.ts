import type { DatabaseType } from '@gingga/db'
import type { TRPCClient } from '@trpc/client'
import type { TRPCOptionsProxy } from '@trpc/tanstack-react-query'
import type { Session } from 'better-auth'
import type { ExecutionContext as HonoExecutionContext } from 'hono'
import type { unstable_MiddlewareFunction } from 'react-router'
import type { BetterAuth } from '~/lib/auth/auth.server'
import type { TRPCAppRouter } from '~/server/trpc/routers/app.router'
import { createDatabaseClient } from '@gingga/db'
import { QueryClient } from '@tanstack/react-query'
import { getContext } from 'hono/context-storage'
import { getUserById } from '~/features/user/user.service'
import { createServerAuth } from '~/lib/auth/auth.server'
import { webEnv } from '~/lib/env.server'
import { setupTRPCClient, setupTRPCServer } from '~/lib/trpc/shared'

export type AuthSession = {
  isAuthenticated: true
  session: Session
  user: Awaited<ReturnType<typeof getUserById>>
} | {
  isAuthenticated: false
}

export interface AppContext {
  Bindings: Env
  Variables: {
    __environment: 'client'
    request: Request
    cloudflare: CloudflareContextType
    queryClient?: QueryClient
    trpcClient?: TRPCClient<TRPCAppRouter>
    trpcProxy?: TRPCOptionsProxy<TRPCAppRouter>
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
  const c = getContext<AppContext>()
  c.set('request', request)
  return next()
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

export function getCloudflare() {
  const c = getContext<AppContext>()

  if (c.var.cloudflare) {
    return c.var.cloudflare
  }

  const cloudflareContext = {
    env: c.env,
    ctx: c.executionCtx,
  } satisfies CloudflareContextType

  c.set('cloudflare', cloudflareContext)
  return cloudflareContext
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

export function getQueryClient() {
  const c = getContext<AppContext>()

  if (c.var.queryClient) {
    return c.var.queryClient
  }
  const queryClient = new QueryClient()
  c.set('queryClient', queryClient)
  return queryClient
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

export function getTRPCClient() {
  const c = getContext<AppContext>()

  if (c.var.trpcClient) {
    return c.var.trpcClient
  }

  const trpcClient = setupTRPCClient()
  c.set('trpcClient', trpcClient)
  return trpcClient
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

export async function getTRPCProxy() {
  const c = getContext<AppContext>()

  if (c.var.trpcProxy) {
    return c.var.trpcProxy
  }

  const trpcProxy = await setupTRPCServer({
    trpcClient: getTRPCClient(),
    queryClient: getQueryClient(),
  })

  c.set('trpcProxy', trpcProxy)
  return trpcProxy
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

export function getRequest() {
  const c = getContext<AppContext>()
  return c.var.request
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

export async function getAuthSession() {
  const c = getContext<AppContext>()

  if (c.var.authSession) {
    return c.var.authSession
  }
  const data = await getBetterAuth().api.getSession({
    headers: c.req.raw.headers,
  })
  const authSession = data ? { isAuthenticated: true as const, session: data?.session, user: await getUserById(data.user.id) } : { isAuthenticated: false as const }
  c.set('authSession', authSession)
  return authSession
}
// export async function getAuthSession() {
//   const c = getContext<AppContext>()

//   if (c.var.authSession) {
//     return c.var.authSession
//   }

//   const trpc = await getTRPCProxy()
//   const queryClient = getQueryClient()
//   const authSession = await queryClient.ensureQueryData(trpc.auth.getSession.queryOptions())
//   c.set('authSession', authSession)
//   return authSession
// }

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

export function getBetterAuth() {
  const c = getContext<AppContext>()

  if (c.var.betterAuth) {
    return c.var.betterAuth
  }

  const betterAuth = createServerAuth(getDB(), webEnv)
  c.set('betterAuth', betterAuth)
  return betterAuth
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
