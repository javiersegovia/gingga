import { TRPCError } from '@trpc/server'
import { apiEnv } from '~/api-env'
import { protectedProcedure, publicProcedure, router } from '~/trpc'
import {
  DeleteConnectionSchema,
  GetIntegrationSchema,
  InitiateConnectionSchema,
} from './composio.schema'
import {
  deleteUserComposioConnection,
  getComposioIntegrationByAppName,
  getComposioIntegrations,
  getUserComposioConnections,
  initiateComposioConnection,
} from './composio.service'

export const composioRouter = router({
  /**
   * Query: Get the list of available Composio integrations.
   * Public procedure as integration list is not user-specific.
   */
  getComposioIntegrations: publicProcedure.query(async () => {
    try {
      const integrations = await getComposioIntegrations()
      return integrations
    }
    catch (error) {
      console.error('Error in getComposioIntegrations router:', error)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to retrieve integrations list.',
      })
    }
  }),

  /**
   * Query: Get details for a specific Composio integration by appName.
   * Public procedure as integration details are not user-specific.
   */
  getComposioIntegrationByAppName: publicProcedure
    .input(GetIntegrationSchema)
    .query(async ({ input }) => {
      try {
        const integration = await getComposioIntegrationByAppName(input.appName)
        if (!integration) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: `Integration with appName '${input.appName}' not found.`,
          })
        }
        // Match the structure expected by the client (from original api file)
        return { integration }
      }
      catch (error) {
        console.error(
          `Error in getComposioIntegrationByAppName router for ${input.appName}:`,
          error,
        )
        if (error instanceof TRPCError) {
          throw error
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve integration details.',
        })
      }
    }),

  /**
   * Query: Get the current user's active Composio connections.
   * Protected procedure - requires authentication.
   */
  getUserComposioConnections: protectedProcedure.query(async ({ ctx }) => {
    const { id: userId } = ctx.user
    try {
      // Service function now takes userId
      const connections = await getUserComposioConnections(userId)
      return connections // Return the array directly as per service
    }
    catch (error) {
      console.error(`Error in getUserComposioConnections router for user ${userId}:`, error)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to retrieve user connections.',
      })
    }
  }),

  /**
   * Mutation: Initiate a new Composio connection for the logged-in user.
   * Protected procedure - requires authentication.
   */
  initiateComposioConnection: protectedProcedure
    .input(InitiateConnectionSchema)
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user
      try {
        // Pass userId and redirect URI to the service function
        const result = await initiateComposioConnection({
          userId,
          integrationId: input.integrationId,
          // Assuming VITE_SITE_URL is accessible via env in api context
          redirectUri: `${apiEnv.VITE_SITE_URL}/settings/integrations`,
        })
        return result // Should return { redirectUrl: string }
      }
      catch (error) {
        console.error(
          `Error in initiateComposioConnection router for user ${userId}, integration ${input.integrationId}:`,
          error,
        )
        const message = error instanceof Error ? error.message : 'Failed to initiate connection.'
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message,
        })
      }
    }),

  /**
   * Mutation: Delete a specific Composio connection for the logged-in user.
   * Protected procedure - requires authentication (to ensure only owner deletes).
   * Although service doesn't strictly need userId, we keep it protected.
   */
  deleteUserComposioConnection: protectedProcedure
    .input(DeleteConnectionSchema)
    .mutation(async ({ input }) => {
      try {
        // Service function only needs connectionId
        const success = await deleteUserComposioConnection(input.connectionId)
        return { success }
      }
      catch (error) {
        console.error(
          `Error in deleteUserComposioConnection router for connection ${input.connectionId}:`,
          error,
        )
        const message = error instanceof Error ? error.message : 'Failed to delete connection.'
        const code = message === 'Connection not found.' ? 'NOT_FOUND' : 'INTERNAL_SERVER_ERROR'
        throw new TRPCError({
          code,
          message,
        })
      }
    }),
})

export type ComposioRouter = typeof composioRouter
