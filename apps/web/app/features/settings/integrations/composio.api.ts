import { createServerFn } from '@tanstack/react-start'
import { zodValidator } from '@tanstack/zod-adapter'
import { authMiddleware } from '@/middleware/auth-guard' // Assuming this exists
import {
  getComposioIntegrations,
  getComposioIntegrationByAppName,
  getUserComposioConnections,
  initiateComposioConnection,
  deleteUserComposioConnection,
} from './composio.service'
import {
  InitiateConnectionSchema,
  DeleteConnectionSchema,
  GetIntegrationSchema,
} from './composio.schema'

/**
 * API Function: Get the list of available Composio integrations.
 */
export const $getComposioIntegrations = createServerFn({
  method: 'GET',
})
  // No middleware needed - public list
  .handler(async () => {
    try {
      const integrations = await getComposioIntegrations() // Synchronous call
      return integrations
    } catch (error) {
      console.error('Error fetching composio integrations:', error)
      throw new Error('Failed to retrieve integrations list.')
    }
  })

/**
 * API Function: Get details for a specific Composio integration by appName.
 * Uses validator for input schema.
 */
export const $getComposioIntegration = createServerFn({
  method: 'GET',
})
  .validator(zodValidator(GetIntegrationSchema))
  .handler(async ({ data }) => {
    // Use 'input' from context when validate is used
    try {
      // Input is guaranteed to be valid due to the validator
      const integration = await getComposioIntegrationByAppName(data.appName)
      if (!integration) {
        // Validator ensures appName is valid, but service might theoretically not find it
        throw new Error(`Integration with appName '${data.appName}' not found.`)
      }
      return { integration }
    } catch (error) {
      console.error(`Error fetching composio integration ${data.appName}:`, error)
      if (error instanceof Error && error.message.includes('not found')) {
        throw error // Re-throw specific not found error
      }
      throw new Error('Failed to retrieve integration details.')
    }
  })

/**
 * API Function: Get the current user's active Composio connections.
 */
export const $getUserComposioConnections = createServerFn({
  method: 'GET',
})
  .middleware([authMiddleware]) // Requires user to be logged in
  .handler(async ({ context }) => {
    const userId = context.auth?.session?.userId
    if (!userId) {
      // This should technically be caught by authMiddleware, but belts and suspenders
      throw new Error('Authentication required.')
    }
    try {
      // Correctly type the expected return shape if needed, or let inference work
      // const connections: ExpectedConnectionType[] = await getUserComposioConnections(userId)
      const connections = await getUserComposioConnections(userId)
      // console.log("Connections API return:", connections);
      return { connections } // Ensure the structure matches query expectations
    } catch (error) {
      console.error(`Error fetching connections for user ${userId}:`, error)
      throw new Error('Failed to retrieve user connections.')
    }
  })

/**
 * API Function: Initiate a new Composio connection for the logged-in user.
 * Uses validator for input schema.
 */
export const $initiateComposioConnection = createServerFn({
  method: 'POST',
  response: 'raw',
})
  .validator(zodValidator(InitiateConnectionSchema))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    // Use 'input' from context
    const userId = context.auth?.session?.userId
    if (!userId) {
      throw new Error('Authentication required.')
    }

    let redirectUrl = ''

    try {
      const { redirectUrl: composioRedirectUrl } = await initiateComposioConnection({
        userId,
        integrationId: data.integrationId,
        redirectUri: `${import.meta.env.VITE_SITE_URL}/settings/integrations`,
      })
      redirectUrl = composioRedirectUrl
    } catch (error) {
      console.error(
        `Error initiating connection for user ${userId}, integration ${data.integrationId}:`,
        error,
      )
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Failed to initiate connection.')
    }

    throw new Response(null, {
      status: 302,
      headers: {
        Location: redirectUrl,
      },
    })
  })

/**
 * API Function: Delete a specific Composio connection for the logged-in user.
 * Uses validator for input schema.
 */
export const $deleteUserComposioConnection = createServerFn({
  method: 'POST',
})
  .validator(zodValidator(DeleteConnectionSchema))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const userId = context.auth?.session?.userId // User ID primarily for auth context
    if (!userId) {
      throw new Error('Authentication required.')
    }
    try {
      // Input is guaranteed by validator
      const success = await deleteUserComposioConnection(data.connectionId)
      return { success }
    } catch (error) {
      console.error(
        `Error deleting connection ${data.connectionId} (triggered by user ${userId}):`,
        error,
      )
      if (error instanceof Error) {
        throw error // Re-throw specific errors (like not found)
      }
      throw new Error('Failed to delete connection.')
    }
  })
