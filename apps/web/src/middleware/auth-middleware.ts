import { createMiddleware } from '@tanstack/react-start'
import { getHeaders, setResponseStatus } from '@tanstack/react-start/server'
import { authClient } from '~/features/auth/auth.client'

/**
 * Middleware to force authentication on a server function, and add the user to the context.
 */
export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const { data } = await authClient.getSession({
    fetchOptions: {
      headers: getHeaders() as HeadersInit,
    },
  })

  if (!data) {
    setResponseStatus(401)
    throw new Error('Unauthorized')
  }

  return next({ context: { session: data.session, user: data.user } })
})
