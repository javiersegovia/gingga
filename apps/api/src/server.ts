import type { DatabaseType } from '@gingga/db'
import { createDatabaseClient } from '@gingga/db'
import { trpcServer } from '@hono/trpc-server'
import { Hono } from 'hono'
import { contextStorage } from 'hono/context-storage'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { createContext } from '~/context'
import { apiEnv } from '~/env'
import { appRouter } from '~/trpc/routers'

export interface ContextEnv {
  Bindings: Cloudflare.Env
  Variables: {
    db: DatabaseType
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

app.use('*', (c, next) => {
  const db = createDatabaseClient()
  c.set('db', db)
  return next()
})

app.on(['POST', 'GET'], '/api/auth/*', (c) => {
  // return auth.handler(c.req.raw);
  return c.text('Hello Auth!')
})

app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
    createContext: (_, c) => createContext(c),
  }),
)

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app
