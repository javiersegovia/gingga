import { createAPIFileRoute } from '@tanstack/react-start/api'
import { setupAppContext } from '~/middleware/setup-context.server'

export const APIRoute = createAPIFileRoute('/api/auth/$')({
  GET: async ({ request }) => {
    console.log('GET ~~~~~~~~~~~~~~~~~~~~~~~~~~~~	')
    const { auth, authSession } = await setupAppContext()
    console.log('authSession', authSession)
    return auth.handler(request)
  },
  POST: async ({ request }) => {
    console.log('POST ~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
    const { auth, authSession } = await setupAppContext()
    console.log('authSession', authSession)

    return auth.handler(request)
  },
})
