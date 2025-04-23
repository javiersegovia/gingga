import type { Session, User } from 'better-auth'
import { createServerAuth } from '@gingga/api/src/lib/auth/auth.service'
import { createDatabaseClient } from '@gingga/db'
import { createMiddleware, registerGlobalMiddleware } from '@tanstack/react-start'
import { getEvent, getWebRequest } from '@tanstack/react-start/server'
import { webEnv } from '~/web-env'

export function getDatabase() {
  const event = getEvent()
  if (!event.context.db) {
    event.context.db = createDatabaseClient()
  }
  return event.context.db
}

export async function getAuth() {
  const event = getEvent()
  if (!event.context.auth) {
    const auth = createServerAuth(getDatabase(), webEnv)

    const authSession = await auth.api.getSession({
      headers: getWebRequest()!.headers,
    })
    const data = authSession ? { session: authSession.session, user: authSession.user } : null
    event.context.auth = data
  }
  return event.context.auth
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
    auth: {
      session: Session
      user: User
    } | null
  }
}
