import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { getWebRequest } from '@tanstack/react-start/server'
import type { AppAuthSession } from '~/features/auth/auth.types'
import { contextMiddleware } from '~/global-middleware'

export const $getAuthSession = createServerFn({ method: 'GET' })
  .middleware([contextMiddleware])
  .handler<AppAuthSession>(async ({ context }) => {
    return context.authSession
  })

export const $signOut = createServerFn({ method: 'POST' })
  .middleware([contextMiddleware])
  .handler(async ({ context }) => {
    const auth = context.auth
    const req = getWebRequest()

    if (req) {
      await auth.api.signOut({
        headers: req.headers,
      })
    }

    throw redirect({ to: '/' })
  })
