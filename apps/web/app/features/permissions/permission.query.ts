import { queryOptions, useQuery } from '@tanstack/react-query'
import { $isAdmin, $isAgentOwner } from './permission.api'

export const isAdminQueryOptions = () =>
  queryOptions({
    queryKey: ['permissions', 'isAdmin'],
    queryFn: () => $isAdmin(),
    // Stale time can be adjusted based on how often roles might change
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

export const isAgentOwnerQueryOptions = (agentId: string | undefined) =>
  queryOptions({
    queryKey: ['permissions', 'isAgentOwner', agentId],
    // Wrap the input object in a 'data' property as expected by validated server functions
    queryFn: () => $isAgentOwner({ data: { agentId: agentId! } }),
    // Disable the query if agentId is not provided
    enabled: !!agentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

/**
 * Hook to check if the current user is an admin.
 */
export const useIsAdmin = () => {
  return useQuery(isAdminQueryOptions())
}

/**
 * Hook to check if the current user owns a specific agent.
 * @param agentId - The ID of the agent to check ownership for.
 */
export const useIsAgentOwner = (agentId: string | undefined) => {
  return useQuery(isAgentOwnerQueryOptions(agentId))
}
