import { createMiddleware } from '@tanstack/react-start'
import { setResponseStatus } from '@tanstack/react-start/server'
import { sessionMiddleware } from '~/middleware/session-middleware'

/**
 * Middleware to force authentication on a server function, and add the user to the context.
 */
export const authMiddleware = createMiddleware().middleware([sessionMiddleware]).server(async ({ next, context }) => {
  if (!context?.session) {
    setResponseStatus(401)
    throw new Error('Unauthorized')
  }

  return next({ context })
})
