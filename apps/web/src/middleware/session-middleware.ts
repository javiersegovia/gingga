import { createMiddleware } from '@tanstack/react-start'
import { getHeaders } from '@tanstack/react-start/server'
import { authClient } from '~/features/auth/auth.client'

/**
 * This function is only exported for use in TanStack Start API Routes
 * And should be replaced when we can use the auth middleware in the API routes
 * In every other place, we should use the sessionMiddleware instead
 */
export async function getSessionData() {
  const { data } = await authClient.getSession({
    fetchOptions: {
      credentials: 'include',
      headers: getHeaders() as HeadersInit,
    },
  })

  if (!data) {
    return null
  }

  return { session: data.session, user: data.user }
}

/**
 * Middleware to add the session data to the context
 */
export const sessionMiddleware = createMiddleware().server(async ({ next }) => {
  const data = await getSessionData()

  return next({
    context: data,
  })
})
