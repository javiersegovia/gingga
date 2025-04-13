import { createMiddleware } from '@tanstack/react-start'
import { setResponseStatus } from '@tanstack/react-start/server'
import { $getAuthSession } from '@/features/auth/auth.api'
import { authMiddleware } from './auth-guard'
/**
 * Middleware to enforce admin privileges on a server function.
 * It first checks for authentication and then for the admin role.
 */
export const adminMiddleware = createMiddleware()
  .middleware([authMiddleware])
  .server(async ({ context, next }) => {
    if (context.auth.user?.role !== 'admin') {
      setResponseStatus(403)
      throw new Error('Forbidden: Requires admin privileges')
    }

    // User is authenticated and is an admin, proceed
    return next({ context: { auth: context.auth } })
  })
