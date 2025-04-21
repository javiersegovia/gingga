import { createMiddleware } from '@tanstack/react-start'
import { setResponseStatus } from '@tanstack/react-start/server'
import { getAuthSession } from '~/middleware/setup-context.server'

/**
 * Middleware to force authentication on a server function, and add the user to the context.
 */
export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const auth = getAuthSession()

  if (!auth.isAuthenticated) {
    setResponseStatus(401)
    throw new Error('Unauthorized')
  }

  return next({ context: { auth } })
})
