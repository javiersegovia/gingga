// apps/client/workers/app.ts
import type { ClientContextEnv } from '~/middleware/context-hono.server'
import { Hono } from 'hono'
import { contextStorage } from 'hono/context-storage'
import { createRequestHandler } from 'react-router'
import { getCloudflare, getTRPCProxy } from '~/middleware/context-hono.server'

const requestHandler = createRequestHandler(
  () => import('virtual:react-router/server-build'),
  import.meta.env.MODE,
)

const app = new Hono<ClientContextEnv>()
  .use(contextStorage())
  .all('*', async (c) => {
    getTRPCProxy() // setup Context
    getCloudflare() // setup Context
    c.set('__environment', 'client')

    return requestHandler(c.req.raw)
  })

export default {
  fetch: app.fetch,
} satisfies ExportedHandler<Env>
