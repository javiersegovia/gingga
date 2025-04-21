import { registerGlobalMiddleware, createMiddleware } from '@tanstack/react-start'
import type { createDatabaseClient } from '@gingga/db'
import { setupAppContext } from './middleware/setup-context.server'
import type { AppAuthSession } from './features/auth/auth.types'

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
    // auth: ReturnType<typeof createServerAuth>
    authSession: AppAuthSession
    db: ReturnType<typeof createDatabaseClient>
  }
}
