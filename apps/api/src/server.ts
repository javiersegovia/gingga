import type { DatabaseType } from '@gingga/db'
import type { BetterAuth } from '~/lib/auth/auth.service'
import { trpcServer } from '@hono/trpc-server'
import { Hono } from 'hono'
import { contextStorage } from 'hono/context-storage'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { apiEnv } from '~/api-env'
import { createContext } from '~/context'
import { getAuth } from '~/lib/auth/auth.service'
import { appRouter } from '~/trpc/routers'

export interface ContextEnv {
  Bindings: Cloudflare.Env
  Variables: {
    db: DatabaseType
    auth: BetterAuth
  }
}

const app = new Hono<ContextEnv>()

app.use(logger())
app.use(contextStorage())

console.log('apiEnv.VITE_SITE_URL')
console.log(apiEnv.VITE_SITE_URL)

app.use(
  cors({
    origin: [apiEnv.VITE_SITE_URL],
    credentials: true,
  }),
)

app.on(['POST', 'GET'], '/api/auth/*', (c) => {
  console.log('c.req.raw')
  console.log(c.req.raw)
  return getAuth().handler(c.req.raw)
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
