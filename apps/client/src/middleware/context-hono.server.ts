// apps/client/src/middleware/context-hono.server.ts
import type { AuthSession } from '@gingga/api/context'
import type { TRPCAppRouter } from '@gingga/api/trpc/routers/index'
import type { DatabaseType } from '@gingga/db'
import type { TRPCClient } from '@trpc/client'
import type { TRPCOptionsProxy } from '@trpc/tanstack-react-query'
import type { ExecutionContext as HonoExecutionContext } from 'hono'
import type { unstable_MiddlewareFunction } from 'react-router'
import { createDatabaseClient } from '@gingga/db'
import { QueryClient } from '@tanstack/react-query'
import { getContext } from 'hono/context-storage'
import { webEnv } from '~/lib/env.server'
import { setupTRPCClient, setupTRPCServer } from '~/lib/trpc/shared'

export const honoContextMiddleware: unstable_MiddlewareFunction = ({ request }, next) => {
  const c = getContext<ClientContextEnv>()
  c.set('request', request)
  return next()
}

export interface ClientContextEnv {
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
  }
}

export interface CloudflareContextType {
  env: Env
  ctx: HonoExecutionContext
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

export function getCloudflare() {
  const c = getContext<ClientContextEnv>()

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
  const c = getContext<ClientContextEnv>()

  if (c.var.queryClient) {
    return c.var.queryClient
  }
  const queryClient = new QueryClient()
  c.set('queryClient', queryClient)
  return queryClient
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

export function getTRPCClient() {
  const c = getContext<ClientContextEnv>()

  if (c.var.trpcClient) {
    return c.var.trpcClient
  }

  const trpcClient = setupTRPCClient(webEnv.VITE_API_URL)
  c.set('trpcClient', trpcClient)
  return trpcClient
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

export async function getTRPCProxy() {
  const c = getContext<ClientContextEnv>()

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
  const c = getContext<ClientContextEnv>()
  return c.var.request
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

export function getDB() {
  const c = getContext<ClientContextEnv>()

  if (c.var.db) {
    return c.var.db
  }
  const db = createDatabaseClient()
  c.set('db', db)
  return db
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

export async function getAuthSession() {
  const c = getContext<ClientContextEnv>()

  if (c.var.authSession) {
    return c.var.authSession
  }

  const trpc = await getTRPCProxy()
  const queryClient = getQueryClient()
  const authSession = await queryClient.ensureQueryData(trpc.auth.getSession.queryOptions())
  c.set('authSession', authSession)
  return authSession
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

// export function getBetterAuth() {
//   const store = getStore()
//   if (!store.betterAuth) {
//     store.betterAuth = createServerAuth(getDB(), webEnv)
//   }
//   return store.betterAuth
// }

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
