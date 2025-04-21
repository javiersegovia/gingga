import { queryOptions, useQuery } from '@tanstack/react-query'
import { $isAdmin, $isAgentOwner } from './permission.api'

export function isAdminQueryOptions() {
  return queryOptions({
    queryKey: ['permissions', 'isAdmin'],
    queryFn: () => $isAdmin(),
    // Stale time can be adjusted based on how often roles might change
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function isAgentOwnerQueryOptions(agentId: string | undefined) {
  return queryOptions({
    queryKey: ['permissions', 'isAgentOwner', agentId],
    // Wrap the input object in a 'data' property as expected by validated server functions
    queryFn: () => $isAgentOwner({ data: { agentId: agentId! } }),
    // Disable the query if agentId is not provided
    enabled: !!agentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to check if the current user is an admin.
 */
export function useIsAdmin() {
  return useQuery(isAdminQueryOptions())
}

/**
 * Hook to check if the current user owns a specific agent.
 * @param agentId - The ID of the agent to check ownership for.
 */
export function useIsAgentOwner(agentId: string | undefined) {
  return useQuery(isAgentOwnerQueryOptions(agentId))
}
