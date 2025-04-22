import { createDatabaseClient } from '@gingga/db'
import { createMiddleware, registerGlobalMiddleware } from '@tanstack/react-start'
import { getEvent } from '@tanstack/react-start/server'

export function getDatabase() {
  const event = getEvent()
  if (!event.context.db) {
    event.context.db = createDatabaseClient()
  }
  return event.context.db
}

export const contextMiddleware = createMiddleware().server(async ({ next }) => {
  const db = getDatabase()

  return next({
    context: {
      db,
    },
  })
})

registerGlobalMiddleware({
  middleware: [contextMiddleware],
})

declare module '@tanstack/react-start/server' {
  interface H3EventContext {
    db: ReturnType<typeof createDatabaseClient>
  }
}
