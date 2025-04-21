import { json } from '@tanstack/react-start'
import { createAPIFileRoute } from '@tanstack/react-start/api'
import { checkRateLimit } from '~/features/rate-limit/rate-limit.service'
import { setupAppContext } from '~/middleware/setup-context.server'

export const APIRoute = createAPIFileRoute('/api/agents/rate-limit-test')({
  GET: async ({ request }) => {
    const { authSession } = await setupAppContext()

    try {
      const { success, remaining, reset, identifier, tier } = await checkRateLimit({
        request,
        userId: authSession.isAuthenticated ? authSession.user.id : null,
      })

      if (!success) {
        return json(
          {
            error: 'Rate limit exceeded',
            remaining,
            identifier,
            reset: new Date(reset).toISOString(),
            tier,
          },
          { status: 429 },
        )
      }

      return json({
        message: 'Hello from rate-limited test endpoint!',
        remaining,
        identifier,
        reset: new Date(reset).toISOString(),
        tier,
      })
    }
    catch (error) {
      console.error('Error in test endpoint:', error)
      return json(
        {
          error: 'Internal server error',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 },
      )
    }
  },
})
