import { createServerAuth } from '@gingga/api/src/lib/auth/auth.service'
import { createMiddleware } from '@tanstack/react-start'
import { getWebRequest } from '@tanstack/react-start/server'
import { getDatabase } from '~/global-middleware'
import { webEnv } from '~/web-env'

/**
 * This function is only exported for use in TanStack Start API Routes
 * And should be replaced when we can use the auth middleware in the API routes
 * In every other place, we should use the sessionMiddleware instead
 */
export async function getSessionData() {
  const auth = createServerAuth(getDatabase(), webEnv)
  const req = getWebRequest()!
  const authSession = await auth.api.getSession({
    headers: req.headers,
  })

  return authSession ? { session: authSession.session, user: authSession.user } : null
}

/**
 * Middleware to add the session data to the context
 */
export const sessionMiddleware = createMiddleware().server(async ({ next }) => {
  const auth = createServerAuth(getDatabase(), webEnv)
  const req = getWebRequest()!

  const authSession = await auth.api.getSession({
    headers: req.headers,
  })
  const data = authSession ? {
    session: authSession.session,
    user: authSession.user,
  } : null

  return next({
    context: data,
  })
})
