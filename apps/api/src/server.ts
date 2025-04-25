import type { DatabaseType } from '@gingga/db'
import type { Session, User } from 'better-auth'
import type { BetterAuth } from '~/lib/auth/auth.service'
import { trpcServer } from '@hono/trpc-server'
import { Hono } from 'hono'
import { contextStorage } from 'hono/context-storage'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { apiEnv } from '~/api-env'
import { createContext } from '~/context'
import { getAuth } from '~/lib/auth/auth.service'
import { agentCustomRoute } from '~/routes/agents/$agentId'
import { agentDefaultRoute } from '~/routes/agents/default'
import { appRouter } from '~/trpc/routers'

export interface ContextEnv {
  Bindings: Cloudflare.Env
  Variables: {
    db: DatabaseType
    auth: BetterAuth
    authSession: { session: Session, user: User } | null
  }
}

const app = new Hono<ContextEnv>()

app.use(logger())
app.use(contextStorage())

app.use(
  cors({
    origin: [apiEnv.VITE_SITE_URL],
    credentials: true,
  }),
)

app.on(['POST', 'GET'], '/api/auth/*', (c) => {
  return getAuth().handler(c.req.raw)
})

app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
    createContext: (_, c) => createContext(c),
  }),
)

app.route('/api/chat/default', agentDefaultRoute)
app.route('/api/agents/custom', agentCustomRoute)

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app
