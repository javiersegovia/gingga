import type { AppContext } from '~/server/context'
import type { TRPCAppRouter } from '~/server/trpc/routers/app.router'
import { trpcServer } from '@hono/trpc-server'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import { Hono } from 'hono'
import { contextStorage } from 'hono/context-storage'
import { logger } from 'hono/logger'
import { createRequestHandler } from 'react-router'
import { makeQueryClient, setupTRPCClient } from '~/lib/trpc/shared'
import { getBetterAuth } from '~/server/context'
import { appRouter } from '~/server/trpc/routers/app.router'

const requestHandler = createRequestHandler(
  () => import('virtual:react-router/server-build'),
  import.meta.env.MODE,
)

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

app.use(async (c, next) => {
  const queryClient = makeQueryClient()
  const trpcClient = setupTRPCClient()
  const trpcProxy = createTRPCOptionsProxy<TRPCAppRouter>({
    client: trpcClient,
    queryClient,
    router: appRouter,
  })

  c.set('queryClient', queryClient)
  c.set('trpcClient', trpcClient)
  c.set('trpcProxy', trpcProxy)
  c.set('cloudflare', {
    env: c.env,
    ctx: c.executionCtx,
  })
  const data = await queryClient.ensureQueryData(trpcProxy.auth.getSession.queryOptions())
  console.log(data)

  return next()
})

app.all('*', async (c) => {
  return requestHandler(c.req.raw)
})

export default {
  fetch: app.fetch,
} satisfies ExportedHandler<Env>
