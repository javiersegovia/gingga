import type {
  ComposioAppName,
} from '~/features/composio/composio.schema' // Combine imports
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTRPC } from '~/lib/trpc/react'

/**
 * Hook to fetch the list of available Composio integrations.
 */
export function useGetComposioIntegrationsQuery() {
  const trpc = useTRPC()
  return useQuery(trpc.composio.getComposioIntegrations.queryOptions())
}

/**
 * Hook to fetch details for a specific Composio integration.
 */
export function useGetComposioIntegrationQuery(appName: ComposioAppName | undefined) {
  const trpc = useTRPC()
  // Pass input as first arg, RQ options as second
  return useQuery(
    trpc.composio.getComposioIntegrationByAppName.queryOptions(
      { appName: appName! }, // Input object
      { enabled: !!appName }, // RQ options
    ),
  )
}

/**
 * Hook to fetch the current user's active Composio connections.
 */
export function useGetUserComposioConnectionsQuery() {
  const trpc = useTRPC()
  return useQuery(trpc.composio.getUserComposioConnections.queryOptions())
}

/**
 * Mutation hook to initiate a new Composio connection.
 */
export function useInitiateComposioConnectionMutation() {
  // const queryClient = useQueryClient() // Not needed here
  const trpc = useTRPC()
  return useMutation(
    trpc.composio.initiateComposioConnection.mutationOptions({
      onSuccess: (data) => {
        if (data.redirectUrl) {
          window.location.href = data.redirectUrl
        }
      },
      onError: (error) => {
        console.error('Error initiating Composio connection:', error)
        // Handle error display in the component
      },
    }),
  )
}

/**
 * Mutation hook to delete a specific Composio connection.
 */
export function useDeleteUserComposioConnectionMutation() {
  const queryClient = useQueryClient()
  const trpc = useTRPC()
  return useMutation(
    trpc.composio.deleteUserComposioConnection.mutationOptions({
      onSuccess: async (data) => {
        if (data.success) {
          void queryClient.invalidateQueries({ queryKey: trpc.composio.getUserComposioConnections.queryKey() })
        }
      },
      onError: (error, variables) => {
        console.error(
          `Error deleting connection ${variables.connectionId}:`,
          error,
        )
      },
    }),
  )
}
