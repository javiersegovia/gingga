import { setupAppContext } from '~/middleware/setup-context.server'
import { createAPIFileRoute } from '@tanstack/react-start/api'
import { setHeader } from '@tanstack/react-start/server'

export const APIRoute = createAPIFileRoute('/api/logout')({
  POST: async ({ request }) => {
    setHeader('Location', '/')

    const { auth } = await setupAppContext()

    await auth.api.signOut({
      headers: request.headers,
    })

    return new Response(null, {
      status: 302,
    })
  },
})
