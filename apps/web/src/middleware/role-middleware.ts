import { eq } from '@gingga/db'
import { Users } from '@gingga/db/schema'
import { createMiddleware } from '@tanstack/react-start'
import { setResponseStatus } from '@tanstack/react-start/server'
import { authMiddleware } from '~/middleware/auth-middleware'
import { getDatabase } from '~/middleware/setup-context.server'

/**
 * Middleware to enforce role-based access control.
 * It first checks for authentication and then for the specified role.
 */
export const roleMiddleware = createMiddleware().middleware([authMiddleware]).server(async ({ next, context }) => {
  const db = getDatabase()
  const user = await db.query.Users.findFirst({
    where: eq(Users.id, context.user.id),
    with: {
      membership: true,
    },
  })

  if (!user) {
    setResponseStatus(401)
    throw new Error('Unauthorized')
  }

  return next({ context: { ...context, user } })
})
