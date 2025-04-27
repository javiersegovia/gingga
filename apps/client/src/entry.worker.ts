// apps/client/workers/app.ts
import type { DatabaseType } from '@gingga/db'
import type { QueryClient } from '@tanstack/react-query'
import type { TRPCClient } from '@trpc/client'
import type { TRPCOptionsProxy } from '@trpc/tanstack-react-query'
import type { CloudflareContextType } from '~/middleware/context-hono.server'
import type { AppContext, AuthSession } from '~/server/context'
import type { TRPCAppRouter } from '~/server/trpc/routers/app.router'
import { trpcServer } from '@hono/trpc-server'
import { Hono } from 'hono'
import { contextStorage } from 'hono/context-storage'
import { logger } from 'hono/logger'
import { createRequestHandler } from 'react-router'
import { getCloudflare, getTRPCProxy } from '~/middleware/context-hono.server'
import { getBetterAuth } from '~/server/context'
import { appRouter } from '~/server/trpc/routers/app.router'

const requestHandler = createRequestHandler(
  () => import('virtual:react-router/server-build'),
  import.meta.env.MODE,
)

// export interface ClientContextEnv {
//   Bindings: Env
//   Variables: {
//     __environment: 'client'
//     request: Request
//     cloudflare: CloudflareContextType
//     queryClient?: QueryClient
//     trpcClient?: TRPCClient<TRPCAppRouter>
//     trpcProxy?: TRPCOptionsProxy<TRPCAppRouter>
//     db?: DatabaseType
//     authSession?: AuthSession
//   }
// }

const app = new Hono<AppContext>()
app.use(logger())
app.use(contextStorage())
app.on(['POST', 'GET'], '/api/auth/*', (c) => {
  return getBetterAuth().handler(c.req.raw)
})

app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
  }),
)

// app.route('/api/chat/default', agentDefaultRoute)
// app.route('/api/agents/custom', agentCustomRoute)

app.all('*', async (c) => {
  getTRPCProxy() // setup Context
  getCloudflare() // setup Context
  c.set('__environment', 'client')
  return requestHandler(c.req.raw)
})

export default {
  fetch: app.fetch,
} satisfies ExportedHandler<Env>
