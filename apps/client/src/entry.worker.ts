import type { AppContext } from '~/server/context'
import { trpcServer } from '@hono/trpc-server'
import { Hono } from 'hono'
import { contextStorage } from 'hono/context-storage'
import { logger } from 'hono/logger'
import { createRequestHandler } from 'react-router'
import { setupTRPCClient, setupTRPCProxy } from '~/lib/trpc/shared'
import { getBetterAuth, getQueryClient } from '~/server/context'
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

app.use('/api/*', async (c, next) => {
  const queryClient = getQueryClient()
  const trpcClient = setupTRPCClient()
  const trpcProxy = setupTRPCProxy({ trpcClient, queryClient })

  c.set('trpcClient', trpcClient)
  c.set('queryClient', queryClient)
  c.set('trpcProxy', trpcProxy)
  c.set('cloudflare', {
    env: c.env,
    ctx: c.executionCtx,
  })

  return next()
})

app.all('*', async (c) => {
  return requestHandler(c.req.raw)
})

export default {
  fetch: app.fetch,
} satisfies ExportedHandler<Env>
