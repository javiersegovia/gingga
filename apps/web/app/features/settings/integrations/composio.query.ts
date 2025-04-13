import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  $getComposioIntegrations,
  $getComposioIntegration,
  $getUserComposioConnections,
  $deleteUserComposioConnection,
} from './composio.api' // Assuming API functions are exported
import type { ComposioAppName } from './composio.schema'

// --- Query Key Factory ---

export const composioQueryKeys = {
  all: ['composio'] as const,
  integrations: () => [...composioQueryKeys.all, 'integrations'] as const,
  integration: (appName: ComposioAppName) =>
    [...composioQueryKeys.integrations(), appName] as const,
  connections: () => [...composioQueryKeys.all, 'connections'] as const,
  connection: (id: string) => [...composioQueryKeys.connections(), id] as const, // For potential future use if we fetch single connections
}

// --- Query Options ---

export const composioIntegrationsQueryOptions = queryOptions({
  queryKey: composioQueryKeys.integrations(),
  queryFn: $getComposioIntegrations,
})

export const composioIntegrationQueryOptions = (appName: ComposioAppName) =>
  queryOptions({
    queryKey: composioQueryKeys.integration(appName),
    queryFn: async () => $getComposioIntegration({ data: { appName } }),
    enabled: !!appName, // Only run if appName is provided
  })

export const userComposioConnectionsQueryOptions = queryOptions({
  queryKey: composioQueryKeys.connections(),
  queryFn: $getUserComposioConnections,
})

/**
 * Hook to fetch details for a specific Composio integration.
 */
export function useGetComposioIntegration(appName: ComposioAppName) {
  return useQuery(composioIntegrationQueryOptions(appName))
}

/**
 * Hook to fetch the current user's active Composio connections.
 */
export function useGetUserComposioConnections() {
  return useQuery(userComposioConnectionsQueryOptions)
}

/**
 * Mutation hook to delete a specific Composio connection.
 */
export function useDeleteUserComposioConnection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: $deleteUserComposioConnection,
    onSuccess: ({ success }, { data: { connectionId } }) => {
      if (success) {
        console.log(`Connection ${connectionId} deleted successfully.`)
        // Invalidate the user connections query to refresh the list
        queryClient.invalidateQueries({ queryKey: composioQueryKeys.connections() })
        // Potentially invalidate specific connection details if cached elsewhere
      }
    },
    onError: (error, variables) => {
      console.error(`Error deleting connection ${variables.data?.connectionId}:`, error)
      // Handle error display in the component
    },
  })
}
