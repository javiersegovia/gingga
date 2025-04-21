import { createAPIFileRoute } from '@tanstack/react-start/api'
import { setupAppContext } from '~/middleware/setup-context.server'

export const APIRoute = createAPIFileRoute('/api/auth/$')({
  GET: async ({ request }) => {
    // console.log('GET ~~~~~~~~~~~~~~~~~~~~~~~~~~~~\t')
    const { auth, authSession: _authSession } = await setupAppContext()
    // console.log('authSession', _authSession)
    return auth.handler(request)
  },
  POST: async ({ request }) => {
    // console.log('POST ~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
    const { auth, authSession: _authSession } = await setupAppContext()
    // console.log('authSession', _authSession)

    return auth.handler(request)
  },
})
