// apps/client/src/middleware/auth.middleware.ts
import type { unstable_MiddlewareFunction } from 'react-router'
import { href, redirect } from 'react-router'
import { getAuthSession } from '~/middleware/context-hono.server'
// import { getAuthSession } from '~/middleware/context-storage.server'

export const sessionMiddleware: unstable_MiddlewareFunction = async (_, next) => {
  console.log('[1] - SESSION-MIDDLEWARE')
  const session = await getAuthSession()
  console.log(session)
  return next()
}

export const authMiddleware: unstable_MiddlewareFunction = async (_, next) => {
  console.log('[1] - GET AUTH SESSION')
  const authSession = await getAuthSession()
  console.log('[2] - END GET AUTH SESSION')

  if (!authSession.isAuthenticated) {
    throw redirect(href('/identify'), 302)
  }

  return next()
}

export const anonymousMiddleware: unstable_MiddlewareFunction = async (_, next) => {
  const authSession = await getAuthSession()

  if (authSession.isAuthenticated) {
    throw redirect(href('/chat'), 302)
  }

  return next()
}
