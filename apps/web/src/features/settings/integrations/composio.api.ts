import { createServerFn } from '@tanstack/react-start'
import { zodValidator } from '@tanstack/zod-adapter'
import { authMiddleware } from '~/middleware/auth-guard' // Assuming this exists
import {
  DeleteConnectionSchema,
  GetIntegrationSchema,
  InitiateConnectionSchema,
} from './composio.schema'
import {
  deleteUserComposioConnection,
  getComposioIntegrationByAppName,
  getComposioIntegrations,
  getVercelToolset,
  initiateComposioConnection,
} from './composio.service'

/**
 * API Function: Get the list of available Composio integrations.
 */
export const $getComposioIntegrations = createServerFn({
  method: 'GET',
}).handler(async () => {
  try {
    const integrations = await getComposioIntegrations()
    return integrations
  }
  catch (error) {
    console.error('Error fetching composio integrations:', error)
    throw new Error('Failed to retrieve integrations list.')
  }
})

/**
 * API Function: Get details for a specific Composio integration by appName.
 * Uses validator for input schema.
 */
export const $getComposioIntegrationByAppName = createServerFn({
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
    }
    catch (error) {
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
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { userId } = context.auth.session
    try {
      const toolset = getVercelToolset({ entityId: userId })
      const connections = await toolset.client.connectedAccounts.list({
        entityId: userId,
      })

      return (
        connections.items?.map(conn => ({
          id: conn.id,
          appName: conn.appName ?? null,
          appUniqueId: conn.appUniqueId ?? null,
          status: conn.status,
          createdAt: conn.createdAt,
          integrationId: conn.integrationId,
          logo: conn.logo,
          isDisabled: conn.isDisabled,
        })) || []
      )
    }
    catch (error) {
      console.error(`Error fetching connections for user ${userId}:`, error)
      // Instead of throwing, return empty items and error message
      throw new Error('Failed to retrieve user connections.')
    }
  })

/**
 * API Function: Initiate a new Composio connection for the logged-in user.
 * Uses validator for input schema. Returns the redirect URL needed for OAuth.
 */
export const $initiateComposioConnection = createServerFn({
  method: 'POST',
})
  .validator(zodValidator(InitiateConnectionSchema))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const userId = context.auth.session.userId

    try {
      const { redirectUrl } = await initiateComposioConnection({
        userId,
        integrationId: data.integrationId,
        redirectUri: `${import.meta.env.VITE_SITE_URL}/settings/integrations`,
      })

      return { redirectUrl }
    }
    catch (error) {
      console.error(
        `Error initiating connection for user ${userId}, integration ${data.integrationId}:`,
        error,
      )

      if (error instanceof Error) {
        throw new TypeError(error.message || 'Failed to initiate connection.')
      }

      throw new Error('Failed to initiate connection.')
    }
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
    }
    catch (error) {
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
