import { createMiddleware } from '@tanstack/react-start'
import { getAuth } from '~/global-middleware'

/**
 * Middleware to add the session data to the context
 */
export const sessionMiddleware = createMiddleware().server(async ({ next }) => {
  const data = await getAuth()
  return next({
    context: data,
  })
})
