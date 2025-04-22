import { createMiddleware } from '@tanstack/react-start'
import { setResponseStatus } from '@tanstack/react-start/server'
import { roleMiddleware } from '~/middleware/role-middleware'

/**
 * Middleware to enforce admin privileges on a server function.
 * It first checks for authentication and then for the admin role.
 */
export const adminMiddleware = createMiddleware()
  .middleware([roleMiddleware])
  .server(async ({ context, next }) => {
    if (context.user.role !== 'admin') {
      setResponseStatus(403)
      throw new Error('Forbidden: Requires admin privileges')
    }

    // User is authenticated and is an admin, proceed
    return next({ context: { ...context } })
  })
