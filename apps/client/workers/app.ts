import { Hono } from 'hono'
import { contextStorage } from 'hono/context-storage'
import { createRequestHandler } from 'react-router'
import { CloudflareContext } from '~/middleware/cloudflare.server'

const requestHandler = createRequestHandler(
  () => import('virtual:react-router/server-build'),
  import.meta.env.MODE,
)

export interface ContextEnv {
  Bindings: Cloudflare.Env
}

const app = new Hono<ContextEnv>()
  .use(contextStorage())
  .all('*', async (c) => {
    const context = new Map([[CloudflareContext, { env: c.env, ctx: c.executionCtx }]])
    return requestHandler(c.req.raw, context)
  })

export default {
  fetch: app.fetch,
} satisfies ExportedHandler<Env>
