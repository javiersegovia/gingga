import type { createServerAuth } from '@gingga/api/src/lib/auth/auth.service'
import type { AppAuthSession } from '@gingga/api/src/lib/auth/auth.types'
import type { createDatabaseClient } from '@gingga/db'
import { createMiddleware, registerGlobalMiddleware } from '@tanstack/react-start'
import { setupAppContext } from './middleware/setup-context.server'

export const contextMiddleware = createMiddleware().server(async ({ next }) => {
  const { db, auth, authSession } = await setupAppContext()

  return next({
    context: {
      db,
      auth,
      authSession,
    },
  })
})

registerGlobalMiddleware({
  middleware: [contextMiddleware],
})

declare module '@tanstack/react-start/server' {
  interface H3EventContext {
    authSession: AppAuthSession
    auth: ReturnType<typeof createServerAuth>
    db: ReturnType<typeof createDatabaseClient>
  }
}
