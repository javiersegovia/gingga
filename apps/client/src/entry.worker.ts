import type { AppContext } from '~/server/context.server'
import type { TRPCAppRouter } from '~/server/trpc/routers/app.router'
import { QueryClient } from '@tanstack/react-query'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import { Hono } from 'hono'
// import { agentsMiddleware } from 'hono-agents'
import { contextStorage } from 'hono/context-storage'
import { logger } from 'hono/logger'
import { createRequestHandler } from 'react-router'
import { agentCustomRoute } from '~/server/api/agents/$agentId'
import { agentDefaultRoute } from '~/server/api/agents/default'
import { getBetterAuth } from '~/server/context.server'
import { appRouter } from '~/server/trpc/routers/app.router'

// export { DefaultChatAgent } from '~/server/agents/default-chat-agent'

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

app.route('/api/chat/default', agentDefaultRoute)
app.route('/api/agents/custom', agentCustomRoute)

// app.use(
//   '*',
//   agentsMiddleware({
//     options: {
//       prefix: 'agents',
//     },
//     onError(error) {
//       console.error('Error in agentsMiddleware')
//       console.error(error)
//     },
//   }),
// )

app.use(async (c, next) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60,
      },
    },
  })
  // const trpcClient = setupTRPCClient()
  const trpcProxy = createTRPCOptionsProxy<TRPCAppRouter>({
    // client: trpcClient,
    ctx: {},
    queryClient,
    router: appRouter,
  })
  await queryClient.prefetchQuery(trpcProxy.auth.getSession.queryOptions())

  c.set('request', c.req.raw)
  c.set('queryClient', queryClient)
  // c.set('trpcClient', trpcClient)
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
