import type { unstable_MiddlewareFunction } from 'react-router'
import { href, redirect } from 'react-router'
import { getAuthSession } from '~/server/context.server'

export const authMiddleware: unstable_MiddlewareFunction = async (_, next) => {
  const authSession = await getAuthSession()

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

export const adminMiddleware: unstable_MiddlewareFunction = async (_, next) => {
  const authSession = await getAuthSession()

  if (authSession.isAuthenticated && authSession.user.role !== 'admin') {
    throw redirect(href('/chat'), 302)
  }

  return next()
}
